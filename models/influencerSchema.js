const mongoose = require('mongoose');


const influencerSchema = new mongoose.Schema({

    word:{
        type : String,
        required: true
    },
    score:{
        type : Number,
        required: true
    }

});

const influencer = mongoose.model( 'influencer' , influencerSchema );

module.exports = influencer;