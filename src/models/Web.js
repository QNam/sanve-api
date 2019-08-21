const mongoose = require('mongoose');

const webSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
        index: true,
        unique : true,
        
    },
    theme: {
        type: Number,
        default: 1,
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


webSchema.statics.findByDomain = async (domain) => {
    // Search for a web by domain
    return await Web.findOne({ domain: domain })
}


const Web = mongoose.model('Web', webSchema)

module.exports = Web

