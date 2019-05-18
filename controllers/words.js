const express   = require('express');
const router    = express.Router();
const axios     = require('axios');
const affilateschema     = require('../models/affiliateSchema'); 
const marketingschema     = require('../models/marketingSchema');
const influencerschema     = require('../models/influencerSchema');

let log = [];
let errors = [];

function checkIfWordExist(collection , checkedword){
    return new Promise((resolve , reject) => {
        collection.find({word : checkedword})
            .then((word) => {
                if(word.length > 0){
                    resolve(true);
                }else{
                    resolve(false);
                }
            })
            .catch(err=> reject(err))
    });
}


function updateExistWord(collection , checkedword , newscore){
    return new Promise((resolve, reject) => {
        collection.updateOne({word:checkedword} ,{$set: { score : newscore } })
            .then(obj =>{
                if(obj.n){ 
                    if(obj.nModified){
                        console.log(`the word ${checkedword} score update`)
                        log.push(`the word ${checkedword} score update`);
                    }else{
                        console.log(`the word ${checkedword} didnt modified`)
                        log.push(`the word ${checkedword} didnt modified`);
                    }       
                }else{
                    console.log(`word wasn't found`);
                    log.push(`word wasn't found`)
                }
            resolve(log);    
        })
            .catch(err => reject(err));
    });    
}



router.get('/logs' , (req,res) =>{
    res.status(202).json(log);
})

router.get('/errors' , (req,res) =>{
    res.status(202).json(log);
})

router.get('/tweets-report' , async (req,res)=>{
    let answare = [];
    await affilateschema.find()
        .then(response => {
            let totalscore = 0;
            for(word_index in response){
                totalscore += response[word_index].score;
            }
            let wordtag = { "word" : "affilate" ,
                            "appearances" : response.length , 
                            "total score":totalscore
                        };
            answare.push(wordtag);
            
        })
        .catch(err=> {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        })
    await marketingschema.find()
        .then(response => {
            let totalscore = 0;
            for(word_index in response){
                totalscore += response[word_index].score;
            }
            let wordtag = { "word" : "marketing" ,
                            "appearances" : response.length , 
                            "total score":totalscore
                        };
            answare.push(wordtag);
        })
        .catch(err=> {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        })
    await influencerschema.find()
        .then(response => {
            let totalscore = 0;
            for(word_index in response){
                totalscore += response[word_index].score;
            }
            let wordtag = { "word" : "influencer" ,
                            "appearances" : response.length , 
                            "total score":totalscore
                        };
            answare.push(wordtag);
        })    
        .catch(err=> {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        })  
    JSON.stringify(answare);
    res.status(202).send(answare);  
});

router.post('/fetch-tweets' , (req,res)=> {
    //the affilate request     
    axios.get('http://api.datamuse.com/words?sp=affiliate')
        .then( async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentcollection = affilateschema;
                let wordexist = await  checkIfWordExist(currentcollection,currentword)
                if(wordexist){
                    await updateExistWord(currentcollection,currentword,response.data[word_index].score);
                }else{
                    let newword = new affilateschema(response.data[word_index])
                    newword.save()
                        .then(word => {
                            log.push(`the word ${currentword} add ${word}`);
                        })
                        .catch(err => {
                            console.log(err);
                            errors.push(err);
                            log.push(' error in insertin word to db check errors route for more details');
                        });
               }    
            }
        })

        .catch(error => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });
    //the marketing request
    axios.get('http://api.datamuse.com/words?sp=marketing')
        .then(async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentcollection = marketingschema;
                let wordexist = await  checkIfWordExist(currentcollection,currentword)
                if(wordexist){
                    await updateExistWord(currentcollection,currentword,response.data[word_index].score);
                }else{
                    let newword = new marketingschema(response.data[word_index])
                    newword.save()
                        .then(word => {
                            log.push(`the word ${currentword} add ${word}`);
                        })
                        .catch(err => {
                            console.log(err);
                            errors.push(err);
                            log.push(' error in insertin word to db check errors route for more details');
                        });
               }    
            }
        })
        .catch(err => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });
    axios.get('http://api.datamuse.com/words?sp=influencer')
        .then(async response => {
            for(word_index in response.data){
                let currentword = response.data[word_index].word;
                let currentcollection = influencerschema;
                let wordexist = await  checkIfWordExist(currentcollection,currentword)
                if(wordexist){
                    await updateExistWord(currentcollection,currentword,response.data[word_index].score);
                }else{
                    let newword = new influencerschema(response.data[word_index])
                    newword.save()
                        .then(word => {
                            log.push(`the word ${currentword} add ${word}`);
                        })
                        .catch(err => {
                            console.log(err);
                            errors.push(err);
                            log.push(' error in insertin word to db check errors route for more details');
                        });
               }    
            }
            
        })
        .catch(err => {
            console.log(err);
            errors.push(err);
            log.push(' error in insertin word to db check errors route for more details');
        });
    res.status(200).send('in a few seconds you could see tweets-report/logs/errors routs for more details');
});

module.exports = router ;
