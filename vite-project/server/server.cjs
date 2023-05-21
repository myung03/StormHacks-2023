const express = require('express');
const cors = require('cors');
const multer  = require('multer');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer to save uploaded files in the "uploads" directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST endpoint for file uploads
app.post('/uploads', upload.single('file'), (req, res) => {
  try {
    res.send({ status: 'OK', message: 'File uploaded' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(5174, () => console.log('Server listening on port 5174'));