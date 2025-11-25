const express = require("express");

const router = express.Router();
const { protect } = require("../middlewares/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController.js");
const upload = require("../middlewares/uploadMiddleware.js")
// Auth Routes

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(403).json({ message: "File not uploaded" });
  }

  const ImageURL = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({ message: "Image Successfully Uploaded", ImageURL });
});

module.exports = router;
