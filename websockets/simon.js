const gpio = require('../gpio-toggle'); //import gpio functions and variables

function simon_start(socket, io) {
    socket.on('simon-start', ()=> {
        socket.leave('onlookers room')
        socket.join('simon room');

        io.to('onlookers room').emit('simon-start-onlooker');
        io.to('simon room').emit('simon-start-player');

        simon_on = true;
        

        gpio.simon_start();
        io.to('simon room').emit('is-simon-speaking');



        console.log("SIMON START")
    });


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

    // var async_user_says = async function() {
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
    simon_end

}
