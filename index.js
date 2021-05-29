const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

const gpio = require('./gpio-toggle'); //import gpio functions and variables

var socket = require('socket.io');       //import socket server                           
var io = socket(server);                                            

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




    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substr(0,2)}: ${message}`);
    });


});




/************************************ COMMENT OUT if not PI  **********************************/
const videoStream = require('raspberrypi-node-camera-web-streamer/videoStream');

videoStream.acceptConnections(app, {
    width: 1280,
    height: 720,
    fps: 16,
    encoding: 'JPEG',
    quality: 10 //lower is faster
}, '/stream.mjpg', true); 

/************************************ COMMENT OUT if not PI  **********************************/

app.use(express.static(__dirname+'/public')); //front-end files in public








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
