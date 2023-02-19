const connect = require('../../../config/dbConfig');
const Users = require('../../../models/user');
const formidable = require('formidable');

let restoredUser = (req, res) => {

    let restoredUserArr = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userId'){
            restoredUserArr.userId = value;
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
                Users.findOneAndUpdate({ _id: restoredUserArr.userId }, { $set: { dateDeleted: null } }, function(err, result){
                    if(err){
                        
                        return res.status(501).json({ success: false, msg: 'Operation failed'});

                    } else if(result){

                        return res.status(200).json({ success: true, restored: result});
                    }
                });
            });

        } catch(inException){
            console.log(`${inException}`);            
        }
    })
}

module.exports = restoredUser;