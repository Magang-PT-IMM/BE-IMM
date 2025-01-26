const multer = require("multer");
const path = require("path");

// Konfigurasi multer
const upload = multer({
  dest: path.join(__dirname, "../uploads"), // Folder sementara untuk upload
  limits: { fileSize: 1 * 1024 * 1024 }, // Maksimum ukuran file 1MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(new Error("Only Excel files are allowed!"));
    }
    cb(null, true);
  },
});

module.exports = upload;
