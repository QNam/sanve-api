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
        address: {
            type: String,
        }
    }
    
});


webSchema.statics.findByDomain = async (domain) => {
    // Search for a web by domain
    const web = await Web.findOne({ domain: domain })

    if (!web) {
        throw { name: 'DomainNotExists',
                message: "Domain not exists !" }
    }
  
    return web;
}


const Web = mongoose.model('Web', webSchema)

module.exports = Web

