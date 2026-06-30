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

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    console.log("Uploaded File:");
    console.log(req.file);

    // -----------------------------
    // Speech → Text
    // -----------------------------
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
      language: "en",
    });

    const transcript = transcription.text;

    console.log("Transcript:");
    console.log(transcript);

    // -----------------------------
    // Keyword Extraction
    // -----------------------------
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            'Extract only the important keywords. Return ONLY valid JSON in this format: {"keywords":["keyword1","keyword2"]}',
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0,
    });

    const content = completion.choices[0].message.content;

    console.log("LLM Response:");
    console.log(content);

    let keywords = [];

    try {
      keywords = JSON.parse(content).keywords;
    } catch (err) {
      console.error("Failed to parse keywords:", err);
    }

    // Delete temporary uploaded file
    fs.unlinkSync(req.file.path);

    return res.json({
      transcript,
      keywords,
    });
  } catch (error) {
    console.error("========== ERROR ==========");
    console.error(error);
  
    if (error.response) {
      console.error(error.response.data);
    }
  
    if (error.error) {
      console.error(error.error);
    }
  
    console.error("===========================");
  
    res.status(500).json({
      message: "Transcription failed",
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;