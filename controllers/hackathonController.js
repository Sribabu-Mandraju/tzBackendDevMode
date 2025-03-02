import Hackathon from "../models/hackathonModel.js";
import User from "../models/userModel.js";

// Create a new Hackathon entry
// export const createHackathon = async (req, res) => {
//   try {
//     let {
//       teamMembers,
//       projectName,
//       abstract,
//       file,
//       problemStatementNumber,
//     } = req.body;

//     if (
//       !teamMembers ||
//       !projectName ||
//       !abstract ||
//       !file ||
//       !problemStatementNumber
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided." });
//     }

//     const user = await User.findById(req.user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Standardize teamMembers' data
//     teamMembers = teamMembers.map((member) => ({
//       tzkid: member.tzkid
//         ? String(member.tzkid).replace(/\s+/g, "").toLowerCase()
//         : undefined,
//       name: member.name ? String(member.name).trim() : undefined,
//       phoneNumber: member.phoneNumber
//         ? String(member.phoneNumber).trim()
//         : undefined,
//       branch: member.branch ? String(member.branch).trim() : undefined,
//     }));

//     // Ensure team size constraints
//     if (teamMembers.length < 1 || teamMembers.length > 4) {
//       return res.status(400).json({
//         message: "Team should have at least 2 and at most 5 members (4 + you).",
//       });
//     }

//     // Add the requesting user as the 5th member
//     const userTzkid = user.tzkid.replace(/\s+/g, "").toLowerCase();
//     const userDetails = {
//       tzkid: userTzkid,
//       name: `${user.firstName} ${user.lastName}`.trim(),
//       phoneNumber: user.phno.trim(),
//     };
//     teamMembers.push(userDetails); // Now total team size = 2 to 5

//     // Check for duplicate tzkid in the teamMembers list
//     const uniqueTzkids = new Set(teamMembers.map((member) => member.tzkid));
//     if (uniqueTzkids.size !== teamMembers.length) {
//       return res
//         .status(400)
//         .json({ message: "Duplicate tzkid found in team members." });
//     }

//     // Validate all tzkid exist in the User schema
//     const allTzkids = [...uniqueTzkids];
//     const usersFound = await User.find({ tzkid: { $in: allTzkids } });

//     if (usersFound.length !== allTzkids.length) {
//       return res
//         .status(400)
//         .json({ message: "Some tzkid(s) do not exist in the database." });
//     }

//     // Check if any tzkid is already in another team in ProjectExpo
//     const existingHackathon = await Hackathon.findOne({
//       "teamMembers.tzkid": { $in: allTzkids },
//     });

//     if (existingHackathon) {
//       return res.status(409).json({
//         message:
//           "One or more team members are already part of another project.",
//       });
//     }

//     // Create the new project entry
//     const hackathon = new Hackathon({
//       teamMembers,
//       projectName,
//       abstract,
//       file,
//       problemStatementNumber,
//     });
//     await hackathon.save();

//     res
//       .status(201)
//       .json({ message: "Hackathon entry created successfully!", hackathon });
//   } catch (error) {
//     console.error("Detailed Error:", error);
//     res.status(500).json({
//       message: "Error creating Hackathon entry",
//       error: error.errors || error.message,
//     });
//   }
// };

// export const createHackathonByAdmin = async (req, res) => {
//   console.log("called createHackathonByAdmin");
//   try {
//     let {
//       teamMembers,
//       projectName,
//       abstract,
//       file,
//       problemStatementNumber,
//     } = req.body;

//     if (
//       !teamMembers ||
//       !projectName ||
//       !abstract ||
//       !file ||
//       !problemStatementNumber
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided." });
//     }

//     // Standardize teamMembers' data
//     teamMembers = teamMembers.map((member) => ({
//       tzkid: member.tzkid
//         ? String(member.tzkid).replace(/\s+/g, "").toLowerCase()
//         : undefined,
//       name: member.name ? String(member.name).trim() : undefined,
//       phoneNumber: member.phoneNumber
//         ? String(member.phoneNumber).trim()
//         : undefined,
//       branch: member.branch ? String(member.branch).trim() : undefined,
//     }));

//     // Ensure team size constraints
//     if (teamMembers.length < 2 || teamMembers.length > 5) {
//       return res.status(400).json({
//         message: "Team should have at least 2 and at most 5 members.",
//       });
//     }

//     // Check for duplicate tzkid in the teamMembers list
//     const uniqueTzkids = new Set(teamMembers.map((member) => member.tzkid));
//     if (uniqueTzkids.size !== teamMembers.length) {
//       return res
//         .status(400)
//         .json({ message: "Duplicate tzkid found in team members." });
//     }

//     // Validate all tzkid exist in the User schema
//     const allTzkids = [...uniqueTzkids];
//     const usersFound = await User.find({ tzkid: { $in: allTzkids } });

//     if (usersFound.length !== allTzkids.length) {
//       return res
//         .status(400)
//         .json({ message: "Some tzkid(s) do not exist in the database." });
//     }

//     // Check if any tzkid is already in another team in ProjectExpo
//     const existingHackathon = await Hackathon.findOne({
//       "teamMembers.tzkid": { $in: allTzkids },
//     });

//     if (existingHackathon) {
//       return res.status(409).json({
//         message:
//           "One or more team members are already part of another project.",
//       });
//     }

//     // Create the new project entry
//     const hackathon = new Hackathon({
//       teamMembers,
//       projectName,
//       abstract,
//       file,
//       problemStatementNumber,
//     });
//     await hackathon.save();

//     res
//       .status(201)
//       .json({ message: "Hackathon entry created successfully!", hackathon });
//   } catch (error) {
//     console.error("Detailed Error:", error);
//     res.status(500).json({
//       message: "Error creating Hackathon entry",
//       error: error.errors || error.message,
//     });
//   }
// };

export const createHackathon = async (req, res) => {
  try {
    let {
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    } = req.body;

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

    // Get detailed user information for all team members
    const allTzkids = [...uniqueTzkids];
    const usersFound = await User.find({ tzkid: { $in: allTzkids } });

    if (usersFound.length !== allTzkids.length) {
      return res.status(400).json({
        message: "Some tzkid(s) do not exist in the database.",
      });
    }

    // Check if projectName, abstract and file match "robothon"
    if (
      projectName?.toLowerCase() === "robothon" &&
      abstract?.toLowerCase() === "robothon" &&
      file?.toLowerCase() === "robothon"
    ) {
      // Count E4 and E3 students
      const e4Students = usersFound.filter((user) => user.year === "E4");
      const e3Students = usersFound.filter((user) => user.year === "E3");

      // Validation rules for E4 and E3 students
      if (e4Students.length > 0) {
        // If E4 student present, only one E3 allowed
        if (e3Students.length > 1) {
          return res.status(400).json({
            message:
              "When a 4th year student is present, only one 3rd year student is allowed in the team",
          });
        }
      } else {
        // If no E4 student, maximum two E3 students allowed
        if (e3Students.length > 2) {
          return res.status(400).json({
            message:
              "Without 4th year students, maximum two 3rd year students are allowed in the team",
          });
        }
      }
    }

    // Check if any tzkid is already in another team in ProjectExpo
    const checkAll = await Hackathon.findOne({
      $and: [
        { "teamMembers.tzkid": { $all: allTzkids } }, // All tzkids must exist
        { $expr: { $eq: [{ $size: "$teamMembers" }, allTzkids.length] } }, // Ensure exact count match
      ],
    });
    if (!checkAll) {
      const existingProject = await Hackathon.findOne({
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
    const hackathon = new Hackathon({
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    });
    await hackathon.save();

    res.status(201).json({
      message: "hackathon entry created successfully!",
      hackathon,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      message: "Error creating ProjectExpo entry",
      error: error.errors || error.message,
    });
  }
};

export const createHackathonByAdmin = async (req, res) => {
  try {
    let {
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    } = req.body;

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
    const usersFound = await User.find({ tzkid: { $in: allTzkids } });

    if (usersFound.length !== allTzkids.length) {
      return res
        .status(400)
        .json({ message: "Some tzkid(s) do not exist in the database." });
    }

    // Check robothon rules if applicable
    if (
      projectName?.toLowerCase() === "robothon" &&
      abstract?.toLowerCase() === "robothon" &&
      file?.toLowerCase() === "robothon"
    ) {
      // Count E4 and E3 students
      const e4Students = usersFound.filter((user) => user.year === "E4");
      const e3Students = usersFound.filter((user) => user.year === "E3");

      // Validation rules for E4 and E3 students
      if (e4Students.length > 0) {
        // If E4 student present, only one E3 allowed
        if (e3Students.length > 1) {
          return res.status(400).json({
            message:
              "When a 4th year student is present, only one 3rd year student is allowed in the team",
          });
        }
      } else {
        // If no E4 student, maximum two E3 students allowed
        if (e3Students.length > 2) {
          return res.status(400).json({
            message:
              "Without 4th year students, maximum two 3rd year students are allowed in the team",
          });
        }
      }
    }

    // Check if team already exists
    const checkAll = await Hackathon.findOne({
      $and: [
        { "teamMembers.tzkid": { $all: allTzkids } },
        { $expr: { $eq: [{ $size: "$teamMembers" }, allTzkids.length] } },
      ],
    });

    if (!checkAll) {
      const existingProject = await Hackathon.findOne({
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
    const hackathon = new Hackathon({
      teamMembers,
      projectName,
      abstract,
      file,
      problemStatementNumber,
    });
    await hackathon.save();

    res.status(201).json({
      message: "Hackathon entry created successfully!",
      hackathon,
    });
  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({
      message: "Error creating Hackathon entry",
      error: error.errors || error.message,
    });
  }
};

// Get all Hackathon entries
export const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.status(200).json(hackathons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Hackathon entries", error });
  }
};

// Get a specific Hackathon by ID
export const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    res.status(200).json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Hackathon entry", error });
  }
};

// Update a Hackathon entry
export const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hackathon = await Hackathon.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    res
      .status(200)
      .json({ message: "Hackathon entry updated successfully!", hackathon });
  } catch (error) {
    res.status(500).json({ message: "Error updating Hackathon entry", error });
  }
};

// Delete a Hackathon entry
export const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;
    const hackathon = await Hackathon.findByIdAndDelete(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    res.status(200).json({ message: "Hackathon entry deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Hackathon entry", error });
  }
};

// Add a team member to a Hackathon
export const addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = req.body;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    hackathon.teamMembers.push(teamMember);
    await hackathon.save();

    res
      .status(200)
      .json({ message: "Team member added successfully!", hackathon });
  } catch (error) {
    res.status(500).json({ message: "Error adding team member", error });
  }
};

// Remove a team member from a Hackathon
export const removeTeamMember = async (req, res) => {
  try {
    const { id, tzkid } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    hackathon.teamMembers = hackathon.teamMembers.filter(
      (member) => member.tzkid !== tzkid
    );
    await hackathon.save();

    res
      .status(200)
      .json({ message: "Team member removed successfully!", hackathon });
  } catch (error) {
    res.status(500).json({ message: "Error removing team member", error });
  }
};

// Get all team members of a Hackathon
export const getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    res.status(200).json(hackathon.teamMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team members", error });
  }
};
