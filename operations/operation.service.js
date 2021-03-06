const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    //delete: _delete
};

/*

async function authenticate({email, password, ipAddress}) {
    const account = await db.Account.findOne({email});

    if (!account)
        throw  'the identifier you tried to logging with is not associated to any account'


    if (!account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
        throw 'Validate your account first';
    }

    if (!bcrypt.compareSync(password, account.passwordHash)) {
        throw 'password not correct';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({token, ipAddress}) {
    const refreshToken = await getRefreshToken(token);
    const {account} = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}*/
