const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const customerAccountSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
    },
    {timestamps: true}
)

customerAccountSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

customerAccountSchema.methods.comparePassword = function (candidate) {
    if (!this.password) return false
    return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('CustomerAccount', customerAccountSchema)
