const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    type: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: -1
    },
    permission: {
        type: [String],
    },
    refresh_token: {
        type: String
    },
    confirm_token: {
        otp: String,

        tried: {
            type: Number,
            default: 0
        },

        last_send: Date
    }
});


const User = mongoose.model('user', userSchema)
User.statuses = {
    ACTIVE: 1,
    INACTIVE: -1
};

module.exports = User