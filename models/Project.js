const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  path: { type: String, required: true },
  code: { type: String },
  type: { type: String, enum: ['file', 'folder'], default: 'file' },
  meta: { type: Object },
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  files: { type: [FileSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
