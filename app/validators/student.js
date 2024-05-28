const commonService = require('../services/common_services');
const { Joi } = require('../services/imports');

const create = Joi.object({
    firstName: Joi.string().required().error(commonService.getValidationMessage),
    lastName: Joi.string().required().error(commonService.getValidationMessage),
    mobile: Joi.string().required().error(commonService.getValidationMessage),
    email: Joi.string().required().error(commonService.getValidationMessage),
    course: Joi.string().required().error(commonService.getValidationMessage),
    motherName: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
    fatherName: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
    dateOfBirth: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
    adress: Joi.object({
        addressLine1: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
        addressLine2: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
        country: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
        state: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
        city: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
        pincode: Joi.string().optional().allow('', null).error(commonService.getValidationMessage),
    }),
    gender: Joi.string().required().error(commonService.getValidationMessage),
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
    validateStudent: async (dataToValidate) => validateFunc(create, dataToValidate),
};
