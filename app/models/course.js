const { mongoose } = require('../services/imports');

module.exports = mongoose.model(
    'course',
    new mongoose.Schema(
        {
            name: { type: String, uppercase: true },
            fullName: { type: String },
            description: String,
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            isDeleted: { type: Boolean, default: false }
        },
        { timestamps: true, versionKey: false }
    ),
    'course'
);
