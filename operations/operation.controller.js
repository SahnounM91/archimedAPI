const express = require('express');
const fs = require('fs');
const unzipper = require('unzipper');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const accountService = require('../accounts/account.service');
const uploadFile = require("operations/upload");
const db = require('_helpers/db');

// routes
router.post('/upload',authorize(Role.User), upload);
/*
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
*/
module.exports = router;

async function upload(req, res) {
    uploadFile(req, res).then(data => {
            fs.createReadStream(req.zipFilePath)
                .pipe(unzipper.Extract({path: __basedir + "/resources/static/assets/unzipped"}))
                .on('close', function (entry) {
                    fs.readdir(__basedir + "/resources/static/assets/unzipped", (err, files) => {

                        fs.unlink(req.zipFilePath, function (e) {
                            if (e) throw e;
                        });
                        return res.status(200).send({
                            message: "Uploaded the file successfully: " + req.file.originalname,
                        });
                    });
                });
        }
    ).catch(err => {
        return res.status(500).send({
            message: `Could not upload the file, ${err.message}`,
        });
    })
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
