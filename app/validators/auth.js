const commonService = require('../services/common_services');
const { Joi } = require('../services/imports');

const signup = Joi.object({
    name: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
    email: Joi.string().required().error(commonService.getValidationMessage),
    mobile: Joi.string().optional().error(commonService.getValidationMessage),
    password: Joi.string().optional().error(commonService.getValidationMessage),
}).error(commonService.getValidationMessage);

const signin = Joi.object({
    value: Joi.string().required().error(commonService.getValidationMessage),
    password: Joi.string().required().error(commonService.getValidationMessage),
}).error(commonService.getValidationMessage);

async function validateFunc(schemaName, dataToValidate) {
    try {
        const { error, value } = schemaName.validate(dataToValidate);
        return {
            error: error ? commonService.convertJoiErrors(error.details) : '',
            validatedData: value,
        };
    } catch (error) {
        return {
            error,
        };
    }
}

module.exports = {
    validateSignup: async (dataToValidate) => validateFunc(signup, dataToValidate),
    validateSignin: async (dataToValidate) => validateFunc(signin, dataToValidate),
};
