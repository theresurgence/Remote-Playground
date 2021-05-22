const express = require('express')
const app = express()
const port = 3000;
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

var socket = require('socket.io');       //import socket server                           
var io = socket(server);                                            


var online = 0; //number of online users

io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
    console.log(socket.id, 'connected');
    online += 1;
    io.sockets.emit('online', online); //server sends to all connected websockets the updated online number
    
    socket.on('disconnect', ()=> {
        console.log(socket.id, 'disconnected');
        online -= 1;
        io.sockets.emit('online', online);
    });

});








const toggle = require('./gpio-toggle').toggle; //import toggle fn from gpio-toggle module


const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');
videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 10 //lower is faster
}, '/stream.mjpg', true);


app.use(express.static(__dirname+'/public')); //front-end files in public


//toggle(0,0,0);


