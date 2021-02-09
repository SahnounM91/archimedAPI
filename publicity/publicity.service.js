const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    getAllPublicity,
    getPublicityById,
    createPublicity,
    updatePublicity,
    delete: _deletePublicity()
};


async function getAllPublicity() {
    return await db.Publicity.find()
}

async function getPublicityById(id) {
    const publicity = await getPublicity(id);
    return publicity
}

async function createPublicity(params) {
    const publicty = new db.Publicity(params);
    await publicty.save();
    return publicty
}

async function updatePublicity(id, params) {
    const publicity = await getPublicity(id);
    // copy params to account and save
    Object.assign(publicity, params);
    await publicity.save();
    return publicity;
}

async function _deletePublicity(id) {
    const publicity = await getPublicity(id);
    await publicity.remove();
}

// helper functions

async function getPublicity(id) {
    if (!db.isValidId(id)) throw 'Publicity not found';
    const publicity = await db.Publicity.findById(id);
    if (!publicity) throw 'Account not found';
    return publicity;
}




