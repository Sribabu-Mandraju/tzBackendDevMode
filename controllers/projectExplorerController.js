import ProjectExpo from '../models/projectExpo.js'; // Adjust the path as needed
import User from '../models/userModel.js';

// Create a new ProjectExpo
export const createProject = async (req, res) => {
  try {
    const { teamMembers, projectName, abstract, file, problemStatementNumber } = req.body;

    // Validate `teamMembers`
    const tzids = teamMembers.map((member) => member.tkzid);
    const validUsers = await User.find({ tzkid: { $in: tzids } }).select('tzkid').lean();
    const validTzidList = validUsers.map((user) => user.tzkid);

    const invalidTzids = tzids.filter((tzid) => !validTzidList.includes(tzid));
    if (invalidTzids.length > 0) {
      return res.status(400).json({
        error: 'Invalid team member TZIDs provided',
        invalidTzids,
      });
    }

    // Validate `problemStatementNumber`
    if (![1, 2, 3, 4, 5, 6].includes(problemStatementNumber)) {
      return res.status(400).json({
        error: 'Invalid problemStatementNumber. Allowed values are [1, 2, 3, 4, 5, 6]',
      });
    }

    // Create a new ProjectExpo document
    const newProject = new ProjectExpo({ teamMembers, projectName, abstract, file, problemStatementNumber });
    await newProject.save();

    res.status(201).json({ message: 'Project created successfully', data: newProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};

// Get all ProjectExpo documents
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectExpo.find();
    res.status(200).json({ data: projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
};

// Update a ProjectExpo by ID
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMembers, problemStatementNumber, ...otherData } = req.body;

    // Validate `teamMembers` if provided
    if (teamMembers) {
      const tzids = teamMembers.map((member) => member.tkzid);
      const validUsers = await User.find({ tzkid: { $in: tzids } }).select('tzkid').lean();
      const validTzidList = validUsers.map((user) => user.tzkid);

      const invalidTzids = tzids.filter((tzid) => !validTzidList.includes(tzid));
      if (invalidTzids.length > 0) {
        return res.status(400).json({
          error: 'Invalid team member TZIDs provided',
          invalidTzids,
        });
      }
    }

    // Validate `problemStatementNumber` if provided
    if (problemStatementNumber && ![1, 2, 3, 4, 5, 6].includes(problemStatementNumber)) {
      return res.status(400).json({
        error: 'Invalid problemStatementNumber. Allowed values are [1, 2, 3, 4, 5, 6]',
      });
    }

    // Update the ProjectExpo document
    const updatedData = {
      ...otherData,
      ...(teamMembers && { teamMembers }),
      ...(problemStatementNumber && { problemStatementNumber }),
    };

    const updatedProject = await ProjectExpo.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', data: updatedProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
};

// Delete a ProjectExpo by ID
export const deleteProject = async (req, res) => {
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
};
