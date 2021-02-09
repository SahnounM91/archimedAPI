const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const publicityService = require('./publicity.service.service');

// routes

router.get('/publicities', authorize(Role.Admin), getAllPublicity);
router.get('/publicity/:id', authorize(Role.Admin), getPublicityById);
router.post('/publicity', authorize(Role.Admin), createSchema, createPublicity);
router.put('/publicity/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/publicity/:id', authorize(Role.Admin), _delete);

module.exports = router;


function getAllPublicity(req, res, next) {
    publicityService.getAllPublicity()
        .then(publicities => res.json(publicities))
        .catch(next);
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
        image: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function createPublicity(req, res, next) {
    publicityService.createPublicity(req.body)
        .then(publicity => res.json(publicity))
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
    // users can delete their own account and admins can delete any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    publicityService.deletePublicity(req.params.id)
        .then(() => res.json({message: 'Publicity deleted successfully'}))
        .catch(next);
}
