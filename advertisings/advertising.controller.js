const express = require('express')
const router = express.Router()
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role')
const uploadImage = require("./uploadAdvertising")
const fs = require('fs')
const uploadDir = '/public/advertising/'

// routes
router.post('/', authorize(Role.Admin), uploadImage, createAdvertising);

module.exports = router;

async function createAdvertising(req, res, next) {

    if (!req.file) return res.status(412).send({
        message: `image is required`,
    });
    uploadImage(req, res)
        .then(data => {
            console.log(global.__basedir + uploadDir)
            fs.rename(req.imagePath, global.__basedir + uploadDir + 'advertising.jpeg', function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
            return res.status(201).send({
                message: 'Advertising image saved'
            })
        }).catch(err => {
        return res.status(500).send({
            message: `Could not upload the file, ${err}`,
        });
    })
}






