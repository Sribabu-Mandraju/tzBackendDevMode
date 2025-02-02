import ProjectExpo from "../models/projectExpoModel.js";
import User from "../models/userModel.js";

export const createProjectExpo = async (req, res) => {
  try {
    let { teamMembers, projectName, abstract, file, problemStatementNumber } =
      req.body;

    if (
      !teamMembers ||
      !projectName ||
      !abstract ||
      !file ||
      !problemStatementNumber
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Standardize teamMembers' data
    teamMembers = teamMembers.map((member) => ({
      tzkid: member.tzkid
        ? String(member.tzkid).replace(/\s+/g, "").toLowerCase()
        : undefined,
      name: member.name ? String(member.name).trim() : undefined,
      phoneNumber: member.phoneNumber
        ? String(member.phoneNumber).trim()
        : undefined,
    }));

    // Ensure team size constraints
    if (teamMembers.length < 1 || teamMembers.length > 4) {
      return res.status(400).json({
        message: "Team should have at least 2 and at most 5 members (4 + you).",
      });
    }

    // Add the requesting user as the 5th member
    const userTzkid = user.tzkid.replace(/\s+/g, "").toLowerCase();
    const userDetails = {
      tzkid: userTzkid,
      name: `${user.firstName} ${user.lastName}`.trim(),
      phoneNumber: user.phno.trim(),
    };
    teamMembers.push(userDetails); // Now total team size = 2 to 5

    // Check for duplicate tzkid in the teamMembers list
    const uniqueTzkids = new Set(teamMembers.map((member) => member.tzkid));
    if (uniqueTzkids.size !== teamMembers.length) {
      return res
        .status(400)
        .json({ message: "Duplicate tzkid found in team members." });
    }

    // Validate all tzkid exist in the User schema
    const allTzkids = [...uniqueTzkids];
    const usersFound = await User.find({ tzkid: { $in: allTzkids } });

    if (usersFound.length !== allTzkids.length) {
      return res
        .status(400)
        .json({ message: "Some tzkid(s) do not exist in the database." });
    }

    // Check if any tzkid is already in another team in ProjectExpo
    const checkAll = await ProjectExpo.findOne({
      $and: [
        { "teamMembers.tzkid": { $all: allTzkids } }, // All tzkids must exist
        { $expr: { $eq: [{ $size: "$teamMembers" }, allTzkids.length] } }, // Ensure exact count match
      ],
    });
    if (!checkAll) {
      const existingProject = await ProjectExpo.findOne({
        "teamMembers.tzkid": { $in: allTzkids },
      });

      if (existingProject) {
        return res.status(409).json({
          message:
            "One or more team members are already part of another project.",
        });
      }
    }

    // Create the new project entry
    const projectExpo = new ProjectExpo({
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    });
    await projectExpo.save();

    res.status(201).json({
      message: "ProjectExpo entry created successfully!",
      projectExpo,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      message: "Error creating ProjectExpo entry",
      error: error.errors || error.message,
    });
  }
};

export const createProjectExpoByAdmin = async (req, res) => {
  try {
    let { teamMembers, projectName, abstract, file, problemStatementNumber } =
      req.body;

    if (
      !teamMembers ||
      !projectName ||
      !abstract ||
      !file ||
      !problemStatementNumber
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Standardize teamMembers' data
    teamMembers = teamMembers.map((member) => ({
      tzkid: member.tzkid
        ? String(member.tzkid).replace(/\s+/g, "").toLowerCase()
        : undefined,
      name: member.name ? String(member.name).trim() : undefined,
      phoneNumber: member.phoneNumber
        ? String(member.phoneNumber).trim()
        : undefined,
    }));

    // Ensure team size constraints
    if (teamMembers.length < 2 || teamMembers.length > 5) {
      return res.status(400).json({
        message: "Team should have at least 2 and at most 5 members.",
      });
    }

    // Check for duplicate tzkid in the teamMembers list
    const uniqueTzkids = new Set(teamMembers.map((member) => member.tzkid));
    if (uniqueTzkids.size !== teamMembers.length) {
      return res
        .status(400)
        .json({ message: "Duplicate tzkid found in team members." });
    }

    // Validate all tzkid exist in the User schema
    const allTzkids = [...uniqueTzkids];
    const usersFound = await User.find({
      tzkid: { $in: allTzkids },
    });

    if (usersFound.length !== allTzkids.length) {
      return res
        .status(400)
        .json({ message: "Some tzkid(s) do not exist in the database." });
    }

    // Check if any tzkid is already in another team in ProjectExpo
    const checkAll = await ProjectExpo.findOne({
      $and: [
        { "teamMembers.tzkid": { $all: allTzkids } }, // All tzkids must exist
        { $expr: { $eq: [{ $size: "$teamMembers" }, allTzkids.length] } }, // Ensure exact count match
      ],
    });
    if (!checkAll) {
      const existingProject = await ProjectExpo.findOne({
        "teamMembers.tzkid": { $in: allTzkids },
      });

      if (existingProject) {
        return res.status(409).json({
          message:
            "One or more team members are already part of another project.",
        });
      }
    }

    // Create the new project entry
    const projectExpo = new ProjectExpo({
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    });
    await projectExpo.save();

    res.status(201).json({
      message: "ProjectExpo entry created successfully!",
      projectExpo,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      message: "Error creating ProjectExpo entry",
      error: error.errors || error.message,
    });
  }
};

// Get all ProjectExpo entries
export const getAllProjectExpos = async (req, res) => {
  try {
    const projectExpos = await ProjectExpo.find();
    res.status(200).json(projectExpos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ProjectExpo entries", error });
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
    res
      .status(500)
      .json({ message: "Error fetching ProjectExpo entry", error });
  }
};

// Update a ProjectExpo entry
export const updateProjectExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const projectExpo = await ProjectExpo.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!projectExpo) {
      return res.status(404).json({ message: "ProjectExpo entry not found." });
    }

    res.status(200).json({
      message: "ProjectExpo entry updated successfully!",
      projectExpo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ProjectExpo entry", error });
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

    res
      .status(200)
      .json({ message: "ProjectExpo entry deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ProjectExpo entry", error });
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

    res
      .status(200)
      .json({ message: "Team member added successfully!", projectExpo });
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

    projectExpo.teamMembers = projectExpo.teamMembers.filter(
      (member) => member.tkzid !== tkzid
    );
    await projectExpo.save();

    res
      .status(200)
      .json({ message: "Team member removed successfully!", projectExpo });
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
