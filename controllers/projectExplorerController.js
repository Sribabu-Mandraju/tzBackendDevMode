const ProjectExpo = require('../models/projectExpo'); // Adjust the path as needed

// Controller for CRUD operations
const projectExpoController = {
  // Create a new ProjectExpo
  createProject: async (req, res) => {
    try {
      const { tzids, projectName, abstract, file } = req.body;

      // Check if tzids are valid
      const validTzids = await User.find({ tzkid: { $in: tzids } }).select('tzkid').lean();
      const validTzidList = validTzids.map(user => user.tzkid);

      const invalidTzids = tzids.filter(tzid => !validTzidList.includes(tzid));
      if (invalidTzids.length > 0) {
        return res.status(400).json({
          error: 'Invalid TZIDs provided',
          invalidTzids,
        });
      }

      // Create a new ProjectExpo document
      const newProject = new ProjectExpo({ tzids, projectName, abstract, file });
      await newProject.save();

      res.status(201).json({ message: 'Project created successfully', data: newProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
  },

  // Get all ProjectExpo documents
  getAllProjects: async (req, res) => {
    try {
      const projects = await ProjectExpo.find();
      res.status(200).json({ data: projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
  },

  // Update a ProjectExpo by ID
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedProject = await ProjectExpo.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.status(200).json({ message: 'Project updated successfully', data: updatedProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update project', details: error.message });
    }
  },

  // Delete a ProjectExpo by ID
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedProject = await ProjectExpo.findByIdAndDelete(id);

      if (!deletedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.status(200).json({ message: 'Project deleted successfully', data: deletedProject });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete project', details: error.message });
    }
  },
};

module.exports = projectExpoController;
