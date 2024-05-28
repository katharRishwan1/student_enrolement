const responseMessages = require('./response-messages');
const { verifyAccessToken } = require('../services/jwt_helper');

module.exports = {
    checkSetToken: () => async (req, res, next) => {
        const ignorePaths = ['auth', 'signup', 'signin'];
        const getRouteStart = req.url.split('/');
        if (ignorePaths.includes(getRouteStart[1])) {
            return next();
        }
        let token = req.headers.Authorization || req.headers.authorization;
        if (token) {
            try {
                token = token.substr('Bearer '.length);
                const decoded = await verifyAccessToken(token);
                if (decoded) {
                    req.decoded = decoded;
                    return next()
                }
                return res.unauthorized({ msg: responseMessages[1001] });
            } catch (error) {
                console.log('error--', error);
                return res.unauthorized({ msg: responseMessages[1003] });
            }
        } else {
            return res.unauthorized({ msg: responseMessages[1004] });
        }
    }
};
