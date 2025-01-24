import Hackathon from "../models/hackathonModel.js";
// Create a new Hackathon entry
export const createHackathon = async (req, res) => {
  try {
    const { teamMembers, projectName, abstract, file, problemStatementNumber } = req.body;

    // Validate request body
    if (!teamMembers || !projectName || !abstract || !file || !problemStatementNumber) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const hackathon = new Hackathon({ teamMembers, projectName, abstract, file, problemStatementNumber });
    await hackathon.save();
    res.status(201).json({ message: "Hackathon entry created successfully!", hackathon });
  } catch (error) {
    res.status(500).json({ message: "Error creating Hackathon entry", error });
  }
};

// Get all Hackathon entries
export const getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.status(200).json(hackathons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Hackathon entries", error });
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

    const hackathon = await Hackathon.findByIdAndUpdate(id, updates, { new: true });

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    res.status(200).json({ message: "Hackathon entry updated successfully!", hackathon });
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

    res.status(200).json({ message: "Team member added successfully!", hackathon });
  } catch (error) {
    res.status(500).json({ message: "Error adding team member", error });
  }
};

// Remove a team member from a Hackathon
export const removeTeamMember = async (req, res) => {
  try {
    const { id, tkzid } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon entry not found." });
    }

    hackathon.teamMembers = hackathon.teamMembers.filter((member) => member.tkzid !== tkzid);
    await hackathon.save();

    res.status(200).json({ message: "Team member removed successfully!", hackathon });
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
