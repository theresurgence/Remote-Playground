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

export function simon_sockets() {

    var clicked_led = [false,false,false,false, false, false, false ,false];
    var led_keys = ["q", "w", "e", "r"];


    //Catch all accounting for both touch and mouse events to toggle the 4 gpios on or off
    //led is gpio number (0,1,2,3)
    for (let led = 0; led < 4; led++) {  

        addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], (event)=>{ 
            /* Only when simon not speaking, can user
             * toggle leds on and off */
            if (!simon_speaks && (!curr_player || curr_player === username)) {
                //gpio0_on (0,1,2,3))
                socket.emit(`gpio${led}_on`); 
                clicked_led[led] = true; 
            }

            switch(led) {
                case 0: btnpress0.play(); break;
                case 1: btnpress1.play(); break;
                case 2: btnpress2.play(); break;
                case 3: btnpress3.play(); break;
            }
            // event.preventDefault(); //prevents touchstart and mousedown events double counting!
        });

        addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], ()=>{ 
            if (!simon_speaks && (!curr_player || curr_player === username)) {
                //only triggered when button has been
                //clicked before
                if (clicked_led[led]) {
                    console.log("TURNING OFF LED");
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;

                    console.log(`SIMON _ON ${curr_player}`);

                    if (curr_player) {
                        socket.emit(`player-says`, led); 
                        console.log("SENT PLAYER INPUT")
                    } //player's input is taken into account if simon game is in progress
                }
            }
        });

        window.addEventListener("keydown", (event)=> {
            // console.log(userpassbox_focus)
            if (!simon_speaks && event.key === led_keys[led] && !isInputFocused) {
                if (!curr_player || curr_player === username) {
                    socket.emit(`gpio${led}_on`); 
                    clicked_led[0] = true; //flag
                    console.log(`Curr Player: ${curr_player}`);
                }
                // var current = document.getElementsByClassName("active_led");
                // current[i].className = current[i].className.replace(" active", "");
                if (!gpio_list[led].className.includes("active_led")) {
                    gpio_list[led].className += " active_led";
                    switch(led) {
                        case 0: btnpress0.play(); console.log("0 play"); break;
                        case 1: btnpress1.play(); console.log("1 play"); break;
                        case 2: btnpress2.play(); console.log("2 play"); break;
                        case 3: btnpress3.play(); console.log("3 play"); break;
                    }
                    // btnpress.play();
                }
            }
        }, true);

        window.addEventListener("keyup", (event)=> {
            if (!simon_speaks && event.key === led_keys[led] && !isInputFocused) {

                if (!curr_player || curr_player === username) {
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;
                }

                if (gpio_list[led].className.includes(" active_led")) {
                    gpio_list[led].className = gpio_list[led].className.replace(" active_led", "");

                    switch(led) {
                        case 0: btnpress0.pause(); btnpress0.currentTime = 0; break;
                        case 1: btnpress1.pause(); btnpress1.currentTime = 0; break;
                        case 2: btnpress2.pause(); btnpress2.currentTime = 0; break;
                        case 3: btnpress3.pause(); btnpress3.currentTime = 0; break;
                    }
                }

                if (curr_player === username) {
                    socket.emit(`player-says`, led); 
                } //player's input is taken into account if simon game is in progress

            }
            console.log(`Curr Player: ${curr_player}`);
        }, true);

    }

    socket.on('simon-on-check', (queue_0)=>{ 
        curr_player = queue_0;
        if (!curr_player || curr_player === username)
            play_btns[0].style.opacity =  1;
        else
            play_btns[0].style.opacity =  0.5;
    });

    /**server to call server, need client as middleman**/

    socket.on('simon-start-server', ()=>{ 
        curr_player = document.getElementById("user").innerHTML;
        console.log(`Player name: ${curr_player}`);
        socket.emit('simon-start', curr_player); 
        simon_on = true;   //////////////////////////////////////////////////////////////////NEEDED?????
    });

    socket.on('simon-start-server-next', (next_player)=>{ 
        socket.emit('simon-start', next_player); 
        console.log(`nextplayer is ${next_player}`);
        simon_on = true;
    });

    // socket.on('simon-end-server', ()=>{ 
    //     console.log(`Player name: ${curr_player}`);
    //     socket.emit('simon-end', curr_player); 
    //     simon_on = false;
    // });

    socket.on('exitqueue-server', ()=>{ socket.emit('exitqueue', username); });

    /**server to call server, need client as middleman**/





    socket.on('simon-is-speaking', ()=>{ simon_speaks = true });
    socket.on('simon-not-speaking', ()=>{ simon_speaks = false });

    /* events for player room and public room */

    socket.on('simon-start-public', ()=>{
        play_btns[0].style.opacity= 0.3;
        console.log("OPacity")
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

