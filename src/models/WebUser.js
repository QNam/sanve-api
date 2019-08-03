const mongoose = require('mongoose');

const webUserSchema = new mongoose.Schema({
    wid: {
        type: String,
        // required: true
    },
    u_first_name: {
        type: String
    },
    u_last_name: {
        type: String
    },
    u_email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    u_password: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    u_status: {
        type: Number,
        default: 1
    },
    u_confirm: {
        type: Boolean,
        default: false
    },
    u_confirm_token: {
        type: String
    }

});

// webSchema.statics.findByDomain = async (domain) => {
//     // Search for a user by email and password.
//     const web = await Web.findOne({ domain: domain })

//     if (!web) {
//         throw { name: 'DomainNotExists',
//                 message: "Domain not exists !" }
//     }
  
//     return web;
// }


const WebUser = mongoose.model('web_user', webUserSchema)

module.exports = WebUser