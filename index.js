const express = require('express')
const app = express()
const port = 3000;



const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');
videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 10 //lower is faster
}, '/stream.mjpg', true);

app.use(express.static(__dirname+'/public'));



app.listen(port, () => console.log(`Listening on port ${port}!`));


