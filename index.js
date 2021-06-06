if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const server = app.listen(port, () => console.log(`Server started on port ${port}`));
const sqlite3 = require('sqlite3');
const path = require('path');
// const gpio = require('./gpio-toggle'); //import gpio functions and variables
const socket = require('socket.io');       //import socket server    
const passport = require('passport');
const bcrypt = require('bcrypt');    
const flash = require('express-flash');
const session = require('express-session');   

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []; //eventually store users' data in database

/************************************ COMMENT OUT if not PI  **********************************/
const gpio = require('./gpio-toggle'); //import gpio functions and variables
const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');

videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 10 //lower is faster
}, '/stream.mjpg', true); 

/************************************ COMMENT OUT if not PI  **********************************/

let db = new sqlite3.Database(path.resolve('./.userinfo.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the UserInfo Database');
});


const io = socket(server);                                            

var online = 0; //number of online users
var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 

io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
    console.log(socket.id, 'connected');
    socket.join('public room');   //public room 

    online += 1;
    io.sockets.emit('online', online); //server sends to all connected websockets the updated online number
    
    socket.on('disconnect', ()=> {
        console.log(socket.id, 'disconnected');
        online -= 1;
        io.sockets.emit('online', online);
    });

    require('./websockets/gpio-onoff')(socket); //websockets with onoff functionality 

    simon_sockets = require('./websockets/simon')
    simon_sockets.simon_start(socket, io);
    simon_sockets.socket_simon_end(socket, io);
    simon_sockets.player_says(socket, io);



    socket.on('message', (message, tempname) => {
        console.log(message);
        if (tempname == null)
            io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
        else
            io.emit('message', `${tempname}: ${message}`);
    });
});





app.use(express.static(__dirname+'/public')); //front-end files in public
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/index.html');
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+'/public/signup.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname+'/public/profile.html');
});

app.post('/profile', passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/', failureFlash: true }));


app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/');
    } catch {
        res.redirect('/signup');
    }
    console.log(users);
});





