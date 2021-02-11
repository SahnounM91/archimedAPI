const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    getAllPublicities,
    getActivePublicities,
    getPublicityById,
    createPublicity,
    updatePublicity,
    deletePublicity
};

async function getAllPublicities() {
    const pubs = await db.Publicity.find();
    return pubs.map(x => basicDetails(x));
}


async function getActivePublicities() {
    let activePubs = db.Publicity.find({isActive: true})
    if (!activePubs) throw 'no active publicities is found';
    return activePubs;
}


async function getPublicityById(id) {
    return await getPublicity(id)
}


async function createPublicity(params) {
    const publicity = new db.Publicity(params);
    await publicity.save();
    return basicDetails(publicity)
}


async function updatePublicity(id, params) {
    const publicity = await getPublicity(id);
    // copy params to account and save
    Object.assign(publicity, params);
    await publicity.save();
    return publicity;
}

async function deletePublicity(id) {
    const publicity = await getPublicity(id);
    await publicity.remove();
}

// helper functions
async function getPublicity(id) {
    if (!db.isValidId(id)) throw 'Publicity not found';
    const publicity = await db.Publicity.findById(id);
    if (!publicity) throw 'Publicity not found';
    return publicity;
}

function basicDetails(publicity) {
    const {description, image, isActive} = publicity;
    return {description, image, isActive};
}


