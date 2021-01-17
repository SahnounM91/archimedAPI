const util = require("util");
const multer = require("multer");
const maxSize = 10*1024*1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/zip");
    },
    filename: (req, file, cb) => {
        console.log(__basedir + "/resources/static/assets/uploads/zip/" + file.originalname );
        req.zipFilePath = __basedir + "/resources/static/assets/uploads/zip/" + file.originalname
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize},
}).single("zipFile");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;

