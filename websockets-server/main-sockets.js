var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 
var online = 0; //number of online users
const sqlite3 = require('better-sqlite3');
const path = require('path');



module.exports = function (io) {

    io.on('connection', (socket) => { //when a new client connects to server, websocket connected!
        console.log(socket.id, 'connected');
        var r = Math.random() * 255; var g = Math.random() * 255; var b = Math.random() * 255;
        socket.join('public room');   //public room 

        online += 1;
        io.sockets.emit('online', online); //server sends to all connected websockets the updated online number

        socket.on('disconnect', ()=> {
            console.log(socket.id, 'disconnected');
            online -= 1;
            io.sockets.emit('online', online);
        });


        /***************** RPI COMMENT OUT **************************************************************************/
        // require('./gpio-onoff')(socket);  /* GPIO onoff websockets */

        // /* Simon Says Mini Game websockets */
        // simon_sockets = require('./simon')
        // simon_sockets.simon_start(socket, io);
        // simon_sockets.socket_simon_end(socket, io);
        // simon_sockets.player_says(socket, io);
        /***************** RPI COMMENT OUT **************************************************************************/


        socket.on('message', (message, tempname) => {
            console.log(message);
            if (tempname === "")
                io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`, r, g, b);
            else
                io.emit('message', `${tempname}: ${message}`, r, g, b);
        });        

        const db = new sqlite3(path.resolve('./userinfo.db')); 

        socket.on('enterqueue', (tempname) => {
            if (tempname === "")
                console.log("Not registered User");
            else { 
                db.prepare(`INSERT INTO queuestack (name) VALUES ('${tempname}');`).run();
                let queueinfo = db.prepare('SELECT * FROM queuestack').all();
                console.log(queueinfo);
                io.emit('queuestatus', queueinfo);
            }
        });

        socket.on('exitqueue', (tempname) => {
            if (tempname === "")
                console.log("Not registered User");
            else { 
                db.prepare(`DELETE FROM queuestack WHERE name = '${tempname}'`).run();
                let queueinfo = db.prepare('SELECT * FROM queuestack').all();
                console.log(queueinfo);
                io.emit('queuestatus', queueinfo);
            }
        })

    });
}

