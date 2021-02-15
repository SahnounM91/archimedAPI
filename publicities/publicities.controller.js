const fs = require('fs')

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const publicityService = require('./publicity.service');
const multer = require("multer");

const uploadDir = '/privateResources/pubs'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.exists(global.__basedir + uploadDir, exists => {
            if (!exists) {
                fs.mkdir(global.__basedir + uploadDir, error => cb(error, uploadDir))
            }
            cb(null, global.__basedir + uploadDir)
        })
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {
        //reject
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true)
        } else {
            cb(new Error("image should be png or jpeg extension"), false)
        }
    }
}).single("image");


// routes
router.get('/', authorize(Role.Admin), getAllPublicity);
router.get('/:id', authorize(), getPublicityById);
router.get('/active', authorize(), getActivePublicities)
router.post('/', authorize(Role.Admin), upload, createPublicity);
router.put('/:id', authorize(Role.Admin), updatePublicitySchema, updatePublicity);
router.delete('/:id', authorize(Role.Admin), _deletePublicity);

module.exports = router;


function getAllPublicity(req, res, next) {
    publicityService.getAllPublicities()
        .then(publicities => res.json(publicities))
        .catch(next);
}


function getActivePublicities(req, res, next) {
    publicityService.getActivePublicities()
        .then(activePublicities => res.json(activePublicities))
        .catch(next)
}


function getPublicityById(req, res, next) {
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    publicityService.getPublicityById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        description: Joi.string().required(),
        image: Joi.string()
    });
    validateRequest(req, next, schema);
}


function createPublicity(req, res, next) {
    let params = {
        description: req.body.description,
        image: req.file.path
    }
    publicityService.createPublicity(params)
        .then(publicity => {
            res.json(publicity)
        })
        .catch(next);
}

function updatePublicitySchema(req, res, next) {
    const schemaRules = {
        description: Joi.string().empty(''),
        image: Joi.string().empty(''),
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function updatePublicity(req, res, next) {
    // users can update their own account and admins can update any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    publicityService.updatePublicity(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}


function _deletePublicity(req, res, next) {
    publicityService.deletePublicity(req.params.id)
        .then(() => res.json({message: 'Publicity deleted successfully'}))
        .catch(next);
}




