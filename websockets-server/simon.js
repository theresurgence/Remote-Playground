const gpio = require('../gpio-toggle'); //import gpio functions and variables
const { queue } = require('./main-sockets');
const simon_info  = gpio.simon_info;

var curr_score = 0;

var PLAYER_NAME = '';


module.exports = {
    simon_start,
    player_says,
    socket_simon_end,
} 

async function simon_start(socket, io, db) {
    socket.on('simon-start', async (player_name)=> {

        PLAYER_NAME = player_name.trim();

        console.log(player_name);

        // db.prepare(`INSERT INTO ${player_name} (Start) VALUES (DateTime('now'))`).run();

        io.sockets.emit('curr-score', curr_score); 

        socket.leave('public room');
        socket.join('simon room');


        io.to('public room').emit('simon-on-check', queue[0]); //send curr_player if have
        io.to('public room').emit('simon-start-public');
        io.to('simon room').emit('simon-start-player');
        
        simon_on = true;
        // await gpio.start_signal();

        console.log("SIMON SAYS STARTS")

        simon_says(socket, io);  //simon will start blinking
    });

}

async function simon_says(socket, io) {
    // io.to('simon room').emit('simon-is-speaking');  //to true
    io.emit('simon-is-speaking');  //to true
    await gpio.simon_blinks();

    io.emit('simon-not-speaking');  //to false

    gpio.index_reset(); //reset hist_index
    console.log('Player can speak');
}

function player_says(socket, io, db) {

    socket.on('player-says', async (player_led)=> {
        var hist = simon_info.hist;
        var hist_len = simon_info.hist.length;
        var index = simon_info.index;

        console.log(`History List: ${hist}`)
        console.log(`User says: ${player_led}   Simon says: ${hist[index]}`);
        console.log(`Index: ${index}  Hist_len = ${hist_len}`);

        // if (player_led == hist[gpio.hist_index]) { //correct
        if (player_led == hist[simon_info.index]) { //correct
            console.log('this led is correct')

            console.log(`Index: ${simon_info.index}  Hist_len = ${hist_len}`);
            gpio.index_add();

            if (simon_info.index == hist_len) {  //all correct
                console.log('All Correct');

                curr_score += 1;
                console.log(`\nCurr Score: ${curr_score}\n`);
                io.sockets.emit('curr-score', curr_score); 
                await simon_says(socket, io);
            }
        }

        else{  //player is wrong

            console.log("FAIL***************************");
            console.log(PLAYER_NAME);

            simon_end(socket,io, db);
        } 

        console.log();
    });
}


function simon_end(socket, io, db) {

    socket.emit('simon-end-player');
    io.to('public room').emit('simon-end-public');

    socket.leave('simon room');
    socket.join('public room');
    io.to('public room').emit('simon-on-check', queue[0]); //send curr_player if have

    gpio.hist_reset();

    console.log(`PLAYER NAME HERE: ${PLAYER_NAME}`);
    console.log(`DATABASE: ${db}`);

    // let latest_Start = db.prepare(`SELECT Start FROM ${PLAYER_NAME} ORDER BY ID DESC LIMIT 1`).get();
    // db.prepare(`UPDATE ${PLAYER_NAME} SET END=DateTime('now'), Score='${curr_score}' WHERE Start='${latest_Start.Start}'`).run();


    // let hiscore = db.prepare(`SELECT Score FROM userinfo WHERE name='${PLAYER_NAME}'`).get().score;
    // console.log(hiscore)

    // if (hiscore < curr_score) {
        // db.prepare(`UPDATE userinfo SET Score='${curr_score}' WHERE name='${PLAYER_NAME}'`).run();
    // }
    
    // console.log(latest_Start.Start)

    console.log("update db with End time and Score");

    console.log("SIMON END")
    curr_score = 0;

    io.emit('simon-on-check', queue[0]);
    io.to(socket.id).emit('exitqueue-server');
}


function socket_simon_end(socket, io, db) {
    socket.on('simon-end', (player_name) => { 
        console.log(`PLAYER_NAME: ${PLAYER_NAME}`)

        if (player_name === PLAYER_NAME)
            console.log("socket ends simon")
            simon_end(socket,io, db); });
}
