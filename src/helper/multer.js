const multer = require("multer");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniquSuffix = `${Date.now()}--${file.originalname}`;
        cb(null, file.filename + "_" + uniquSuffix);
    },
});

const upload = multer({ storage: storage });

module.exports = upload;