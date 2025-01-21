import bcrypt from "bcrypt";
import CrackedUser from "../models/crackModal.js";
import dotenv from "dotenv";
dotenv.config();

export const checkPassword = async (req, res) => {
  try {
    const { collegeId, password } = req.body;

    // Compare the entered password with the preset password
    const presetPassword = process.env.PRESET_PASSWORD;
    const isMatch = await bcrypt.compare(password, presetPassword);

    if (isMatch) {
      // If passwords match, store the user's details in CrackedUsers
      await CrackedUser.create({ collegeId });
      res.status(200).json({ message: "Password cracked successfully" });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const setPresetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the new preset password
    const hashedPassword = await bcrypt.hash(password, 10);

    // In a real-world scenario, you would update this in a secure storage or environment variable
    // For this example, we'll just send a success message
    res.status(200).json({ message: "Preset password updated successfully", hashedPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const isPasswordCracked = async (req, res) => {
  try {
    // Get all cracked users ordered by timestamp
    const crackedUsers = await CrackedUser.find().sort({ crackedAt: 1 }); // 1 for ascending order (oldest first)

    if (crackedUsers.length > 0) {
      const firstUser = crackedUsers[0]; // The first user based on timestamp
      res.status(200).json({
        isCracked: true,
        collegeId: firstUser.collegeId,
      });
    } else {
      res.status(200).json({
        isCracked: false,
        collegeId: null,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};