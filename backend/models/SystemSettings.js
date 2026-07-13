const mongoose = require('mongoose')

const systemSettingsSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            trim: true,
            maxlength: 120,
            default: 'NexGen CRM',
        },
        timezone: {
            type: String,
            trim: true,
            maxlength: 64,
            default: 'Asia/Kuala_Lumpur',
        },
        currency: {
            type: String,
            trim: true,
            maxlength: 8,
            default: 'MYR',
        },
        language: {
            type: String,
            trim: true,
            maxlength: 40,
            default: 'English',
        },
    },
    {timestamps: true}
)

systemSettingsSchema.statics.getSingleton = function () {
    return this.findOneAndUpdate(
        {},
        {},
        {new: true, upsert: true, setDefaultsOnInsert: true}
    )
}

module.exports = mongoose.model('SystemSettings', systemSettingsSchema)
