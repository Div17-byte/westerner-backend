const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');  // Import cors
const fs = require('fs');

const app = express();
const PORT = 3000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:4200',  // Allow requests only from this origin
    methods: ['GET', 'POST'],  // Allow specific methods
    allowedHeaders: ['Content-Type'],  // Allow specific headers
  };

// Enable CORS with the configured options
app.use(cors(corsOptions));

// Configure storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Uploads folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });

  const upload = multer({ storage });


  // Serve static files (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    console.log('RECEIVED file:', req.file)
  
    res.json({
      message: 'File uploaded successfully!',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    });
  });

  // GET route to retrieve all files
app.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    
    // Read all files in the 'uploads' folder
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to scan directory' });
      }
      // Return list of files
      res.json(files.map(file => ({
        filename: file,
        path: `/uploads/${file}`
      })));
    });
  });


  // Health check
app.get('/', (req, res) => {
    res.send('File upload server is running!');
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
