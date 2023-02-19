const connect = require('../../../config/dbConfig');
const Polls = require('../../../models/poll');

let pollRoute = (req, res) => {
    let pollId = req.params.id;
    if(req.session.loggedIn){//user !logged in
        try{
            connect.then(db => {
                Polls.findOne({_id: pollId, dateDeleted: { $exists: false }}, {}, function(err, poll){
                    if(err){

                        return res.status(401).json({ success: false, msg: "Poll not found." });

                    } else {
                        
                        res.status(200).json({ success: true, poll: poll});
                    }
                });
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            console.log(`${inException}`);
        }
         
    } else {//User logged in
        //Route to dash
        //TODO: import and use dash routing operation
    }
}

module.exports = pollRoute;