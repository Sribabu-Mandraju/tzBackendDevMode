import App from "../models/appModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { tzkId, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ tzkid: tzkId, email })
      .populate({
        path: "regEvents",
        select: "img name _id",
      })
      .populate({
        path: "regWorkshop",
        select: "workshopImg name _id",
      });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingApp = await App.findOne({ tzkId });
    if (existingApp) {
      return res.status(400).json({ message: "App already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create App
    const newApp = await App.create({
      tzkId,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({ user: existingUser, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { tzkId, password } = req.body;

    // Check if admin exists
    const admin = await App.findOne({ tzkId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Get user details
    const user = await User.findOne({ tzkid: tzkId })
      .populate({
        path: "regEvents",
        select: "img name _id",
      })
      .populate({
        path: "regWorkshop",
        select: "workshopImg name _id",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
