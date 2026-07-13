const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Team name is required'],
            trim: true,
            maxlength: 80,
            unique: true,
        },
        supervisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        sharingEnabled: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('Team', teamSchema)
