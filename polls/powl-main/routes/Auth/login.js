const formidable = require('formidable');
const bcrypt = require('bcrypt');
const connect = require('../../config/dbConfig');
const Users = require('../../models/user');

let loginRoute = (req, res) => {

    let userLogin = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'email'){
            userLogin.email = value;
        }
        if(field == 'password'){
            userLogin.password = value;
        }
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err;
    })
    .on('end', () => {
        try{
            Users.find({email: userLogin.email}, {}, function(err, userDocs){
                if(err){
                    return res.status(501).json({ success: false, msg: 'Incorrect Email' })
                } else {
                    if(userDocs.length > 0){
                        if(userDocs[0].dateDeleted == undefined){
                           
                            let userPass = userDocs[0].password;

                            bcrypt.compare(userLogin.password, userPass, function (err, result) {
                                if(result) {
                                    req.session.loggedIn = true;
                                    req.session.names = userDocs[0].firstname+' '+userDocs[0].lastname;
                                    req.session.userId = userDocs[0]._id;
                                    req.session.email = userDocs[0].email;

                                    return res.status(200).json({ success: true, user: userDocs[0] });

                                } else {

                                    return res.status(501).json({ success: false, msg: 'User not LoggedIn' })
                                }
                            });
                        } else {

                            console.log('User was removed on '+ userDocs[0].dateDeleted); 
                            return res.status(501).json({ success: false, msg: 'User was removed on '+ userDocs[0].dateDeleted});
                        }
                        
                    } else {
                        return res.status(501).json({ success: false, msg: 'Invalid Username/Password' })
                    }
                }                
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            console.log(`${inException}`);
        }
        // console.log('here');
    });
};

module.exports = loginRoute;
