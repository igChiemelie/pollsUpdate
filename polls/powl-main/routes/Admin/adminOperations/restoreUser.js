const connect = require('../../../config/dbConfig');
const Users = require('../../../models/user');

let restoreUser = (req, res) => {
    try{
        connect.then(db => {
            Users.find({ dateDeleted: { $ne: null } }, {}, function(err, result){
                if(err){

                    return res.status(501).json({ success: false, msg: 'No User found in the Database.' });
                
                } else if(result){
                    
                    return res.status(200).json({ success: true, restore: result });
                }
                
            }).sort({ dateCreated: -1 })
        });
    }catch(inException){
        console.log(`${inException}`);
    }
}

module.exports = restoreUser;