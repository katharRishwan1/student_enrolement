const commonService = require('../services/common_services');
const { Joi } = require('../services/imports');

const create = Joi.object({
    name: Joi.string().required().error(commonService.getValidationMessage),
    description: Joi.string().optional().error(commonService.getValidationMessage),
    fullName: Joi.string().optional().error(commonService.getValidationMessage)
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
    validateCourse: async (dataToValidate) => validateFunc(create, dataToValidate),
};
