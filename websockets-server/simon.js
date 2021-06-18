const gpio = require('../gpio-toggle'); //import gpio functions and variables
const simon_info  = gpio.simon_info;

var curr_score = 0;

module.exports = {
    simon_start,
    player_says,
    socket_simon_end,
} 

async function simon_start(socket, io) {
    socket.on('simon-start', ()=> {
        io.sockets.emit('curr_score', curr_score); 

        socket.leave('public room');
        socket.join('simon room');

        io.to('public room').emit('simon-start-public');
        io.to('simon room').emit('simon-start-player');

        simon_on = true;

        console.log("SIMON SAYS STARTS")

        simon_says(socket, io);  //simon will start blinking
    });

}

async function simon_says(socket, io, curr_score) {
    io.to('simon room').emit('simon-is-speaking');  //to true
    await gpio.simon_blinks();

    io.to('simon room').emit('simon-not-speaking');  //to false


    gpio.index_reset(); //reset hist_index
    console.log('Player can speak');
}

function player_says(socket, io) {
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
                io.sockets.emit('curr_score', curr_score); 
                await simon_says(socket, io, curr_score);
            }
        }

        else{  //player is wrong

            simon_end(socket,io);
            console.log("FAIL***************************");
            curr_score = 0;
        } 

        console.log();
    });
}


function simon_end(socket, io) {
        
    simon_on = false;
    socket.emit('simon-end-player');
    socket.emit('simon-end-public');

    socket.leave('simon room');
    socket.join('public room');

    gpio.hist_reset();

    console.log("SIMON END")
}


function socket_simon_end(socket, io) {
    socket.on('simon-end', ()=> {
        simon_end(socket,io);
    });
}
