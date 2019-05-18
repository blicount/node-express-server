const mongoose = require('mongoose');


const marketingSchema = new mongoose.Schema({

    word:{
        type : String,
        required: true
    },
    score:{
        type : Number,
        required: true
    }

});

const marketing = mongoose.model( 'marketing' , marketingSchema );

module.exports = marketing;