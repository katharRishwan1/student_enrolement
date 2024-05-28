const db = require('../models');
const responseMessages = require('../middlewares/response-messages');
const { bcrypt } = require('../services/imports');
const validator = require('../validators/auth');

const jwtHelper = require('../services/jwt_helper')
module.exports = {
    signup: async (req, res) => {
        try {
            const filterArray = [{ mobile: req.body.mobile }];
            if (req.body.email) filterArray.push({ email: req.body.email });
            const checkExists = await db.user.findOne({ $or: filterArray });
            if (checkExists) {
                return res.clientError({ msg: responseMessages[1009] });
            };
            req.body.password = await bcrypt.hashSync(req.body.password, 8);
            const data = await db.user.create(req.body);
            if (data && data._id) {
                return res.success({
                    result: data,
                    msg: responseMessages[1014],
                });
            }
            return res.clientError({
                msg: responseMessages[1015],
            });
        } catch (error) {
            console.log('\n user save error...', error);
            if (error.status) {
                if (error.status < 500) {
                    return res.clientError({
                        ...error.error,
                        statusCode: error.status,
                    });
                }
                return res.internalServerError({ ...error.error });
            }
            return res.internalServerError({ error });
        }
    },
    signin: async (req, res) => {
        try {
            const { value, password } = req.body;
            const { error, validateData } = await validator.validateSignin(req.body);
            if (error) {
                return res.clientError({
                    msg: error
                })
            }
            const checkExists = await db.user.findOne({ $or: [{ email: value, }, { mobile: value }] });
            if (!checkExists) return res.clientError({ msg: responseMessages[1009] });
            const passwordIsValid = bcrypt.compareSync(password, checkExists.password);
            if (!passwordIsValid) {
                return res.clientError({ msg: responseMessages[1009] });
            }
            const payload = {
                user_id: checkExists._id.toString(),
            };
            const token = await jwtHelper.signAccessToken(payload)
            console.log('token-------', token);
            const resultObj = {
                token, user: {
                    _id: checkExists._id,
                    name: checkExists.name,
                    email: checkExists.email,
                    mobile: checkExists.mobile,
                }
            };
            console.log('signin successfully', resultObj);
            return res.success({ msg: 'Logged in Successfully!!!', result: resultObj });
        } catch (error) {
            console.log('error--', error);
            if (error.status) {
                if (error.status < 500) {
                    return res.clientError({
                        ...error.error,
                        statusCode: error.status,
                    });
                }
                return res.internalServerError({ ...error.error });
            }
            return res.internalServerError({ error });
        }
    }
};
