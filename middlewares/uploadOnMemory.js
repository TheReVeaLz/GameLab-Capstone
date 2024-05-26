const multer = require("multer");
const path = require("path");

// Mendefinisikan gimana cara nyimpen file-nya
const storage = multer.memoryStorage();

exports.uploadToMemory = (req, res, next) => {
    const upload = multer({ storage }).single("image");
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({
                status: "FAIL",
                message: `Failed to upload image: ${err.message}`
            });
            return;
        }
        next();
    });
}

// Membuat upload middleware
// export default multer({ storage });