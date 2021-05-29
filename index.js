const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();

let db = new sqlite3.Database(path.resolve('./.userinfo.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the UserInfo Database');
});

const port = 3000; 
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

var socket = require('socket.io');       //import socket server                           
var io = socket(server);                                            

var gpio1_status, gpio2_status, gpio3_status, gpio4_status= 0;

var online = 0; //number of online users

const gpio = require('./gpio-toggle'); //import toggle fn from gpio-toggle module

io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
    console.log(socket.id, 'connected');
    online += 1;
    io.sockets.emit('online', online); //server sends to all connected websockets the updated online number
    
    //Listening for events
    socket.on('disconnect', ()=> {
        console.log(socket.id, 'disconnected');
        online -= 1;
        io.sockets.emit('online', online);
    });

    socket.on('gpio1_click', ()=> {
        gpio1_status = (gpio1_status) ? 0 : 1;
        gpio.LED_ctl(gpio.LED_1, gpio1_status)
        io.sockets.emit('gpio1_click', gpio1_status);
    });

    socket.on('gpio2_click', ()=> {
        gpio2_status = (gpio2_status) ? 0 : 1;
        gpio.LED_ctl(gpio.LED_2, gpio2_status)
        io.sockets.emit('gpio2_click', gpio2_status);
    });

    socket.on('gpio3_click', ()=> {
        gpio3_status = (gpio3_status) ? 0 : 1;
        gpio.LED_ctl(gpio.LED_3, gpio3_status)
        io.sockets.emit('gpio3_click', gpio3_status);
    });

    socket.on('gpio4_click', ()=> {
        gpio4_status = (gpio4_status) ? 0 : 1;
        gpio.LED_ctl(gpio.LED_4, gpio4_status)
        io.sockets.emit('gpio4_click', gpio4_status);
    });

    
    socket.on('start_simon', ()=> {
        gpio1_status = !gpio1_status;
        LED1(gpio1_status);
        io.sockets.emit('gpio1_click', gpio1_status);
    });

    socket.on('message', (message, tempname) => {
        console.log(message);
        if (tempname == null)
            io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
        else
            io.emit('message', `${tempname}: ${message}`);
    });


});


gpio.LED_ctl(gpio.LED_1, 'a');


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

app.use(express.static(__dirname+'/public')); //front-end files in public




