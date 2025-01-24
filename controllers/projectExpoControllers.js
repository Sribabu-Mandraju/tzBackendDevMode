import ProjectExpo from "../models/projectExpoModel.js";

// Create a new ProjectExpo entry
export const createProjectExpo = async (req, res) => {
  try {
    const { teamMembers, projectName, abstract, file, problemStatementNumber } = req.body;

    if (!teamMembers || !projectName || !abstract || !file || !problemStatementNumber) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const projectExpo = new ProjectExpo({ teamMembers, projectName, abstract, file, problemStatementNumber });
    await projectExpo.save();

    res.status(201).json({ message: "ProjectExpo entry created successfully!", projectExpo });
  } catch (error) {
    res.status(500).json({ message: "Error creating ProjectExpo entry", error });
  }
};

// Get all ProjectExpo entries
export const getAllProjectExpos = async (req, res) => {
  try {
    const projectExpos = await ProjectExpo.find();
    res.status(200).json(projectExpos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ProjectExpo entries", error });
  }
};

// Get a specific ProjectExpo by ID
export const getProjectExpoById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectExpo = await ProjectExpo.findById(id);

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    res.status(200).json(projectExpo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ProjectExpo entry", error });
  }
};

// Update a ProjectExpo entry
export const updateProjectExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const projectExpo = await ProjectExpo.findByIdAndUpdate(id, updates, { new: true });

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    res.status(200).json({ message: "ProjectExpo entry updated successfully!", projectExpo });
  } catch (error) {
    res.status(500).json({ message: "Error updating ProjectExpo entry", error });
  }
};

// Delete a ProjectExpo entry
export const deleteProjectExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const projectExpo = await ProjectExpo.findByIdAndDelete(id);

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    res.status(200).json({ message: "ProjectExpo entry deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ProjectExpo entry", error });
  }
};

// Add a team member to a ProjectExpo
export const addTeamMemberToProjectExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = req.body;

    const projectExpo = await ProjectExpo.findById(id);

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    projectExpo.teamMembers.push(teamMember);
    await projectExpo.save();

    res.status(200).json({ message: "Team member added successfully!", projectExpo });
  } catch (error) {
    res.status(500).json({ message: "Error adding team member", error });
  }
};

// Remove a team member from a ProjectExpo
export const removeTeamMemberFromProjectExpo = async (req, res) => {
  try {
    const { id, tkzid } = req.params;

    const projectExpo = await ProjectExpo.findById(id);

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    projectExpo.teamMembers = projectExpo.teamMembers.filter((member) => member.tkzid !== tkzid);
    await projectExpo.save();

    res.status(200).json({ message: "Team member removed successfully!", projectExpo });
  } catch (error) {
    res.status(500).json({ message: "Error removing team member", error });
  }
};

// Get all team members of a ProjectExpo
export const getTeamMembersOfProjectExpo = async (req, res) => {
  try {
    const { id } = req.params;

    const projectExpo = await ProjectExpo.findById(id);

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    res.status(200).json(projectExpo.teamMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team members", error });
  }
};
