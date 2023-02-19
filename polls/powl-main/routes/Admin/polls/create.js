const formidable = require('formidable');
const connect = require('../../../config/dbConfig');
const Polls = require('../../../models/poll');

let create = (req, res) => {
    
    // if(!req.session.loggedIn){//user !logged in
        addPoll = new Object();

        new formidable.IncomingForm().parse(req)
        .on('field', (field, value) => {
            if(field == 'topic'){
                addPoll.topic = value;
            }
            if(field == 'title'){
                addPoll.title = value;
            }
            if(field == 'optionA'){
                addPoll.optionA = value;
            }
            if(field == 'optionB'){
                addPoll.optionB = value;
            }
        })
        .on('aborted', () => {
            console.error('request aborted by user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        }) 
        .on('end', () => {
            try{
                connect.then(db => {
                    let newPoll = new Polls({
                        topic: addPoll.topic,   
                        title: addPoll.title,
                        optionA: addPoll.optionA,
                        optionB: addPoll.optionB
                    });
            
                    newPoll.save(function(err, poll){
                        if(err){
                            return res.status(401).json({ success: false, msg: "Poll not added." });

                        } else {
                            
                            return res.status(200).json({ success: true, poll: poll});
                        }
                    }); 
                });
            } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
                console.log(`${inException}`);
            }
        })
         
    // } else {//User logged in
    //     //Route to dash
    //     //TODO: import and use dash routing operation
    // }
}

module.exports = create;