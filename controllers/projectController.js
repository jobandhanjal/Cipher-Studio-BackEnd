const Project = require('../models/Project');

exports.saveProject = async (req, res) => {
  try {
    const { name, files } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });

    const project = new Project({ name, files });
    await project.save();
    res.json({ id: project._id, message: 'Project saved' });
  } catch (err) {
    console.error('saveProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error('getProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, files } = req.body;
    const project = await Project.findByIdAndUpdate(id, { name, files, updatedAt: Date.now() }, { new: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ id: project._id, message: 'Project updated' });
  } catch (err) {
    console.error('updateProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 }).limit(20).lean();
    res.json(projects);
  } catch (err) {
    console.error('listProjects error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('deleteProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
