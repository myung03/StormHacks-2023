import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/uploads', upload.single('file'), (req, res) => {
  // Handle the uploaded file here
  const file = req.file;
  if (file) {
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(400).json({ message: 'File upload failed' });
  }
});

// Serve the client-side React application
app.use(express.static(join(__dirname, 'client', 'build')));
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
