const responseMessages = require('../middlewares/response-messages');
const db = require('../models');
const validator = require('../validators/student');
module.exports = {
    create: async (req, res) => {
        try {
            const { email, mobile } = req.body;
            const { error, validateData } = await validator.validateStudent(req.body);
            if (error) {
                return res.clientError({
                    msg: error
                })
            };
            const filterQuery = { isDeleted: false, $or: [{ email, }, { mobile }] };
            const checkExists = await db.student.findOne(filterQuery);
            if (checkExists) {
                return res.clientError({
                    msg: `Similar student mobile or email already exists`,
                });
            };
            req.body.createdBy = req.decoded.user_id;
            const data = await db.student.create(req.body);
            if (data && data._id) {
                return res.success({
                    msg: `student created successfully!!!`,
                    result: data
                });
            }
            return res.clientError({
                msg: `student creation failed`,
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
            const populateValues = [
                { path: 'course', select: 'name' },
                { path: 'createdBy', select: 'name email mobile' }
            ]
            if (_id) {
                filter._id = _id;
                const data = await db.student.findOne(filter).populate(populateValues);
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
            const data = await db.student.find(filter).populate(populateValues);
            if (!data.length) {
                return res.success({
                    msg: responseMessages[1012],
                    result: data,
                });
            }
            return res.success({
                msg: 'students list',
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
            const { mobile, email } = req.body;
            const { error, validateData } = await validator.validateStudent(req.body);
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
            const checkExists = await db.student.findOne({ _id, isDeleted: false });
            if (!checkExists) {
                return res.clientError({
                    msg: responseMessages[1012],
                });
            }
            const checkUnique = await db.student.findOne({ _id: { $ne: _id }, $or: [{ mobile }, { email }], isDeleted: false });
            if (checkUnique) {
                return res.clientError({
                    msg: `This type of student email or mobile Already taken`,
                });
            };
            const data = await db.student.updateOne({ _id }, req.body);
            if (data.modifiedCount) {
                return res.success({
                    result: data,
                    msg: 'students Updated Successfully',
                });
            }
            return res.clientError({
                msg: 'Failed to update student, pls try again',
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
            const checkExists = await db.student.findOne({ _id, isDeleted: false });
            if (!checkExists) {
                return res.clientError({
                    msg: responseMessages[1012],
                });
            }
            const data = await db.student.updateOne({ _id }, { isDeleted: true });
            if (data.modifiedCount) {
                return res.success({
                    msg: 'student deleted successfully',
                    result: data,
                });
            }
            return res.clientError({
                msg: 'student deletion failed',
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
