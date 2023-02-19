const connect = require('../../config/dbConfig');
const User = require('../../models/user');
const formidable = require('formidable');
const { response } = require('express');


let updateUser = (req, res) => {

    let updateUserArr = new Object();

    new formidable.IncomingForm().parse(req)
    
    .on('field', (field, value) => {
        if(field == 'userId'){
            updateUserArr.userId = value;
        }
        if(field == 'upUserFname'){
            updateUserArr.upUserFname = value;
        }
        if(field == 'upUserLName'){
            updateUserArr.upUserLName = value;
        }
        if(field == 'upUserEmail'){
            updateUserArr.upUserEmail = value;
        }
        if(field == 'upUserPhone'){
            updateUserArr.upUserPhone = value;
        }
        

    })
    .on('fileBegin', (name, file) =>{
        file.path = 'public/media/img/' + file.name
        console.log('here1');
    })
    .on('file', (name, file) =>{
        updateUserArr.uploadImg = file.name;
        console.log(updateUserArr.uploadImg);
        console.log('uploaded file' + file.name);
        console.log('here2');

        
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
                User.findOneAndUpdate({ _id: updateUserArr.userId }, { $set: { firstname: updateUserArr.upUserFname, lastname: updateUserArr.upUserLName, email: updateUserArr.upUserEmail, phone: updateUserArr.upUserPhone, uploadImg: updateUserArr.uploadImg } }, { new: true }, function(err, result){
                    if(err){
                        console.log(result)
                        return res.status(501).json({ success: false, msg: err });
 
                    } else if(result){
                        console.log(result)

                        io.emit('userUpdRes', result);
                        return res.status(200).json({ success: true, updateUser: result });
                    }
                });
            });
        } catch(inException){
            console.log(`${inException}`);
        }
    });

}

module.exports = updateUser;

