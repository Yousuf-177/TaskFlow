const express = require("express");

const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController.js");
const upload = require("../middlewares/uploadMiddleware.js");
const cloudinary = require("../config/cloudinary.js");

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Upload image → Cloudinary
router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Stream the in-memory buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "taskflow/profiles", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });

    res.json({
      message: "Image Successfully Uploaded",
      ImageURL: result.secure_url, // permanent https:// Cloudinary URL
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cloudinary upload failed", error: error.message });
  }
});

module.exports = router;
