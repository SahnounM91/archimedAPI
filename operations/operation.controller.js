const express = require('express')
const fs = require('fs')
const unzipper = require('unzipper')
const Joi = require('joi')

const router = express.Router()
const validateRequest = require('_middleware/validate-request')
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role')
const uploadFile = require("./upload")
const db = require('_helpers/db')
const extractDir = '/privateResources/files/unzipped/'
const moment = require('moment-timezone')

// routes
router.post('/upload', authorize(Role.User), upload);
module.exports = router;



async function upload(req, res) {
    uploadFile(req, res)
        .then(data => {
            extract(req, res)
        }).catch(err => {
        return res.status(500).send({
            message: `Could not upload the file, ${err}`,
        });
    })
}

async function extract(req, res) {
    let uploadDate = getFormattedDate()
    let account = await getAccount(req.user.id)
    let userDirectory = global.__basedir + extractDir + account.fullName + account.shortUid + "/";
    fs.createReadStream(req.zipFilePath)
        .pipe(unzipper.Extract({path: userDirectory + uploadDate}))
        .on('close', function (entry) {
            fs.readdir(global.__basedir + extractDir + userDirectory + req.zipName, (err, files) => {
                fs.unlink(req.zipFilePath, function (e) {
                    if (e) throw e;
                });
                return res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            });
        });
}

// helper functions

async function getAccount(id) {
    if (!db.isValidId(id)) throw 'Account not found';
    const account = await db.Account.findById(id);
    if (!account) throw 'Account not found';
    return account;
}

function getFormattedDate() {
    let uploadDate = new Date().toISOString();
    moment.tz(uploadDate, "Africa/Tunis")
    uploadDate = moment(uploadDate).format("YYYY-MM-DD HH:mm:ss")
    uploadDate = uploadDate.replace(/\s/g, 'T')
    return uploadDate
}

/*

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    accountService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
*/
