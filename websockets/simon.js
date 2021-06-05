const gpio = require('../gpio-toggle'); //import gpio functions and variables

async function simon_start(socket, io) {
    socket.on('simon-start', ()=> {
        socket.leave('onlookers room')
        socket.join('simon room');

        io.to('onlookers room').emit('simon-start-onlooker');
        io.to('simon room').emit('simon-start-player');

        simon_on = true;
        console.log("SIMON SAYS STARTS")

        simon_says(socket,io);
    });

}

async function simon_says(socket, io) {
    io.to('simon room').emit('toggle-simon-speaking');
    await gpio.simon_blinks();

    user_says_init(socket, io);

    io.to('simon room').emit('toggle-simon-speaking');
    //user can start speaking
}

function user_says_init(socket, io) {
    socket.on('user-says-init', ()=> {
        hist = gpio.simon_history;
        hist_len = gpio.simon_history.length;
        hist_i = 0;
        console.log('user speaks init');
        console.log(hist);
    });
}
function user_says(socket, io) {
    socket.on('user-says', async (user_led)=> {
        hist = gpio.simon_history;
        hist_len = gpio.simon_history.length;

        console.log(`History List: ${hist}`)
        console.log(`User says: ${user_led}   Hist: ${hist[hist_i]}`);
        console.log(`Index: ${hist_i}  Hist_len = ${hist_len}`);

        if (user_led == hist[hist_i]) { //correct
            hist_i++;
            if (hist_i == hist_len) {  //all correct
                // io.sockets.emit('simon_correct');
                console.log('simon pass');
                await gpio.simon_start();
                io.to('simon room').emit('toggle-simon-speaking');
            }
        }
        else{
            console.log("FAIL***************************8");
            // gpio.simon_end();
        } //wrong answer

        console.log();
    });
}



function simon_end(socket, io) {
    socket.on('simon-end', ()=> {
        simon_on = false;
        gpio.simon_end();
        socket.leave('simon room')
        socket.join('onlookers room');

        io.to('onlookers room').emit('simon-end-onlooker');
        console.log("SIMON END")
    });
}


module.exports = {
    simon_start,
    user_says_init,
    user_says,
    simon_end

}



    // async_user_says(socket);

    // socket.on('user-says', (user_says)=> {
    //     hist = gpio.simon_history;
    //     hist_len = gpio.simon_history.length;

    //     console.log(`History List: ${hist}`)
    //     console.log(`User says: ${user_says}   Hist: ${hist[hist_i]}`);
    //     console.log(`Index: ${hist_i}  Hist_len = ${hist_len}`);

    //     if (user_says == hist[hist_i]) { //correct
    //         hist_i++;
    //         if (hist_i == hist_len) {  //all correct
    //             // io.sockets.emit('simon_correct');
    //             console.log('simon pass');
    //             await gpio.simon_start();
    //             io.to('simon room').emit('is-simon-speaking');
    //         }
    //     }
    //     else{
    //         console.log("FAIL***************************8");
    //         // gpio.simon_end();
    //     } //wrong answer
            
    //     console.log();
        
    // });
