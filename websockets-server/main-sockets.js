var gpio0_status, gpio1_status, gpio2_status, gpio3_status= 0;
var simon_on = false; 
const sqlite3 = require('better-sqlite3');
const path = require('path');
const {isBuffer} = require('util');

var user_socket_pairs= { };
const queue = [];

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

module.exports = {
    main_sockets, 
    queue,
}

function main_sockets(io, db, online) {

    io.on('connection', (socket) => { //when a new client connects to server, websocket connected!

        // console.log(socket);

        //emit to client to check if user has logged in
        io.to(socket.id).emit('check-login');
        socket.on('checked-login', (username)=> {
            let is_loggedin = false;

            if (username != '') { 
                is_loggedin = true;
                user_socket_pairs[username]= socket.id;
            } 
            console.log(user_socket_pairs);

            io.emit('queuestatus', queue); //refresh queue status for all clients
            io.to(socket.id).emit('queuetext', queue, is_loggedin, false); //{isExit == false} //refresh only for the 1 client
        });

        console.log(socket.id, 'connected');
        socket.join('public room');   //public room 

        online += 1;
        io.sockets.emit('online', online); //server sends to all connected websockets the updated online number

        io.to(socket.id).emit('simon-on-check', queue[0]); //send curr_player if have

        // var r = btw_range(200,255) ; var g = btw_range(200,255); var b = btw_range(200,255);


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


        //chat box messaging
        socket.on('message', (message, tempname) => {
            console.log(message);
            if (tempname === "")
                io.emit('message', `Guest${socket.id.substr(0,3)}: ${message}`);
            else
                io.emit('message', `${tempname}: ${message}`);
        });        

        // const db = new sqlite3(path.resolve('./userinfo.db')); 

        socket.on('enterqueue', (username) => {
            let isQueued = queue.includes(username);
            let is_loggedin = false;
            console.log(`isQueue: ${isQueued}`);

            if (username !== "") {
                is_loggedin = true;

                if (!isQueued) { queue.push(username); }      
                console.log(queue);         

                //start game if player is only one in queue
                if (username === queue[0] &&  simon_on === false) {
                    io.to(socket.id).emit('simon-start-server');
                    simon_on = true;
                }
                
            }
            io.emit('queuestatus', queue);
            io.to(socket.id).emit('queuetext', queue, is_loggedin, false);
        });

        socket.on('exitqueue', async (username) => {
            //IF loggedin
            if (username !== "") {
                if (queue.includes(username)) {
                    let index;           
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i] === username) {
                            index = i;
                            break;
                        }                        
                    }
                    queue.splice(index, 1); //remove from queue array
                    console.log(`Queue after exit: ${queue}`); 

                    io.emit('queuestatus', queue); //update queuestatus for all clients
                    io.to('public room').emit('queuetext', queue, true, true);
                    io.to(socket.id).emit('queuetext', queue, true, true);

                    if (index == 0) {
                        
                        //PLAYER quits, move to next in line
                        await simon_sockets.simon_end(socket, io, db);
                        console.log("SIMON FULLY END")

                        /////////////////////////////////////////////////////////////////////////////////////////
                        //next
                        let next_player = queue[0];
                        console.log(`Nextplayer: ${next_player}\n`);
                        io.to(user_socket_pairs[next_player]).emit('simon-start-server-next', next_player);

                    }
                    if (queue.length == 0)
                        simon_on = false;
                }
            }
        }
        )

        socket.on('led-multiplier', (username) => {
            let sqlselect = `SELECT score from ${username} ORDER BY ID DESC LIMIT 1`;
            let led_multiplier;
            try {
                led_multiplier = db.prepare(sqlselect).get().Score;
                console.log(`multiplier: ${led_multiplier}`);
            } catch(err) {
                led_multiplier = 1;
                console.log("Error fixed");
            }

            led_multiplier = (led_multiplier) ? led_multiplier : 1;
            
            console.log(`${username} MULTIPLIER ${led_multiplier}`);
            
            io.to(socket.id).emit('led-multiplier', led_multiplier);
        });



        socket.on('cashout', (currTicket, username) => {
            let sqlselect = `SELECT score FROM userinfo WHERE name = '${username}'`;
            let scoreobj = db.prepare(sqlselect).all();

            let sqlselect_led = `SELECT score from ${username} ORDER BY ID DESC LIMIT 1`;

            let led_multiplier;

            try {
                led_multiplier = db.prepare(sqlselect_led).get().Score;
                console.log(`multiplier: ${led_multiplier}`);
            } catch(err) {
                led_multiplier = 1;
                console.log("Error fixed");
            }

            if (led_multiplier) {
                led_update = `UPDATE ${username} SET score = 1 ORDER BY ID DESC LIMIT 1 `;      
                db.prepare(led_update).run();
            } else //if led_multiplier is null
                led_multiplier = 1;

            let newscore = scoreobj[0].score + currTicket * led_multiplier;
            console.log("HEREEEE");
            console.log(scoreobj[0].score);
            console.log(currTicket);
            console.log(led_multiplier);
            let sqlupdate = `UPDATE userinfo SET score = ${newscore} WHERE name = '${username}'`;      
            db.prepare(sqlupdate).run();
        })

        socket.on('achievement', (count, type, username) => {
            let useridobj = db.prepare(`SELECT id FROM userinfo WHERE name = '${username}'`).all();
            //possible error
            let userid = useridobj[0].id;
            if (type == 'hop') {
                switch (count) {
                    case 1:
                        db.prepare(`UPDATE userachievements SET ach1 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 50:
                        db.prepare(`UPDATE userachievements SET ach2 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 200:
                        db.prepare(`UPDATE userachievements SET ach3 = 1 WHERE id = ${userid}`).run();
                        break;
                }
            } else if (type == 'swing') {
                switch (count) {
                    case 1:
                        db.prepare(`UPDATE userachievements SET ach4 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 50:
                        db.prepare(`UPDATE userachievements SET ach5 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 200:
                        db.prepare(`UPDATE userachievements SET ach6 = 1 WHERE id = ${userid}`).run();
                        break;
                }

            } else if (type == "slide") {
                switch (count) {
                    case 1:
                        db.prepare(`UPDATE userachievements SET ach7 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 50:
                        db.prepare(`UPDATE userachievements SET ach8 = 1 WHERE id = ${userid}`).run();
                        break;
                    case 200:
                        db.prepare(`UPDATE userachievements SET ach9 = 1 WHERE id = ${userid}`).run();
                        break;
                }
            }
        })
    });
}

