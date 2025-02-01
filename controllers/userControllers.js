import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { instance } from "../index.js";
import crypto from "crypto";
import SignUser from "../models/signUserModel.js";
import { log } from "console";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import NodeCache from "node-cache";
const userCache = new NodeCache({ stdTTL: 3600 });
import { updateUserCredits } from "../helpers/credits.helpers.js";
import { colleges } from "../constants/index.js";

export const loginUser = async (req, res) => {
  const { email, sub } = req.body;

  try {
    const user = await User.findOne({ email })
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

    const passwordMatch = await bcrypt.compare(sub, user.sub);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Attempt to login" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    firstName,
    amountPaid,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
    gender,
    img,
    state,
    district,
    idUpload,
    city,
  } = req.body;

  try {
    const sub = await bcrypt.hash(email, 12);
    const user = await User.findOneAndUpdate(
      { tzkid: id },
      {
        email,
        firstName,
        lastName,
        college,
        amountPaid,
        sub,
        phno,
        year,
        branch,
        collegeId,
        gender,
        img,
        state,
        district,
        idUpload,
        city,
      }
    );

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }
    userCache.del("users");
    return res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  const {
    email,
    firstName,
    amountPaid,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
    gender,
    img,
    state,
    district,
    idUpload,
    city,
    mode,
    referredBy,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!mode) {
      return res.status(400).json({ error: "Mode Error" });
    }

    // Assuming razorpay_order_id is defined somewhere
    if (mode !== "offline_mode" && !razorpay_order_id) {
      return res.status(400).json({ error: "Payment Check Error" });
    }

    const sub = await bcrypt.hash(email, 12);
    const user = await User.create({
      email,
      firstName,
      lastName,
      college,
      amountPaid,
      phno,
      year,
      branch,
      collegeId,
      gender,
      img,
      state,
      district,
      idUpload,
      sub,
      city,
      referredBy,
      mode,
    });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Generate the URL based on user _id
    const qrUrl = `https://teckzite.org/user/user-info/${user._id}`;
    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrUrl);

    // Save the QR code image to the database along with other user information
    user.qrimage = qrCodeImage; // Assuming you have a field named qrCodeImage in your User schema
    await user.save();

    // Send email
    await sendemail(user);

    userCache.del("users");
    return res
      .status(200)
      .json({ user, token, message: "Registration Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    let users = userCache.get("users");
    if (!users) {
      users = await User.find(
        {},
        "-sub -idUpload -refreals -regEvents -regWorkshop"
      ).lean();
      userCache.set("users", users);
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ tzkid: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const fetchUser = async (req, res) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "regEvents",
        select: "img name _id",
      })
      .populate({
        path: "regWorkshop",
        select: "workshopImg name _id",
      });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
  const {
    email,
    amount,
    firstName,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
  } = req.body;

  const domainPattern =
    /^(r|n|s|o|ro)[0-9]{6}@(rguktn|rguktong|rguktsklm|rguktrkv)\.ac\.in$/;

  const signUser = await SignUser.create({
    email,
    firstName,
    lastName,
    college,
    phno,
    year,
    branch,
    collegeId,
  });

  if (!signUser) {
    return res.status(500).json({ message: "Check your internet connection" });
  }

  let ramount = amount;
  if (domainPattern.test(email)) {
    const offset = email.startsWith("ro") ? 2 : 1;
    const studentId = email.substring(offset, offset + 6);

    ramount =
      studentId.startsWith("23") || studentId.startsWith("24")
        ? Number(process.env.FEE_RGUKT_PUC)
        : Number(process.env.FEE_RGUKT);
  } else {
    ramount = colleges.includes(college)
      ? Number(process.env.FEE_RGUKT)
      : Number(process.env.FEE_OUTSIDERS);
  }

  const order = await instance.orders.create({
    amount: Number(ramount * 100),
    currency: "INR",
  });

  if (!order.id) {
    res.status(200).send({ status: "Failure" });
  }
  res.status(200).send({ order, status: "success" });
};

export const paymentVerification = async (req, res) => {
  const {
    razorpay_payment_id,
    order_id,
    amount,
    razorpay_signature,
    userData,
  } = req.body;

  try {
    // Generate HMAC for signature verification
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
    hmac.update(order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    const isAuth = generated_signature === razorpay_signature;

    if (!isAuth) {
      return res.status(400).json({
        message: "Payment Failed Due to Signature not matched",
        success: false,
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate user mode
    if (!userData.mode) {
      return res.status(400).json({ error: "Mode Error" });
    }

    // Hash the email for subscription
    const sub = await bcrypt.hash(userData.email, 12);

    // Create new user in the database
    const user = await User.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      college: userData.college,
      phno: userData.phno,
      year: userData.year,
      branch: userData.branch,
      collegeId: userData.collegeId,
      gender: userData.gender,
      amountPaid: amount,
      img: userData.img,
      razorpay_order_id: order_id,
      state: userData.state,
      district: userData.district,
      idUpload: userData.idUpload,
      sub,
      city: userData.city,
      referredBy: userData.referredBy,
      mode: userData.mode,
    });

    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    // Generate QR Code and save it to the user document
    const qrUrl = `https://teckzite.vercel.app/user/user-info/${user._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrUrl);
    user.qrimage = qrCodeImage;
    await user.save();

    // Remove from SignUser collection if exists
    await SignUser.findOneAndDelete({ email: userData.email });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Handle referral logic
    if (userData.referredBy && userData.referredBy.length === 9) {
      const ref = await User.findOneAndUpdate(
        { tzkid: userData.referredBy.toLowerCase() },
        { $push: { refreals: user.tzkid } }
      );

      if (ref) {
        try {
          // Add credits to the referring user's account
          await updateUserCredits(userData.referredBy.toLowerCase(), 50);
        } catch (creditError) {
          console.error(
            "Error adding credits to referrer:",
            creditError.message
          );
        }
      } else {
        return res.status(200).json({
          token,
          user,
          success: true,
          message: "Registration Successful\nReferral was not valid",
        });
      }
    }

    // Send email notification
    console.log("called");
    await sendemail(user);

    // Clear user cache
    userCache.del("users");

    // Return successful response
    return res.status(200).json({
      success: true,
      token,
      user,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error in payment verification:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

const sendemail = async (user) => {
  console.log("called");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.email",
      service: "gmail",
      auth: {
        user: "codewithsiddhu@gmail.com",
        pass: "rntq kped xnte ucwm",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Craft the email content
    const mailOptions = {
      from: "noreply@gmail.com",
      to: user.email,
      subject: "Teckzite Registration Successful",
      html: `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Design</title>
    <style>
     body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #000;
    color: #00ffee;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.profile-container {
    width: 350px;
    background: linear-gradient(145deg, #002233, #001122);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
    overflow-y: auto; /* Enable scrolling */
    max-height: 90vh;
    padding: 20px;
    text-align: center;
    color: #00ffee;
    position: relative;
}

.profile-container::-webkit-scrollbar {
    width: 0; 
    height: 0;
}

.profile-container {
    scrollbar-width: none; 
}

.profile-container {
    -ms-overflow-style: none; 
}


.profile-header {
    position: relative;
    margin-bottom: 20px;
}

.profile-header::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 100px;
    background: linear-gradient(145deg, #00ffee, #004466);
    clip-path: polygon(100% 0, 100% 20%, 100% 84%, 86% 100%, 0 100%, 0 14%, 14% 0);
    z-index: -1;
}

.profile-header h1 {
    margin: 0;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    margin: 0 auto 10px;
    border-radius: 50%;
    background: linear-gradient(145deg, #00ffee, #004466);
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.teckid {
    display: inline-block;
    padding: 10px 20px;
    margin: 10px auto;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(145deg, #00ffee, #004466);
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 255, 255, 0.3);
    cursor: pointer;
}

.profile-details {
    background: linear-gradient(145deg, #002233, #001122);
    border: 1px solid #00ffee;
    border-radius: 10px;
    padding: 15px;
    text-align: left;
    font-size: 14px;
    line-height: 1.8;
    margin: 10px 0;
}

.profile-details span {
    font-weight: bold;
    color: #00ffee;
}

.logout-button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    color: #000;
    background: #00ffee;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

     
    </style>
</head>
<body>
    <div class="profile-container">
        <div class="profile-header">
            <div class="profile-avatar">
                <img src="https://api.spicezgold.com/download/file_1737715321555_robo.png" alt="Avatar">
            </div>
            <h3>Teckzite Registration Successful</h3>
        </div>
        <div class="teckid">
            <span>TZID: ${user.tzkid}</span>
        </div>
        <div class="profile-details">
            <p>Email: ${user.email}</p>
            <p>First Name: ${user.firstName}</p>
            <p>Last Name:${user.lastName}</p>
            <p>College: ${user.college}</p>
            <p>Phone Number: ${user.phno}</p>
            <p>Year: ${user.year}</p>
            <p>Branch: ${user.branch}</p>
            <p>College ID: ${user.collegeId}</p>
            <p>Gender: ${user.gender}</p>
            <p>Amount Paid: ${user.amountPaid}</p>
            <p>Location: ${user.state}, ${user.district}, ${user.city}</p>
            <p>Payment Mode: ${user.mode}</p>
            <img src="cid:qrimae" alt='qrimage' style="width: 100px; height: 100px;" />
          </div>
      
       
    </div>
</body>
</html>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          path: `${user.qrimage}`,
          cid: "qrimae",
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const getTopReferrals = async (req, res) => {
  try {
    const users = await User.find();
    users.sort((a, b) => b.refreals.length - a.refreals.length);
    const topUsers = users.slice(0, 10);

    const formattedUsers = topUsers.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      tzkid: user.tzkid,
      referralsCount: user.refreals.length,
    }));

    return res.status(200).json({ leaderboard: formattedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllSignUsers = async (req, res) => {
  console.log("test");
  try {
    const signusers = await SignUser.find();
    return res.status(200).json({ signusers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params; // Assuming the ID of the user to be deleted is passed in the request parameters

  try {
    const user = await User.findOneAndDelete({ tzkid: id }); // Find and delete user based on tzkid

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userDeatilsonScan = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user by userId
    const user = await User.findById(userId);

    if (!user) {
      // If user not found, return 404 status
      return res.status(404).json({ message: "User not found" });
    }

    // If user found, return user data
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addCredits = async (req, res) => {
  const { tzkid, creditCount } = req.body;

  try {
    // Validate input
    if (!tzkid || typeof creditCount !== "number" || creditCount <= 0) {
      return res.status(400).json({
        message:
          "Invalid input. Please provide a valid Teckzite ID and a positive credit count.",
      });
    }

    // Find and update the user credits
    const updatedUser = await User.findOneAndUpdate(
      { tzkid },
      { $inc: { credits: creditCount } },
      { new: true, upsert: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user object
    res.status(200).json({
      message: "Credits added successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error adding credits:", error.message);
    res.status(500).json({
      message: "An error occurred while adding credits",
      error: error.message,
    });
  }
};
