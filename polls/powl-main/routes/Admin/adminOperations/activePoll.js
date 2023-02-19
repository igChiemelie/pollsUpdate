const connect = require('../../../config/dbConfig');
const Poll = require('../../../models/poll');
const formidable = require('formidable');

let activePoll = (req, res) => {

    let activePollArr = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'pollId'){
            activePollArr.pollId = value;
        }
        if(field == 'toggle'){
            activePollArr.toggle = value;
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
                Poll.findOneAndUpdate({ _id: activePollArr.pollId }, { $set: { toggle: activePollArr.toggle } }, { new: true }, function(err, toggleResult){
                    if(err){
                        return res.status(401).json({ success: false, msg: 'Poll not updated'});

                    } else if(toggleResult){
                        
                        io.emit('toggle', toggleResult);
                        return res.status(200).json({ success: true, activePoll: toggleResult });
                    }
                });
            });
        }catch(inException){
            console.log(`${inException}`);
        }
    })
}

module.exports = activePoll;