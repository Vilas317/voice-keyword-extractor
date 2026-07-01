const express = require("express");
const multer = require("multer");
const fs = require("fs");
const groq = require("../services/groq");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  },
});

const upload = multer({ storage });

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

      res.json({
        success: true,
        file: req.file,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
);

module.exports = router;