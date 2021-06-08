if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const server = app.listen(port, () => console.log(`Server started on port ${port}`));
const sqlite3 = require('sqlite3');
const ejs = require('ejs');
const path = require('path');
const socket = require('socket.io');       //import socket server    
const passport = require('passport');
const bcrypt = require('bcrypt');    
const flash = require('express-flash');
const session = require('express-session');   
const initializePassport = require('./passport-config');
const methodOverride = require('method-override');

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []; //eventually store users' data in database
var auth = false;

/************************************ COMMENT OUT if not PI  **********************************/
// const gpio = require('./gpio-toggle'); //import gpio functions and variables
// const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');

// videoStream.acceptConnections(app, {
//     width: 1280,
//     height: 720,
//     fps: 16,
//     encoding: 'JPEG',
//     quality: 10 //lower is faster
// }, '/stream.mjpg', true); 

/************************************ COMMENT OUT if not PI  **********************************/

//import all web sockets required
require('./websockets-server/main')(socket(server)); 

var online = 0; //number of online users
var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 

/* Web Sockets */
const io = socket(server);                                            

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

    require('./websockets-server/gpio-onoff')(socket); //websockets with onoff functionality 

    simon_sockets = require('./websockets-server/simon')
    simon_sockets.simon_start(socket, io);
    simon_sockets.socket_simon_end(socket, io);
    simon_sockets.player_says(socket, io);

    socket.on('message', (message, tempname) => {
        console.log(message);
        if (!auth)
            io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
        else
            io.emit('message', `${tempname}: ${message}`);
    });
});

let db = new sqlite3.Database(path.resolve('./.userinfo.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the UserInfo Database');
});


app.use(express.static(__dirname+'/public')); //render static files like images
app.set('views', path.join(__dirname, 'public/views')); //sets view engine to ejs
app.set('view engine', 'ejs'); //sets view engine to ejs

app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    auth = req.isAuthenticated();
    if (!auth) {
        res.render('pages/index', {
            auth: auth 
        });
    } else {
    res.render('pages/index', {
        auth: auth,
        userid: req.user.name
    });
    }
});

app.get('/signup', (req, res) => {
    auth = req.isAuthenticated();
    if (!auth) {
        res.render('pages/signup', {
            auth: auth 
        });
    } else {
        res.render('pages/signup', {
            auth: auth,
            userid: req.user.name
        });
    }
    
});

app.get('/profile', (req, res) => {
    auth = req.isAuthenticated();
    if (!auth) {
        res.render('pages/profile', {
            auth: auth 
        });
    } else {
    res.render('pages/profile', {
        auth: auth,
        userid: req.user.name
    });
    }
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

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }

//     res.redirect('/');
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/');
//     }

//     next();
// }



