const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

var socket = require('socket.io');       //import socket server                           
var io = socket(server);                                            

var gpio1_status = 0;
var gpio2_status = 0;
var gpio3_status = 0;

var online = 0; //number of online users

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
        gpio1_status = !gpio1_status;
        toggle1(gpio1_status);
        io.sockets.emit('gpio1_click', gpio1_status);
    });

    socket.on('gpio2_click', ()=> {
        gpio2_status = !gpio2_status;
        toggle2(gpio2_status);
        io.sockets.emit('gpio2_click', gpio2_status);
    });

    socket.on('gpio3_click', ()=> {
        gpio3_status = !gpio3_status;
        toggle3(gpio3_status);
        io.sockets.emit('gpio3_click', gpio3_status);
    });

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)}: ${message}`);
    });


});



/************************************ COMMENT OUT if not PI  **********************************
const toggle = require('./gpio-toggle').toggle; //import toggle fn from gpio-toggle module
const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');
videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 10 //lower is faster
}, '/stream.mjpg', true); */


app.use(express.static(__dirname+'/public')); //front-end files in public




