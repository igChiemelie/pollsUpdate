const connect = require('../../../config/dbConfig');
const Users = require('../../../models/user');

let allUsers = (req, res) => {
    try{
        connect.then(db => {
            Users.find({ $and: [ { dateDeleted: null }, { userType: "guest" } ] }, {}, function(err, result){
                if(err){

                    return res.status(501).json({ success: false, msg: 'No user found.', err: err });
                    
                } else {
                    let allUsers = {
                        user: result
                    }
                    return res.status(200).json({ success: true, users: allUsers });
                }
            }).sort({ dateCreated: -1 })
        });
    } catch (inException){
        console.log(`${inException}`);
    }
}

module.exports = allUsers;