/* Simon Says Client Websocket Events */ 


import { 
    isInputFocused, 
    btnpress, 
    btnpress0, 
    btnpress1, 
    btnpress2, 
    btnpress3, 
    addMultipleEventListener,
    gpio_list, 
    play_btns, socket, 
    isCamPublic,
} from '../main-client-script.js';

var simon_on = false;
var curr_player = ""; //flag for simon_on also
var username = document.getElementById("user").innerHTML;
var simon_speaks = false;

export { curr_player, simon_sockets };

function simon_sockets() {

    var clicked_led = [false,false,false,false, false, false, false ,false];
    var led_keys = ["q", "w", "e", "r", "q", "w", "e", "r"];


    //Catch all accounting for both touch and mouse events to toggle the 4 gpios on or off
    //led is gpio number (0,1,2,3) => Public, anyone can toggle
    //4,5,6,7 => Simon

    for (let led = 0; led < 8; led++) {  

        addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], (event)=>{ 

            //gpio0_on (0,1,2,3))
            if (led < 4) {
                if (isCamPublic) {
                    socket.emit(`gpio${led}_on`); 
                    clicked_led[led] = true; 
                }
            } else {
                /* Only when simon not speaking, can user
                 * toggle leds on and off */
                if (!isCamPublic && !simon_speaks && curr_player === username) {
                    socket.emit(`gpio${led}_on`); 
                    clicked_led[led] = true; 
                    // socket.emit('simon-clear-timeout');
                }
            }

            switch(led) {
                case 0: btnpress0.play(); break;
                case 1: btnpress1.play(); break;
                case 2: btnpress2.play(); break;
                case 3: btnpress3.play(); break;
            }
        });

        addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], async ()=>{ 
            if (led < 4) {
                if (isCamPublic && clicked_led[led]) {
                    console.log("TURNING OFF LED");
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;
                }
            }
            else {
                if (!isCamPublic && !simon_speaks && (curr_player === username)) {
                    console.log("Simon screen.... off");
                    //only triggered when button has been
                    //clicked before
                    if (clicked_led[led]) {
                        console.log(`TURNING OFF LED ${led}`);
                        socket.emit(`gpio${led}_off`);
                        clicked_led[led] = false;

                        console.log(`SIMON _ON ${curr_player}`);

                        socket.emit(`player-says`, led); 
                        console.log("SENT PLAYER INPUT")

                        // socket.emit('simon-timeout');
                    }
                }
            }
        });

        window.addEventListener("keydown", (event)=> {
            if (led < 4) {
                if (isCamPublic && event.key === led_keys[led] && !isInputFocused) {
                    socket.emit(`gpio${led}_on`); 
                    clicked_led[led] = true; //flag
                }
            }
            else {
                if (!isCamPublic && !simon_speaks && event.key === led_keys[led] && !isInputFocused) {
                    if (curr_player === username) {
                        socket.emit(`gpio${led}_on`); 
                        clicked_led[led] = true; //flag
                        console.log(`Curr Player: ${curr_player}`);
                    }
                }
            }

            if (event.key === led_keys[led] && !isInputFocused) {
                if (!gpio_list[led].className.includes("active_led")) {
                    gpio_list[led].className += " active_led";

                    switch(led) {
                        case 0: btnpress0.play(); console.log("0 click"); break;
                        case 1: btnpress1.play(); console.log("1 click"); break;
                        case 2: btnpress2.play();  console.log("2 click"); break;
                        case 3: btnpress3.play();  console.log("3 click"); break;
                        case 4: btnpress0.play(); break;
                        case 5: btnpress1.play(); break;
                        case 6: btnpress2.play(); break;
                        case 7: btnpress3.play(); break;
                    }
                }
            }
        }, true);

        window.addEventListener("keyup", async (event)=> {

            if (led < 4)  {
                if (isCamPublic && event.key === led_keys[led] && !isInputFocused) {
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;

                    if (gpio_list[led].className.includes(" active_led")) {
                        gpio_list[led].className = gpio_list[led].className.replace(" active_led", "");
                    }
                }
            }

            else {
                if (!isCamPublic && !simon_speaks && event.key === led_keys[led] && !isInputFocused) {

                    if (curr_player === username) {
                        socket.emit(`gpio${led}_off`);
                        clicked_led[led] = false;
                        socket.emit(`player-says`, led); 
                    }

                    if (gpio_list[led].className.includes(" active_led")) {
                        gpio_list[led].className = gpio_list[led].className.replace(" active_led", "");
                    }

                    console.log(`Curr Player: ${curr_player}`);
                }
            }
        }, true);

    }

    socket.on('simon-on-check', (queue_0)=>{ 
        curr_player = queue_0;
        if (!curr_player || curr_player === username)
            play_btns[0].style.opacity =  1;
        else
            if (!isCamPublic)
                play_btns[0].style.opacity =  0.5;
    });


    socket.on('simon-start-server', ()=>{ 
        curr_player = document.getElementById("user").innerHTML;
        console.log(`Player name: ${curr_player}`);
        socket.emit('simon-start', curr_player); 
        simon_on = true; 
    });

    socket.on('simon-start-server-next', (next_player)=>{ 
        socket.emit('simon-start', next_player); 
        console.log(`nextplayer is ${next_player}`);
        simon_on = true;
    });

    socket.on('exitqueue-server', ()=>{ 
        socket.emit('exitqueue', username); 
        if (username)
            socket.emit('led-multiplier', username);
    });

    socket.on('simon-is-speaking', ()=>{ simon_speaks = true });
    socket.on('simon-not-speaking', ()=>{ simon_speaks = false });

    /* events for player room and public room */

    socket.on('simon-start-public', ()=>{
        if (!isCamPublic)
            play_btns[0].style.opacity= 0.3;
    });

    /* NEED TO ADD MORE CCODE */
    socket.on('simon-start-player', ()=>{
        //////SOME CODE HERE TO TELL PLAYER THE GAME HAS STARTED
        simon_on = true;
        console.log("simon_start_plaeyr")
    });

    socket.on('simon-end-public', ()=>{ simon_on = false; });
    socket.on('simon-end-player', ()=>{ simon_on = false; });

}

