# 🎤 Voice Keyword Extractor

A full-stack web application that records voice input, converts speech to text using **Groq Whisper**, extracts important keywords using **Llama 3.3**, and reads those keywords aloud using the browser's Text-to-Speech API.

## 🚀 Live Demo

### Frontend
https://voice-keyword-extractor.vercel.app

### Backend API
https://voice-keyword-extractor.onrender.com

---

## ✨ Features

- 🎙️ Voice recording in the browser
- 🔇 Voice Activity Detection (VAD)
- 📝 Speech-to-Text transcription using Groq Whisper
- 🏷️ AI-powered keyword extraction using Llama 3.3
- 🔊 Read extracted keywords aloud
- ⏳ Loading states and disabled buttons
- 📱 Responsive UI
- 🎨 Modern clean interface

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS3

### Backend

- Node.js
- Express.js
- Multer
- Groq SDK

### AI Models

- Whisper Large v3 Turbo
- Llama 3.3 70B Versatile

---

## 📂 Project Structure

```
voice-keyword-extractor
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── services
│   │   └── styles
│   └── package.json
│
├── backend
│   ├── routes
│   ├── services
│   ├── uploads
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Vilas317/voice-keyword-extractor.git
```

```bash
cd voice-keyword-extractor
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

---

## 📷 How it Works

1. Click **Start Listening**
2. Speak into your microphone
3. Voice Activity Detection automatically stops recording
4. Audio is sent to the backend
5. Whisper converts speech into text
6. Llama extracts important keywords
7. Keywords are displayed
8. Click **Speak Keywords** to hear them

---

## 📌 API Endpoint

### POST

```
/api/transcribe
```

### Request

```
multipart/form-data

audio: <audio file>
```

### Response

```json
{
  "transcript": "Hello everyone welcome to React",
  "keywords": [
    "Hello",
    "React"
  ]
}
```

---

## 🎯 Future Improvements

- Copy transcript button
- Download transcript as TXT/PDF
- Multi-language transcription
- Keyword confidence scores
- Dark/Light theme toggle
- Transcription history
- Authentication
- Database support

---

## 👨‍💻 Author

**Vilas**

GitHub:
https://github.com/Vilas317

LinkedIn:
(Add your LinkedIn profile here)

---

## 📄 License

This project is created as part of a React Full Stack Assignment.
