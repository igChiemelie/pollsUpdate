const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = new Schema({
	topic: {
		type: String,
		required: [true, 'Please provide poll topic.']
	},
    title: {
		type: String,
		required: [true, 'Please provide poll title.']
	},
	toggle: {
		type: Boolean,
		default: true
	},
	optionA: {
		type: String,
		required: [true, 'Please provide option A for this poll.']
	},
	optionB: {
		type: String,
		required: [true, 'Please provide option B for this poll.']
	},
	optionAVoters: {
		type: []
	},
	optionBVoters: {
		type: []
	},
  	dateCreated: {
		type: Date,
    	default: Date.now
	},
    dateDeleted: {
        type: Date
    }
});

let Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
