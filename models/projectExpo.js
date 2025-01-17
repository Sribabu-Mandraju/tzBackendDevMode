const mongoose = require('mongoose');

const projectExpoSchema = new mongoose.Schema({
  tzids: {
    type: [String], // Array of strings
    required: true,
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
});

const ProjectExpo = mongoose.model('ProjectExpo', projectExpoSchema);

module.exports = ProjectExpo;
