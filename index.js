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
// const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');

// videoStream.acceptConnections(app, {
//     width: 1280,
//     height: 720,
//     fps: 16,
//     encoding: 'JPEG',
//     quality: 10 //lower is faster
// }, '/stream.mjpg', true); 

/************************************ COMMENT OUT if not PI  **********************************/

let db = new sqlite3.Database(path.resolve('./.userinfo.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the UserInfo Database');
});


const io = socket(server);                                            

var gpio1_status, gpio2_status, gpio3_status, gpio4_status= 0;

var online = 0; //number of online users

var simon_on = false; 

io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
    console.log(socket.id, 'connected');
    socket.join('onlookers room');   //onlookers room 

    online += 1;
    io.sockets.emit('online', online); //server sends to all connected websockets the updated online number
    
    //Listening for events
    socket.on('disconnect', ()=> {
        console.log(socket.id, 'disconnected');
        online -= 1;
        io.sockets.emit('online', online);
    });

    socket.on('gpio1_down', ()=> { 
        gpio.LED_ctl(gpio.LED_1,1);
    });
    socket.on('gpio1_leave', ()=> { gpio.LED_ctl(gpio.LED_1,0); });

    socket.on('gpio2_down', ()=> { gpio.LED_ctl(gpio.LED_2,1); });
    socket.on('gpio2_leave', ()=> { gpio.LED_ctl(gpio.LED_2,0);});

    socket.on('gpio3_down', ()=> { gpio.LED_ctl(gpio.LED_3,1); });
    socket.on('gpio3_leave', ()=> { gpio.LED_ctl(gpio.LED_3,0);});

    socket.on('gpio4_down', ()=> { gpio.LED_ctl(gpio.LED_4,1); });
    socket.on('gpio4_leave', ()=> { gpio.LED_ctl(gpio.LED_4,0);});

    
    socket.on('simon-start', ()=> {
        socket.leave('onlookers room')
        socket.join('simon room ');

        io.to('onlookers room').emit('simon-start-onlooker');
        io.to('simon room').emit('simon-start-player');
        simon_on = true;


        console.log("SIMON Start")

        // SIMON game???
    });

    socket.on('simon-end', ()=> {
        socket.leave('simon room')
        socket.join('onlookers room');

        io.to('onlookers room').emit('simon-end-onlooker');
        console.log("SIMON END")
    });

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







/* FOR USE LATER */
// socket.on('gpio1_click', ()=> {
//     gpio1_status = (gpio1_status) ? 0 : 1;
//     gpio.LED_ctl(gpio.LED_1, gpio1_status)
//     io.sockets.emit('gpio1_click', gpio1_status);
// });

// socket.on('gpio2_click', ()=> {
//     gpio2_status = (gpio2_status) ? 0 : 1;
//     gpio.LED_ctl(gpio.LED_2, gpio2_status)
//     io.sockets.emit('gpio2_click', gpio2_status);
// });

// socket.on('gpio3_click', ()=> {
//     gpio3_status = (gpio3_status) ? 0 : 1;
//     gpio.LED_ctl(gpio.LED_3, gpio3_status)
//     io.sockets.emit('gpio3_click', gpio3_status);
// });

// socket.on('gpio4_click', ()=> {
//     gpio4_status = (gpio4_status) ? 0 : 1;
//     gpio.LED_ctl(gpio.LED_4, gpio4_status)
//     io.sockets.emit('gpio4_click', gpio4_status);
// });
