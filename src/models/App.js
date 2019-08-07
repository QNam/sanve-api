const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    a_name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    a_email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    a_password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    a_refresh_token: {
        type: String
    },
    a_created_at: {
        type: Date,
        default: null,
    },
    a_updated_at: {
        type: Date,
        default: null,
    },
});

var data = mongoose.model('app', userSchema);


module.exports = mongoose.model('App', userSchema);
