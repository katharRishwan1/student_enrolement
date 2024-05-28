const { mongoose } = require('../services/imports');

module.exports = mongoose.model(
    'user',
    new mongoose.Schema(
        {
            name: { type: String, trim: true },
            email: { type: String, trim: true, lowercase: true },
            mobile: { type: String, trim: true, unique: true },
            password: String,
            provider: {
                type: String,
                enum: ['rizwan'],
                default: 'rizwan',
            },
            mobileVerified: {
                type: Boolean,
                default: false,
            },
            emailVerified: {
                type: Boolean,
                default: false,
            },
            status: { type: String, enum: ['active', 'inactive'], default: 'active' },
            isDeleted: { type: Boolean, default: false },
        },
        { timestamps: true, versionKey: false }
    ),
    'users'
);
