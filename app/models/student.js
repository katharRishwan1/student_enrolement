const { mongoose } = require('../services/imports');

module.exports = mongoose.model(
    'student',
    new mongoose.Schema(
        {
            firstName: String,
            lastName: String,
            email: String,
            mobile: String,
            course: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
            motherName: String,
            fatherName: String,
            dateOfBirth: Date,
            adress: {
                addressLine1: String,
                addressLine2: String,
                country: String,
                state: String,
                city: String,
                pincode: String
            },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHERS'] },
            isDeleted: { type: Boolean, default: false }
        },
        { timestamps: true, versionKey: false }
    ),
    'student'
);
