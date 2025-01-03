const multer = require("multer");

const imagePath = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports.uploadImage = multer({ storage: storage }).single("image");
