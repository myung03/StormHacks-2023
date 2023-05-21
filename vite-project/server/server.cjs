const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let currentLanguage = 'English'; // Default language

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse the request body as JSON

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer to save uploaded files in the "uploads" directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
let currentPythonProcess = null;

// POST endpoint for file uploads
app.post('/uploads', upload.single('file'), (req, res) => {
  // Rest of the code...
});

app.post('/language', (req, res) => {
  const { language } = req.body;
  currentLanguage = language;
  res.send({ status: 'OK', message: 'Language updated successfully' });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(5174, () => console.log('Server listening on port 5174'));