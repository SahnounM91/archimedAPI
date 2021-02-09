const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const uploadDir = '/resources/files/uploads/'

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, global.__basedir + uploadDir);
    },
    filename: (req, file, cb) => {
        req.zipFilePath = global.__basedir + uploadDir + file.originalname
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional
        const filetypes = /zip/;
        const mimetype = filetypes.test(file.mimetype);

        const extname = filetypes.test((global.__basedir + uploadDir + file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true);
        }
        return cb("Error: File upload only supports zip files", false);
    },
    limits: {fileSize: maxSize},
}).single("zipFile");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;

