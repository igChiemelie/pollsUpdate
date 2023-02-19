const connect = require('../../../config/dbConfig');
const Poll = require('../../../models/poll');
const formidable = require('formidable');

let singleUser = (req, res) => {
    
    let singleUserArr = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userIdPass'){
            singleUserArr.userIdPass = value; 
        }
    })
    .on('aborted', () => {
        console.error('Request aborted by the user');
    })
    .on('error', (err) => {
        console.error('Error', err);
        throw err;
    })
    .on('end', () => {
        connect.then(db => {
            Poll.find({ $or: [{ "optionAVoters": { $in : [singleUserArr.userIdPass] } }, { "optionBVoters": { $in: [singleUserArr.userIdPass] }}]}, function(err, result){
                try{
                    if(err){
                        
                        return res.status(501).json({ success: false, msg: 'Poll Operation failed'});

                    } else {
                        let singleUser = {
                            single: result
                        }
                        return res.status(200).json({ success: true, singleUser: singleUser });
                    }
                }catch(inException){
                    console.log(`${inException}`);
                }
            });
        });
    });
}

module.exports = singleUser;