const connect = require('../../../config/dbConfig');
const User = require('../../../models/user');
const formidable = require('formidable');
// const { find } = require('../../../models/user');

let deleteUser = (req, res) => {
    
    let deleteUserArr = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userId'){
            deleteUserArr.userId = value;
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
            try{
                User.findOneAndUpdate({ _id: deleteUserArr.userId }, { dateDeleted: Date.now() }, function(err, result){
                    if(err){
                        
                        return res.status(501).json({ success: false, msg: 'User failed to delete.' });

                    } else if(result) {
                        
                        return res.status(200).json({ success: true, deleteUser: result });
                    }
                });
            } catch(inException){
                console.log(`${inException}`);
            }
        });
    });
}

module.exports = deleteUser;