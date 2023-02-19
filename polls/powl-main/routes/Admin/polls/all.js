const connect = require('../../../config/dbConfig');
const Polls = require('../../../models/poll');

let all = (req, res, next) => {
    // console.log(req.session);
    
    if(!req.session.loggedIn){//user !logged in
        try{
            connect.then(db => {
                Polls.find({ dateDeleted: { $exists: false } }, {}, function(err, polls){
                    if(err){
                        return res.status(401).json({ success: false, msg: "No poll found." });
                    } else {
                        
                        return res.status(200).json({ success: true, poll: polls });
                    }
                })
                // .sort({ dateCreated: -1 })
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            console.log(`${inException}`);
        }
         
    } else {//User logged in
        //Route to dash
        //TODO: import and use dash routing operation
        // return next();
    }
}

module.exports = all;