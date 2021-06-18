/* Simon Says Client Websocket Events */ 

var clicked_led = [false,false,false,false];

export function simon_sockets(socket, 
    addMultipleEventListener,
    gpio_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns,
) {

    //Catch all accounting for both touch and mouse events to toggle the 4 gpios on or off
    //led is gpio number (0,1,2,3)
    for (let led = 0; led < 4; led++) {  

        addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], (event)=>{ 
        // addMultipleEventListener(gpio_list[led], ["mousedown"], ()=>{ 
        // addMultipleEventListener(gpio_list[led], ["touchstart"], ()=>{ 

            /* Only when simon not speaking, can user
             * toggle leds on and off */
            if (!simon_speaks) {

                //gpio0_on (0,1,2,3))
                socket.emit(`gpio${led}_on`); 
                clicked_led[led] = true; //flag
                console.log("DOWN!");
                event.preventDefault(); //prevents touchstart and mousedown events double counting!
            }
        });

        // addMultipleEventListener(gpio_list[led], ["touchend"], ()=>{ 
        addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], ()=>{ 
        // addMultipleEventListener(gpio_list[led], ["mouseup", "mouseleave"], ()=>{ 

            if (!simon_speaks) {

                //only triggered when button has been
                //clicked before
                if (clicked_led[led]) {
                    console.log("TURNING OFF LED");
                    socket.emit(`gpio${led}_off`);
                    clicked_led[led] = false;

                    if (simon_on) {socket.emit(`player-says`, led); } //player's input is taken into account if simon game is in progress
                }
            }
        });
    }


    socket.on('simon-is-speaking', ()=>{ simon_speaks = true });
    socket.on('simon-not-speaking', ()=>{ simon_speaks = false });

    simon_startquit_btn.onclick = () => { 
        //To start game
        if (simon_startquit_btn.value == "Start") {
            socket.emit('simon-start'); 
            simon_startquit_btn.value = "Quit";
            simon_on = true;

        //To quit a game in progress 
        } else {
            simon_on = false;
            socket.emit('simon-end'); 
            simon_startquit_btn.value = "Start";
        }
    };

    /* events for player room and public room */

    socket.on('simon-start-public', ()=>{
        play_btns.style.display = "none";
    });

    /* NEED TO ADD MORE CCODE */
    socket.on('simon-start-player', ()=>{
        //////SOME CODE HERE TO TELL PLAYER THE GAME HAS STARTED
        //
    });

    socket.on('simon-end-public', ()=>{
        play_btns.style.display = "flex";
        simon_on = false; 
    });

    /* NEED TO ADD MORE CODE */
    socket.on('simon-end-player', ()=>{
        simon_on = false; 
        simon_startquit_btn.value = "Start";
        console.log("CHNAGE BUTTON");
        /// GAME OVER CODE OR SMTH////
    });

}
