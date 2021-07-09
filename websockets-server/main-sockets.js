var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 
const sqlite3 = require('better-sqlite3');
const path = require('path');

var simon_on = false;


var user_socket_pairs =  {

};
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}




module.exports = function (io, queue, db, online) {

    io.on('connection', (socket) => { //when a new client connects to server, websocket connected!

        console.log(socket);

        io.to(socket.id).emit('check-register');
        socket.on('receive-register', (username)=> {
            console.log(`USERNAME: ${username}`);
            
            if (username != '')
                user_socket_pairs[username]= socket.id;
            console.log(user_socket_pairs);
        });

        console.log(socket.id, 'connected');
        // var r = Math.random() * 255; var g = Math.random() * 255; var b = Math.random() * 255;
        socket.join('public room');   //public room 

        online += 1;
        console.log(online)
        io.sockets.emit('online', online); //server sends to all connected websockets the updated online number



        socket.on('disconnect', (reason)=> {
            console.log(socket.id, 'disconnected:', reason);
            online -= 1;
            io.sockets.emit('online', online);

            let username = getKeyByValue(user_socket_pairs, socket.id);
            console.log(username);
            
            delete user_socket_pairs[username];
        });


        /***************** RPI COMMENT OUT **************************************************************************/
        require('./gpio-onoff')(socket);  /* GPIO onoff websockets */

        /* Simon Says Mini Game websockets */
        simon_sockets = require('./simon')
        simon_sockets.simon_start(socket, io, db);
        simon_sockets.socket_simon_end(socket, io, db, );
        simon_sockets.player_says(socket, io, db);
        /***************** RPI COMMENT OUT **************************************************************************/


        socket.on('message', (message, tempname) => {
            console.log(message);
            if (tempname === "")
                io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
            else
                io.emit('message', `${tempname}: ${message}`);
        });        





        // const db = new sqlite3(path.resolve('./userinfo.db')); 

        socket.on('enterqueue', (tempname) => {
            let isQueued = queue.includes(tempname);
            console.log(`isQueue: ${isQueued}`);
            let isRegistered;

            if (tempname === "") {
                console.log("Not registered User");
                isRegistered = false;
            }
                
            //isRegistered === true
            else { 
                // db.prepare(`INSERT INTO queuestack (name) VALUES ('${tempname}');`).run();
                // let queueinfo = db.prepare(`SELECT * FROM queuestack`).all();
                // let queuepos = db.prepare(`SELECT (queue_no) FROM queuestack WHERE name = '${tempname}'`).all();
                if (!isQueued) {
                    queue.push(tempname);
                    isQueued = true;
             
                }      
                console.log(queue);         
                isRegistered = true;
                if (tempname === queue[0] &&  simon_on === false) {
                    io.to(socket.id).emit('simon-start-server');
                    simon_on = true;
                }
                
            }

            io.emit('queuestatus', queue);
            io.to(socket.id).emit('queuetext', queue, isRegistered, false);
        });

        socket.on('exitqueue', (tempname) => {
            if (tempname === "") {
                console.log("Not registered User");
            }

            //IF REGISTERED
            else { 
                // db.prepare(`DELETE FROM queuestack WHERE name = '${tempname}'`).run();
                // let queueinfo = db.prepare(`SELECT * FROM queuestack`).all();
                // let queuepos = db.prepare(`SELECT (queue_no) FROM queuestack WHERE name = '${tempname}'`).all();

                let isQueued = queue.includes(tempname);

                //only run this code if in queue
                //no need to exit queue if not inside
                if (isQueued) {
                    let index;           
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i] === tempname) {
                            index = i;
                            break;
                        }                        
                    }
                    queue.splice(index, 1);
                    isQueued = false;     
                    console.log(queue); 
                    io.emit('queuestatus', queue);
                    io.emit('queuetext', queue, true, true);

                    if (index == 0) {
                        //PLAYER quits, move to next in line
                        io.to(socket.id).emit('simon-end-server');
                        console.log("Player Quit Simon")

                        //next
                        let next_player = queue[0];
                        console.log(`Nextplayer: ${next_player}`);

                        console.log(user_socket_pairs[next_player]);
                        io.to(user_socket_pairs[next_player]).emit('simon-start-server-next', next_player);

                    }
                    if (queue.length == 0)
                        simon_on = false;
                }
            }
        }
        )

    });
}

