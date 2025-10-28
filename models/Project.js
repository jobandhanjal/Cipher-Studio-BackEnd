const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  code: { type: String },
  type: { type: String, enum: ['file', 'folder'], default: 'file' },
  meta: { type: Object },
});

// Enable mongoose timestamps so createdAt/updatedAt are managed automatically.
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  files: { type: [FileSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
