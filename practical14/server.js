const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

// Multer setup
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Upload route
app.post("/upload", upload.single("resume"), (req, res) => {
  res.send("File uploaded successfully!");
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("File is too large. Max 2MB allowed.");
    }
  } else if (err) {
    return res.status(400).send(err.message);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
