const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

// Lazily construct S3 client only if env vars are present
const getS3Client = () => {
  if (!REGION) throw new Error('AWS_REGION is not configured');
  return new S3Client({ region: REGION });
};

exports.getPresignedUrl = async (req, res) => {
  try {
    if (!BUCKET) return res.status(500).json({ message: 'S3 bucket not configured on server' });

    const { filename, contentType } = req.query;
    if (!filename) return res.status(400).json({ message: 'filename query param required' });

    const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const s3 = getS3Client();

    const putParams = {
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType || 'application/octet-stream',
    };

    const command = new PutObjectCommand(putParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 10 }); // 10 minutes

    res.json({ url, key, bucket: BUCKET });
  } catch (err) {
    console.error('getPresignedUrl error', err);
    res.status(500).json({ message: 'Failed to get presigned url' });
  }
};
