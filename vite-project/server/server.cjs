const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
app.use(cors());

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
  try {
    // Check if there is a current Python process and terminate it
    if (currentPythonProcess) {
      currentPythonProcess.kill();
    }

    // Remove all files in the "uploads" folder except the one that was just uploaded
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
      if (err) {
        console.log('Error reading uploads folder:', err);
        return res.status(500).send({ status: 'ERROR', message: 'Error deleting files in uploads folder' });
      }

      // Delete each file in the "uploads" folder except the one that was just uploaded
      for (const file of files) {
        if (file !== req.file.filename) { // Skip deleting the current file
          fs.unlink(path.join(__dirname, 'uploads', file), (err) => {
            if (err) {
              console.log('Error deleting file:', err);
            }
          });
        }
      }

      // Call the Python script with the path of the uploaded file as an argument
      currentPythonProcess = spawn('python', [path.join(__dirname, 'lessoncontentgeneration', 'pdflesson.py'), req.file.path]);
      let result = '';

      // Collect data from the script
      currentPythonProcess.stdout.on('data', function (data) {
        result += data.toString();
      });

      // In close event, we are sure that the stream from the child process is closed
      currentPythonProcess.on('close', (code) => {
        if (code !== 0) {
          return res.status(500).send({ status: 'ERROR', message: 'Python script error' });
        }

        return res.send({ status: 'OK', message: 'File uploaded and processed', data: result });
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(5174, () => console.log('Server listening on port 5174'));