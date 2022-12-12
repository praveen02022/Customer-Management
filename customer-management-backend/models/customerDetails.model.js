const mongoose = require("mongoose");
Schema = mongoose.Schema

const customerDetailschema = new mongoose.Schema({


    customerid :{
        type: String,
        required: true,
    },
 
    address: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    zipcode: {
        type: Number,
        required: true
    },
},
    { timestamps: true }
);

const customerDetailmodel = mongoose.model('address', customerDetailschema);

module.exports = customerDetailmodel;