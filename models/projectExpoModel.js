import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  tzkid: {
    type: String, // Unique identifier for each member
    required: true,
    unique: true,
  },
  name: {
    type: String, // Name of the team member
    // required: true,
  },
  phoneNumber: {
    type: String, // Phone number of the team member
    // required: true,
  },
  branch: {
    type: String, // Branch of the team member
    // required: true,
  },
});

const projectExpoSchema = new mongoose.Schema({
  teamMembers: {
    type: [teamMemberSchema], // Array of team members
    required: true,
    validate: [arrayLimit, "{PATH} must have at least one team member"],
  },
  projectName: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  file: {
    type: String, // URL or file path as a string
    required: true,
  },
  problemStatementNumber: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Enum with allowed values
    required: true,
  },
});

// Helper function for array validation
function arrayLimit(val) {
  return val.length > 0; // Ensure at least one team member exists
}

const ProjectExpo = mongoose.model("ProjectExpoNew", projectExpoSchema);

export default ProjectExpo;
