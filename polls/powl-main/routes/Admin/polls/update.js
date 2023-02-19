const formidable = require('formidable');
const connect = require('../../../config/dbConfig');
const Polls = require('../../../models/poll');

let pollRoute = (req, res) => {
    if(!req.session.loggedIn){//user !logged in
       
        let pollUpdate = new Object();

        new formidable.IncomingForm().parse(req)
        .on('field', (field, value) => {
            if(field == 'userAns'){
                pollUpdate.option = value;
            }
            if(field == 'userId'){
                pollUpdate.userId = value;
            }
            if(field == 'pollId'){
                pollUpdate.pollId = value;
            }
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        }) 
        .on('end', () => {
            
            try{
                connect.then(db => {     
                    Polls.findById({ _id: pollUpdate.pollId }, {}, function(err, poll) {
                        if(err){
            
                            return res.status(501).json({success: false, msg: 'Poll failed to Update'})
            
                        } else {
                            let checkUserPrevAnsInA = poll.optionAVoters.includes(pollUpdate.userId);
                            let checkUserPrevAnsInB = poll.optionBVoters.includes(pollUpdate.userId);

                            if(pollUpdate.option === 'A' && checkUserPrevAnsInB){
                                //remove userId from optionBVoters
                                poll.optionBVoters.pull(pollUpdate.userId);

                                //push userId in optionAVoters
                                poll.optionAVoters.addToSet(pollUpdate.userId);

                            } else if(pollUpdate.option === 'B' && checkUserPrevAnsInA){
                                //remove userId from optionAVoters
                                poll.optionAVoters.pull(pollUpdate.userId);

                                //push userId in optionBVoters
                                poll.optionBVoters.addToSet(pollUpdate.userId);

                            } else if(pollUpdate.option === 'A') {
                                //push userId in optionAVoters
                                poll.optionAVoters.addToSet(pollUpdate.userId);

                            } else if(pollUpdate.option === 'B') {
                                //push userId in optionAVoters
                                poll.optionBVoters.addToSet(pollUpdate.userId);
                            }
                            
                            //Save to db
                            poll.save(function(error, pollRes){
                                if(error){
                                    return res.status(501).json({ success: false, msg: 'Poll failed to Update'});
                                    
                                } else if(pollRes){
                                    
                                    io.emit('votes', pollRes);
                                    return res.status(200).json({ success: true, msg: 'Poll Updated Successfully', poll: pollRes});  
                                }
                            });
                        }
                    });
                });
                
            } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
                console.log(`${inException}`);
            }
        }); 
        
    } else {//User logged in
        //Route to dash
        //TODO: import and use dash routing operation
        console.log('here mgbu');
    }
}

module.exports = pollRoute;