/* Simon Says Client Websocket Events */ 

import { input_focus, btnpress } from '../main-client-script.js';

export function simon_sockets(window, document, socket, 
    addMultipleEventListener,
    gpio_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns,
) {


    var clicked_led = [false,false,false,false];
    var led_keys = ["q", "w", "e", "r"];



    console.log(play_btns)
    console.log(play_btns[0])

    //Catch all accounting for both touch and mouse events to toggle the 4 gpios on or off
    //led is gpio number (0,1,2,3)
    for (let led = 0; led < 4; led++) {  

        addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], (event)=>{ 

            /* Only when simon not speaking, can user
             * toggle leds on and off */
            if (!simon_speaks) {

                //gpio0_on (0,1,2,3))
                socket.emit(`gpio${led}_on`); 
                clicked_led[led] = true; //flag
                console.log("DOWN!");
                btnpress.play();
                // event.preventDefault(); //prevents touchstart and mousedown events double counting!
            }
        });

        addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], ()=>{ 

            if (!simon_speaks) {

                //only triggered when button has been
                //clicked before
                if (clicked_led[led]) {
                    console.log("TURNING OFF LED");
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;

                    console.log(`SIMON _ON ${simon_on}`);

                    if (simon_on) {
                        socket.emit(`player-says`, led); 
                        console.log("SENT PLAYER INPUT")
                    } //player's input is taken into account if simon game is in progress
                }
            }
        });

        window.addEventListener("keydown", (event)=> {
            // console.log(userpassbox_focus)
            if (!simon_speaks && event.key === led_keys[led] && !input_focus) {
                socket.emit(`gpio${led}_on`); 
                clicked_led[0] = true; //flag
                // var current = document.getElementsByClassName("active_led");
                // current[i].className = current[i].className.replace(" active", "");
                if (!gpio_list[led].className.includes("active_led")) {
                    gpio_list[led].className += " active_led";
                    btnpress.play();
                }
                console.log(gpio_list[led].className);
            }

        }, true);

        window.addEventListener("keyup", (event)=> {
            if (!simon_speaks && event.key === led_keys[led] && !input_focus) {
            // if (!simon_speaks && event.key === led_keys[led] && !userpassbox_focus) {
                socket.emit(`gpio${led}_on`); 
                console.log("TURNING OFF LED");
                socket.emit(`gpio${led}_off`);
                clicked_led[led] = false;

                console.log(`SIMON _ON ${simon_on}`);

                if (gpio_list[led].className.includes(" active_led"))
                    gpio_list[led].className = gpio_list[led].className.replace(" active_led", "");

                if (simon_on) {
                    socket.emit(`player-says`, led); 
                    console.log("SENT PLAYER INPUT")
                } //player's input is taken into account if simon game is in progress
            }
        }, true);

    }


    /**server to call server, need client as middleman**/

    socket.on('simon-start-server', ()=>{ 
        let player_name = document.getElementById("user").innerHTML;
        console.log(`Player name: ${player_name}`);
        socket.emit('simon-start', player_name); 
        simon_on = true;
    });

    socket.on('simon-start-server-next', (next_player)=>{ 
        socket.emit('simon-start', next_player); 
        console.log(`nexplayer is ${next_player}`);
        simon_on = true;
    });

    socket.on('simon-end-server', ()=>{ 
        let player_name = document.getElementById("user").innerHTML;
        console.log(`Player name: ${player_name}`);
        socket.emit('simon-end', player_name); 
        simon_on = false;
    });

    socket.on('exitqueue-server', ()=>{ 
        let username = document.getElementById("user").innerHTML;
        socket.emit('exitqueue', username);
    });

    /**server to call server, need client as middleman**/





    socket.on('simon-is-speaking', ()=>{ simon_speaks = true });
    socket.on('simon-not-speaking', ()=>{ simon_speaks = false });

    /* events for player room and public room */

    socket.on('simon-start-public', ()=>{
        play_btns[0].style.display = "none";
        console.log("disappear")
    });

    /* NEED TO ADD MORE CCODE */
    socket.on('simon-start-player', ()=>{
        //////SOME CODE HERE TO TELL PLAYER THE GAME HAS STARTED
        simon_on = true;
        console.log("simon_start_plaeyr")
    });

    socket.on('simon-end-public', ()=>{
        play_btns[0].style.display = "flex";
        simon_on = false; 
        console.log("appear")
    });

    /* NEED TO ADD MORE CODE */
    socket.on('simon-end-player', ()=>{
        simon_on = false; 
        simon_startquit_btn.value = "Start";
        // alert("Game Over");
        console.log("CHNAGE BUTTON");
        /// GAME OVER CODE OR SMTH////
    });

}
    //simon_startquit_btn.onclick = () => { 
    //    let player_name = document.getElementById("user").innerHTML;
    //    console.log(`Player name: ${player_name}`);

    //    //To start game
    //    if (simon_startquit_btn.value == "Start") {

    //        socket.emit('simon-start', player_name); 

    //        simon_startquit_btn.value = "Quit";
    //        simon_on = true;

    //    //To quit a game in progress 
    //    } else {
    //        simon_on = false;
    //        socket.emit('simon-end', player_name); 
    //        simon_startquit_btn.value = "Start";
    //    }
    //};

