const express = require('express')
const app = express()
const port = 3000;


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


toggle(0,0,0);

const server = app.listen(port, () => console.log(`Server started on port ${port}`));

const io = require('socket.io')(server); //import socket server



