const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const uploadDir = '/public/advertising/'
const fs = require('fs')
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, global.__basedir + uploadDir)
        req.uploadDirectory = global.__basedir + uploadDir
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
});

let uploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        req.imagePath = global.__basedir + uploadDir + file.originalname
        let files = fs.readdirSync(global.__basedir + uploadDir);
        console.log(files)
        for (const file of files) {
            fs.unlink(global.__basedir + uploadDir + file, err => {
                if (err) throw err;
            });
        }
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error("image should be png or jpeg extension"), false)
        }
    },
    limits: {fileSize: maxSize},
}).single("imageAdvertising");

let uploadFileMiddleware = util.promisify(uploadImage);
module.exports = uploadFileMiddleware;

