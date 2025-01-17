import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize OAuth2 client with credentials from environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set the refresh token from the environment
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Create Google Drive instance
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

export async function uploadFileToGoogleDrive(req, res) {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Define the upload directory
    const uploadDir = 'secure_uploads/';
    const securePath = path.join(uploadDir, req.file.filename);

    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Move the uploaded file to the secure upload directory
    fs.renameSync(req.file.path, securePath);

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: req.file.originalname, // Use the original filename
        parents: ['1vTw_s7fovnGn8BCn1Yl-xlRD31IiK1O2'], // Google Drive folder ID
        mimeType: req.file.mimetype,
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(securePath),
      },
    });

    const fileId = response.data.id;

    // Set the file permissions for public access
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Retrieve the public file URL
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
    });

    // Log the file details for debugging
    console.log({
      fileId: fileId,
      webViewLink: result.data.webViewLink,
      webContentLink: result.data.webContentLink,
    });

    // Remove the file from the secure upload directory after upload
    fs.unlinkSync(securePath);

    // Return the file links as a response
    return res.json({
      message: 'File uploaded successfully to Google Drive.',
      fileId: fileId,
      webViewLink: result.data.webViewLink,
      webContentLink: result.data.webContentLink,
    });
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    return res.status(500).json({ error: 'Failed to upload the file to Google Drive.' });
  }
}
