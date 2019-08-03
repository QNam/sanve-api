const mongoose = require('mongoose');

const webSchema = new mongoose.Schema({
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
    created_at: {
        type: Date,
        default: null,
    },
    updated_at: {
        type: Date,
        default: null,
    },
    web_user_id: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1,
    }
});


webSchema.statics.findByDomain = async (domain) => {
    // Search for a user by email and password.
    const web = await Web.findOne({ domain: domain })

    if (!web) {
        throw { name: 'DomainNotExists',
                message: "Domain not exists !" }
    }
  
    return web;
}


const Web = mongoose.model('Web', webSchema)

module.exports = Web