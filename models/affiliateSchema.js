const mongoose = require('mongoose');


const affiliateSchema = new mongoose.Schema({

    word:{
        type : String,
        required: true
    },
    score:{
        type : Number,
        required: true
    }

});

const affiliate = mongoose.model( 'affiliate' , affiliateSchema );

module.exports = affiliate;