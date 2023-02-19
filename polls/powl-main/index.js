// USE STRICT; 
const express = require('express');
const app = express();
const session = require('express-session');
const http = require('http').Server(app);
// require the socket.io module
const socket = require("socket.io");
//integrating socketio
io = socket(http);
//
require('dotenv').config();
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
const cors = require('cors');
const mustacheExpress = require('mustache-express');
const secret = 'adY8ur8wnS4cr4tH4r4';

// const formidable = require('formidable');
// const connect = require('./config/dbConfig');
// const Polls = require('./models/poll');

app.use(express.urlencoded({extended: false}));
// app.use(express.json());
// app.use(bodyParser.json());

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+"/public"));
app.use(cookieParser(secret));
app.use(session({             
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: false 
    }
}));

// app.use(cors);
// app.use(csrf());

// Stop page caching
app.use(function(req, res, next){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
const port = 4000;

let broadcastVotes = () => {
    console.log('here ');
}

//GUEST
const homeRoute = require('./routes/guest/home');

//AUTH
const signupRoute = require('./routes/Auth/register');
const loginRoute = require('./routes/Auth/login');

// Authenticate User
const activate = require('./routes/guest/activate');
app.get('/authenticate', cors(), activate);

//Gateway
// app.get('/gateway', (req, res) => {
//     res.render('gateway');
// })

//Dashboard
// app.get('/polls/all', (req, res) => {
//     res.render('dashboard');
// });

// Index
// app.get('/', (req, res) => {
    
//     res.render('index');
// })

//ADMIN
const addPoll = require('./routes/Admin/polls/create');
const allPoll = require('./routes/Admin/polls/all');
const singlePoll = require('./routes/Admin/polls/single');
const update = require('./routes/Admin/polls/update');
const deletePoll = require('./routes/Admin/polls/delete');

// Admin / User Control
const allUsers = require('./routes/Admin/adminOperations/allUsers');
const singleUser = require('./routes/Admin/adminOperations/singleUser');
const deleteUser = require('./routes/Admin/adminOperations/deleteUser');
const restoreUser = require('./routes/Admin/adminOperations/restoreUser');
const restoredUser = require('./routes/Admin/adminOperations/restoredUser');
const updateUser = require('./routes/guest/updateUser');
const activePoll = require('./routes/Admin/adminOperations/activePoll');

app.get('/', homeRoute);
app.options('/register', cors()); // enable pre-flight
app.post('/register', cors(), signupRoute);
app.options('/login', cors()); // enable pre-flight
app.post('/login', cors(), loginRoute);

//ADMIN
//polls
app.options('/polls/add', cors());
app.post('/polls/add', cors(), addPoll);
// app.options('/polls/all', cors()) // enable pre-flight
app.get('/polls/all', cors(), allPoll);
app.get('/polls/poll/:id', singlePoll);
app.options('/polls/poll/:id', cors()) // enable pre-flight
app.patch('/polls/poll/:id', cors(), update);
app.options('/polls/poll/delete/:id', cors());
app.patch('/polls/poll/delete/:id', cors(), deletePoll);

// Admin / User Control
app.get('/allUsers', cors(), allUsers);
app.options('/singleUser', cors());
app.post('/singleUser', cors(), singleUser);
app.options('/deleteUser', cors());
app.patch('/deleteUser', cors(), deleteUser);
app.get('/restoreUser', cors(), restoreUser);
app.options('/restoredUser', cors());
app.patch('/restoredUser', cors(), restoredUser);
app.options('/updateUser', cors());
app.post('/updateUser', cors(), updateUser);
app.options('/activePoll', cors()); 
app.patch('/activePoll', cors(), activePoll);

// onlineUserDet = () => {
//     let onlineUserDetails = [];
//     let onlineUserLen = onlineUsers.length;
    
//     onlineUsers.map((item, index) => {                                                   
//         if (item.sessionId != '') {

//             User.find({
//                 _id: item.userId,
//             }).exec((err, user) => {
//                 if(err) throw err;

//                 let len = user.length;
//                 if(len > 0){//if exists                         

//                     Pin.find({
//                         usedBy: item.userId
//                     })
//                     .sort({'dateUsed': -1})
//                     .limit(1)
//                     .exec((er, pin) => {
//                         if(er) throw er;

//                         if(pin.length > 0){
//                             let userArr = {};
//                             userArr.sessionId = item.sessionId;
//                             userArr.userId = item.userId;
//                             let dateExpire = moment(pin[0]['dateExpire']).fromNow();
//                             userArr.lastSubDate = dateExpire;
//                             userArr.name = user[0]['firstname']+' '+user[0]['lastname']+' '+user[0]['othername'];
//                             onlineUserDetails.push(userArr);

//                             if (onlineUserLen === index + 1) {
//                                 // last one
                                
//                                 //return these details
//                                 io.emit("takeOnlineUsers", onlineUserDetails);
//                             } 
                            
//                         }
//                     });
//                 } else {//else
//                     //delete user from onlineUsers[]

//                     io.emit("userLogout", {});
//                 }
//             });   
                        
//         } else {
//             io.emit("takeOnlineUsers", onlineUserDetails);
//         }
//     }); 
// }

// Socket Operations

io.on("connection", io => {
    let sessionId = io.id;

     /**
     * When a user first connects, emit a message that will cause it to send
     * its userID via a validateUser message.
     */
    io.emit("connected", { userSessionId: sessionId });

    io.on('castVote', (data) => {
        console.log(data);
    })

    io.on('disconnect', () => {
        let disconnectedSessionId = io.id;

        console.log(disconnectedSessionId+' is disconnected!');

        // let onlineUsersLen = onlineUsers.length;
        // if(onlineUsersLen > 0){
        //     onlineUsers.map((item, index) => {                                                   
        //         if (String(item.sessionId) == String(disconnectedSessionId)) {
        //             //update sessionId
        //             item.sessionId = '';

        //             //console.log('disconnect')
        //             onlineUserDet(); 
        //         } 
        //     });  
              
        // }
    });
});

// Handle 404
// app.use(function(req, res) {
//     res.status(404);
//     res.render('404.html', {title: '404: File Not Found'});
// });
   
// // Handle 500
// app.use(function(error, req, res, next) {
//     res.status(500);
//     res.render('500.html', {title:'500: Internal Server Error', error: error});
// });

http.listen(port, () => {
    console.log('Running on port: '+port);
});