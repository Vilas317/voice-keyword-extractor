const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const groq = require("../services/groq");

const router = express.Router();

// --------------------
// Create uploads folder
// --------------------
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ uploads folder created");
}

// --------------------
// Multer
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  },
});

const upload = multer({ storage });

// --------------------
// Route
// --------------------
router.post(
  "/transcribe",
  upload.single("audio"),
  async (req, res) => {
    let uploadedFile = null;

    try {
      console.log("========== NEW REQUEST ==========");

      if (!req.file) {
        return res.status(400).json({
          message: "Audio file is required",
        });
      }

      uploadedFile = req.file.path;

      console.log("✅ File uploaded");
      console.log(req.file);

      // ==========================
      // Whisper
      // ==========================
      console.log("🎤 Starting transcription...");

      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(uploadedFile),
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json",
        language: "en",
      });

      const transcript = transcription.text;

      console.log("✅ Transcript:");
      console.log(transcript);

      // ==========================
      // Keyword Extraction
      // ==========================
      console.log("🧠 Extracting keywords...");

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              'Extract only the important keywords. Return ONLY valid JSON like {"keywords":["keyword1","keyword2"]}.',
          },
          {
            role: "user",
            content: transcript,
          },
        ],
      });

      const response = completion.choices[0].message.content;

      console.log("LLM Response:");
      console.log(response);

      let keywords = [];

      try {
        keywords = JSON.parse(response).keywords || [];
      } catch (err) {
        console.error("Keyword parsing failed:");
        console.error(err);
      }

      return res.json({
        transcript,
        keywords,
      });
    } catch (err) {
      console.error("========== ERROR ==========");
      console.error(err);

      if (err.error) {
        console.error(err.error);
      }

      if (err.response) {
        console.error(err.response.data);
      }

      return res.status(500).json({
        message: "Transcription failed",
        error: err.message,
      });
    } finally {
      if (uploadedFile && fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
        console.log("🗑 Uploaded file deleted");
      }
    }
  }
);

module.exports = router;