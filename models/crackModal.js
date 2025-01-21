import mongoose from "mongoose";

const crackedUserSchema = new mongoose.Schema({
  collegeId: { type: String, required: true, unique: true },
  crackedAt: { type: Date, default: Date.now },
});

export default mongoose.model("CrackedUser", crackedUserSchema);
