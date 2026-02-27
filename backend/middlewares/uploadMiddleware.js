const multer = require("multer");

// Use memory storage — file stays as a Buffer in req.file.buffer
// so we can stream it to Cloudinary without touching the disk.
const storage = multer.memoryStorage();

// File Filter — allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedType = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (allowedType.includes(file.mimetype)) cb(null, true);
  else {
    cb(
      new Error(
        "Only images (jpg, jpeg, png, gif, webp) and PDF files are allowed",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
