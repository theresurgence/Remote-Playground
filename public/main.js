//************************ uncomment this below if no RPI ******************************************************/
const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
// const socket = io.connect('http://192.168.18.45:3000', {reconnect: true}); //client establishes websocket connection to server

function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}

function removeMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}

const online = document.getElementById('online'),
    gpio0 = document.getElementById('gpio0'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),

    userpassbox = document.getElementById("userpass"),
    inputfield = document.getElementById("user"),
    signup = document.getElementById("signuplink"),
    simon_startquit_btn = document.getElementById('simon-startquit');

var tempname = null;   //*************************************************

var simon_on = false; 
var simon_speaks = false;


const gpio_list = [gpio0, gpio1, gpio2, gpio3];



//Listen for events
socket.on('online', (online_num)=>{
    online.innerHTML = `<b>Online: ${online_num}</b>`;  
});

socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el);
});

document.querySelector('#chatbutton').onclick = () => {
    console.log("Send");
    const text = document.querySelector('#chat-input').value;
    tempname = document.getElementById("user").innerHTML;
    socket.emit('message', text, tempname);
}

var clicked_led = [false,false,false,false];

//Accounting for both touch and mouse events to toggle the 4 gpios on or off
//led is gpio number (0,1,2,3)
for (let led = 0; led < 4; led++) {  
    addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], ()=>{ 
        if (!simon_speaks) {
            socket.emit(`gpio${led}_on`);  //gpio0_on (0,1,2,3))
            clicked_led[led] = true;
        }
    });
    addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], ()=>{ 
        if (!simon_speaks)
            if (clicked_led[led]) {
                if (simon_on) {
                    socket.emit(`player-says`, led);
                }

                console.log("TURNING OFF LED");
                socket.emit(`gpio${led}_off`);
                clicked_led[led] = false;
            }
    });
}

socket.on('simon-is-speaking', ()=>{ simon_speaks = true });
socket.on('simon-not-speaking', ()=>{ simon_speaks = false });


simon_startquit_btn.onclick = () => { 
    if (simon_startquit_btn.value == "Start") {
        socket.emit('simon-start'); 
        simon_startquit_btn.value = "Quit";
        simon_on = true;

    } else {
        simon_on = false;
        socket.emit('simon-end'); 
        simon_startquit_btn.value = "Start";
    }
};


socket.on('simon-start-public', ()=>{
    document.getElementById('play-buttons').style.display = "none";
});

/* NEED TO ADD MORE CCODE */
socket.on('simon-start-player', ()=>{
    //////SOME CODE HERE TO TELL PLAYER THE GAME HAS STARTED
    //
});

socket.on('simon-end-public', ()=>{
    document.getElementById('play-buttons').style.display = "flex";
    simon_on = false; 
});

/* NEED TO ADD MORE CODE */
socket.on('simon-end-player', ()=>{
    simon_on = false; 
    simon_startquit_btn.value = "Start";
    console.log("CHNAGE BUTTON");
    /// GAME OVER CODE OR SMTH////
});


////
socket.on('simon-says', ()=>{
    simon_on = false; 
});




/* Possible Code to be added eventually */

// const socket = require('socket.io-client')
// import { io } from "socket.io-client"
// const conn = socket(host, { upgrade: false, transports: ['websocket'] })

