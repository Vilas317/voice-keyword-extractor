const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Create uploads folder automatically if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ uploads folder created");
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  },
});

const upload = multer({ storage });

// Debug Route
router.post(
  "/transcribe",
  (req, res, next) => {
    console.log("✅ Request reached /transcribe");
    next();
  },
  upload.single("audio"),
  (req, res, next) => {
    console.log("✅ Multer finished");
    next();
  },
  async (req, res) => {
    try {
      console.log("✅ Inside handler");

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      console.log("Uploaded file:");
      console.log(req.file);

      return res.json({
        success: true,
        message: "File uploaded successfully",
        file: req.file,
      });
    } catch (err) {
      console.error("❌ ERROR:");
      console.error(err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }
);

module.exports = router;