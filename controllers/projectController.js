const Project = require('../models/Project');

exports.saveProject = async (req, res) => {
  try {
    const { name, description, files } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    if (!description || !String(description).trim()) return res.status(400).json({ message: 'Project description required' });
    // Ensure owner is set from authenticated user
    const ownerId = req.user && (req.user.id || req.user._id);
    if (!ownerId) return res.status(401).json({ message: 'Authentication required' });
    // If a project with this name already exists for the same owner, reject and let the client prompt for a different name.
    const exists = await Project.findOne({ owner: ownerId, name }).lean();
    if (exists) {
      return res.status(409).json({ message: 'A project with this name already exists. Please choose a different name.' });
    }

    const project = new Project({ name, description, files, owner: ownerId });
    await project.save();
    res.json({ id: project._id, name: project.name, description: project.description, message: 'Project saved' });
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
    // Authorization: only owner can access
    const requester = req.user && (req.user.id || req.user._id);
    if (!requester) return res.status(401).json({ message: 'Authentication required' });
    if (!project.owner || project.owner.toString() !== requester.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(project);
  } catch (err) {
    console.error('getProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, files } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    const requester = req.user && (req.user.id || req.user._id);
    if (!requester) return res.status(401).json({ message: 'Authentication required' });
    if (!project.owner || project.owner.toString() !== requester.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (name) project.name = name;
    if (typeof description !== 'undefined') project.description = description;
    if (files) project.files = files;
    await project.save();
    res.json({ id: project._id, message: 'Project updated' });
  } catch (err) {
    console.error('updateProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listProjects = async (req, res) => {
  try {
    const requester = req.user && (req.user.id || req.user._id);
    if (!requester) return res.status(401).json({ message: 'Authentication required' });
    // Return only projects owned by the authenticated user
    const projects = await Project.find({ owner: requester }).sort({ updatedAt: -1 }).limit(20).lean();
    res.json(projects);
  } catch (err) {
    console.error('listProjects error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const requester = req.user && (req.user.id || req.user._id);
    if (!requester) return res.status(401).json({ message: 'Authentication required' });
    if (!project.owner || project.owner.toString() !== requester.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Use Model.deleteOne to ensure removal works even if `project` is a plain object
    // (some callers may return plain objects). Using the model method avoids relying
    // on document instance methods that may be unavailable in certain Mongoose configs.
    await Project.deleteOne({ _id: id });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('deleteProject error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
