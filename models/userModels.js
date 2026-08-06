const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    // terms: {
    //     type: Boolean,
    // },
    profile: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin' , 'vendor','Customer'],
        default: 'Customer',
    },
    isHold: {
        type: Boolean,
        default: false,
    },
    billingAddress: {
        fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    companyName: {
        type: String,
    },
    street: {
        type: String,
    },
    state: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    country: {
        type: String,
    }  
    }
})

module.exports = mongoose.model('User', userSchema)