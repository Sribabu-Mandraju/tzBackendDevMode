import multer from 'multer';
import path from 'path';
import { format } from 'date-fns';

// File filter function to only allow specific MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/tiff',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDFs and images are allowed.'), false);
  }
};

// Set up the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved temporarily
  },
  filename: (req, file, cb) => {
    const currentDate = format(new Date(), 'yyyy-MM-dd_HH-mm-ss'); // Format current date and time
    const fileExtension = path.extname(file.originalname); // Extract file extension
    const filename = `${currentDate}${fileExtension}`; // Combine date and extension to create unique filename
    cb(null, filename);
  }
});

// Initialize multer with configuration
export const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB file size limit
  fileFilter: fileFilter,
});
