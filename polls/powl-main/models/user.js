const mongoose = require("mongoose");
// const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
		type: String,
		required: [true, 'Please fill firstname field.']
	},
	lastname: {
		type: String,
		required: [true, 'Please fill lastname field.']
	},
	othername: {
		type: String
	},
	email: {
		type: String,
		required: [true, 'Please fill email field.'], 
		unique: true
	},
	gender: {
		type: String,
        enum: ['M', 'F'],
		required: [true, 'Please select your gender.']
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: [true, 'Please provide your mobile number.']
	},
	authentication: {
		type: String,
		default: 'pending'
	},
	userType: {
		type: String,
		enum: ['admin', 'guest'],
		default: 'guest'
	},
	uploadImg: {
		type: String,
		default: ""
	},
  	dateCreated: {
		type: Date,
    	default: Date.now
	},
    dateDeleted: {
        type: Date,
		default: null
    }
});

let User = mongoose.model("User", userSchema);

module.exports = User;