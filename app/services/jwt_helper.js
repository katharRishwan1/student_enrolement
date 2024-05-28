const { jwt } = require('./imports');
const { accessTokenExpiresIn } = require('../config/config');

const signAccessToken = (payload) => {
    const privateKey = 'SECRET_KEY';
    return jwt.sign(payload, privateKey, { algorithm: 'HS256', expiresIn: '1h' });
};

const verifyAccessToken = (token) => {
    const privateKey = 'SECRET_KEY';
    return jwt.verify(token, privateKey);
};
module.exports = {
    signAccessToken,
    verifyAccessToken,
};
