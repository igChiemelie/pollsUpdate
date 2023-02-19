const formidable = require('formidable');
const connect = require('../../../config/dbConfig');
const Polls = require('../../../models/poll');

let deletePoll = (req, res) => {

    let deletePollArr = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'pollId'){
            deletePollArr.pollId = value;
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
        try{
            connect.then(db => {
                Polls.findByIdAndUpdate({ _id: deletePollArr.pollId }, { dateDeleted: Date.now() }, function(err, deleteRes) {
                    if(err){
                        
                        return res.status(501).json({ success: false, msg: 'Poll failed to delete' });

                    }  else if(deleteRes){

                        return res.status(200).json({ success: true, deleteResult: deleteRes });
                    }
                });
            })
            
        }catch(inException){

            console.log(`${inException}`);
        }
    });
}

module.exports = deletePoll;