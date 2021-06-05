const express = require('express');
const app = express();
const port = 3000; 
const server = app.listen(port, () => console.log(`Server started on port ${port}`));
const sqlite3 = require('sqlite3');
const path = require('path');
const socket = require('socket.io');       //import socket server                           

/************************************ COMMENT OUT if not PI  **********************************/
const gpio = require('./gpio-toggle'); //import gpio functions and variables
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

var online = 0; //number of online users
var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 

var hist = gpio.simon_history;
var hist_len = gpio.simon_history.length;
var hist_i = 0; 

// async function async_user_says(socket) {
//     socket.on('user-says', (user_says)=> {
//         hist = gpio.simon_history;
//         hist_len = gpio.simon_history.length;

//         console.log(`History List: ${hist}`)
//         console.log(`User says: ${user_says}   Hist: ${hist[hist_i]}`);
//         console.log(`Index: ${hist_i}  Hist_len = ${hist_len}`);

//         if (user_says == hist[hist_i]) { //correct
//             hist_i++;
//             if (hist_i == hist_len) {  //all correct
//                 // io.sockets.emit('simon_correct');
//                 console.log('simon pass');
//                 await gpio.simon_start();
//                 io.to('simon room').emit('is-simon-speaking');
//             }
//         }
//         else{
//             console.log("FAIL***************************8");
//             // gpio.simon_end();
//         } //wrong answer

//         console.log();

//     });
// }


io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
    console.log(socket.id, 'connected');
    socket.join('onlookers room');   //onlookers room 

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
    simon_sockets.user_says_init(socket, io);
    simon_sockets.user_says(socket, io);
    simon_sockets.simon_end(socket, io);



    socket.on('message', (message, tempname) => {
        console.log(message);
        if (tempname == null)
            io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
        else
            io.emit('message', `${tempname}: ${message}`);
    });
});





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
