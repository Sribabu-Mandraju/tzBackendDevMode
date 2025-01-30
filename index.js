import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import NodeCache from "node-cache";


import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import qrRoutes from './routes/qrRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import projectExpoRoutes from './routes/projectExpoRoutes.js';
import crackedRoutes from './routes/crackedRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js'

import adminTokenCheck from "./middleware/adminTokenCheck.js";
import { getAllSignUsers } from "./controllers/userControllers.js";

//middleware
dotenv.config();
const app = express();
const nodeCache=new NodeCache({
  stdTTL:60
})
app.use(express.json());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(cors('*'));

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port 4001 🔥`);
      console.log("Database Connected Successfully ");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes
app.use("/user", userRoutes);
app.use("/events", eventRoutes);
app.use("/workshops", workshopRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);
app.use("/room", roomRoutes);
app.use("/qr",qrRoutes);
app.use("/uploads",uploadRoutes)
app.use("/projectExpo",projectExpoRoutes);
app.use("/crack",crackedRoutes)
app.use("/hackathon",hackathonRoutes);


app.get("/signusers", adminTokenCheck, getAllSignUsers);
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to website of the teckzite" });
});