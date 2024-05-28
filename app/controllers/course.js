const responseMessages = require('../middlewares/response-messages');
const db = require('../models');
const validator = require('../validators/course');
module.exports = {
    create: async (req, res) => {
        try {
            const { error, validateData } = await validator.validateCourse(req.body);
            if (error) {
                return res.clientError({
                    msg: error
                })
            }
            const checkExists = await db.course.findOne({ name: req.body.name });
            if (checkExists) {
                return res.clientError({
                    msg: `Similar Course already exists with name ${req.body.name}`,
                });
            }
            req.body.createdBy = req.decoded.user_id;
            const data = await db.course.create(req.body);
            if (data && data._id) {
                return res.success({
                    msg: `${req.body.name} course created successfully!!!`,
                });
            }
            return res.clientError({
                msg: `${req.body.name} course creation failed`,
            });
        } catch (error) {
            console.log('error.status', error);
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
    get: async (req, res) => {
        try {
            const _id = req.params.id;
            const filter = { isDeleted: false };
            const { search } = req.query;
            if (search) {
                const searchRegex = new RegExp(search, 'i')
                const searchCriteria = [
                    { name: { $regex: searchRegex } },
                    { fullName: { $regex: searchRegex } },
                ]
                filter.$or = searchCriteria
            }
            const populateValues = [{ path: 'createdBy', select: 'name email mobile' }]
            if (_id) {
                filter._id = _id;
                const data = await db.course.findOne(filter).populate(populateValues);
                if (data) {
                    return res.success({
                        msg: 'request access',
                        result: data
                    })
                }
                return res.clientError({
                    msg: responseMessages[1012]
                })
            }
            const data = await db.course.find(filter).populate(populateValues);
            if (!data.length) {
                return res.success({
                    msg: responseMessages[1012],
                    result: data,
                });
            }
            return res.success({
                msg: 'courses list',
                result: data,
            });

        } catch (error) {
            console.log('error.status', error);
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
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const { error, validateData } = await validator.validateCourse(req.body);
            if (error) {
                return res.clientError({
                    msg: error
                })
            }
            const _id = req.params.id;
            if (!_id) {
                return res.clientError({
                    msg: responseMessages[1015],
                });
            }
            const checkExists = await db.course.findOne({ _id, isDeleted: false });
            if (!checkExists) {
                return res.clientError({
                    msg: responseMessages[1012],
                });
            }
            const updData = {};
            if (req.body.name) updData.name = req.body.name;
            if (req.body.fullName) updData.fullName = req.body.fullName;
            const checkUnique = await db.course.findOne({ _id: { $ne: _id }, name, isDeleted: false });
            if (checkUnique) {
                return res.clientError({
                    msg: `${name} this type of course is Already taken`,
                });
            };
            const data = await db.course.updateOne({ _id }, updData);
            if (data.modifiedCount) {
                return res.success({
                    result: data,
                    msg: 'courses Updated Successfully',
                });
            }
            return res.clientError({
                msg: 'Failed to update course, pls try again',
            });
        } catch (error) {
            console.log('error.status', error);
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
    delete: async (req, res) => {
        try {
            const _id = req.params.id;
            if (!_id) {
                return res.clientError({
                    msg: responseMessages[1015],
                });
            }
            const checkExists = await db.course.findOne({ _id, isDeleted: false });
            if (!checkExists) {
                return res.clientError({
                    msg: responseMessages[1012],
                });
            }
            const data = await db.course.updateOne({ _id }, { isDeleted: true });
            if (data.modifiedCount) {
                return res.success({
                    msg: 'course deleted successfully',
                    result: data,
                });
            }
            return res.clientError({
                msg: 'course deletion failed',
            });
        } catch (error) {
            console.log('error.status', error);
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
};
