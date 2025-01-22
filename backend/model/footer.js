const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
    newsletter: {
        type: String,
      
    },
    instagramLink: {
        type: String,
        
    },
    linkedinLink: {
        type: String,
       
    },
    googleLink: {
        type: String,
       
    },
    behanceLink: {
        type: String,
       
    },
    location: {
        type: String,
       
    },
    phoneNo: {
        type: String,
       
    },
    phoneNo_2: {
        type: String,
       
    },
    email: {
        type: String,
       
    },
    email_2: {
        type: String,
       
    },
    location:{
        type: String,
        
    }
});

module.exports = mongoose.model('Footer', footerSchema);
