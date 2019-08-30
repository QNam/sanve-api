const mongoose = require('mongoose');

const webSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
        unique : true
    },
    theme: {
        type: String,
        default: '1',
    },
    status: {
        type: Number,
        default: 0,
    },
    created: {
        user: {
            type: String,
            required: true,
        },
        time: {
            type: Number
        },
    },
    updated: {
        user: {
            type: String,
        },
        time: {
            type: Number
        },
    },
    info: {
        email: {
            type: String,
        },
        phone: [{
            title: String,
            content: String
        }],
        address: {
            province: String,
            district: String,
            address: String,
            map: String
        }
    }
});

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
    },
    web: webSchema
});



const User = mongoose.model('user', userSchema)
User.statuses = {
    ACTIVE: 1,
    INACTIVE: -1
};

module.exports = User