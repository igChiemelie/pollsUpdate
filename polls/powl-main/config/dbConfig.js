const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// const url = `${process.env.MONGO_URL}`;
const url = "mongodb://localhost:27017/powl";


const connect = mongoose.connect(url, {  useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });

module.exports = connect;