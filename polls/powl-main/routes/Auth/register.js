const formidable = require('formidable');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const connect = require('../../config/dbConfig');
const Users = require('../../models/user');

let signupRoute = (req, res) => {

    let regUser = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'firstname'){
            regUser.firstname = value;
        }
        if(field == 'lastname'){
            regUser.lastname = value;
        }
        if(field == 'othername'){
            regUser.othername = value;
        }
        if(field == 'gender'){
            regUser.gender = value;
        }
        if(field == 'email'){
            regUser.email = value;
        }
        if(field == 'username'){
            regUser.username = value;
        }
        if(field == 'phone'){
            regUser.phone = value;
        }
        if(field == 'password'){
            regUser.password = value;
        }
        if(field == 'cPassword'){
            regUser.cPassword = value;
        }
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
    })
    .on('end', () => {
        let err = 0;
        let salt = 10;
        if(regUser.password !== regUser.cPassword){
            console.log('Passwords does not match');
            err = 1;
        } else {
            err;
            bcrypt.hash(regUser.password, salt, function(err, encrypted) {
                if(!err){
                    try{
                        //save User to the database
                        connect.then(db => {
                            let newUser = new Users({
                                firstname: regUser.firstname,
                                lastname: regUser.lastname,
                                othername: regUser.othername,
                                email: regUser.email,
                                gender: regUser.gender,
                                username: regUser.username,
                                phone: regUser.phone,
                                password: encrypted
                            });
                    
                            newUser.save(function(err, result){
                                if(err){
                                    return res.status(501).json({ success: false, msg: err });
                                } else {
                                    // let transporter = nodemailer.createTransport({
                                    //     service: 'gmail',
                                    //     auth: {
                                    //         user: 'ezehigc@gmail.com',
                                    //         pass: ''
                                    //     }
                                    // });

                                    // let mailOptions = {
                                    //     from: 'admingmail@gmail.com',
                                    //     to: 'ezehigc@gmail.com',
                                    //     subject: 'Sign up confirmation.',
                                    //     text: 'Go to this link for confirmation of your registration:\n\n'+ 
                                    //     'http://' + req.headers.host + '/authenticate?email=' + result.email + ''
                                    // };

                                    // transporter.sendMail(mailOptions, function(errMail, resultMail){
                                    //     if(errMail){

                                    //         return res.status(501).json({ success: true, newUser: result });
                                        
                                    //     } else {

                                    //         return res.status(200).json({ success: true, newUser: result });
                                    //     }
                                    // });
                                    console.log(result);

                                    return res.status(200).json({ success: true, newUser: result });

                                }
                            });                
                        });
                    } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
                        console.log(`${inException}`);
                    }
                } else {
                    console.log(err);
                }
            });
        }
    })

}

module.exports = signupRoute;