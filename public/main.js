//************************ uncomment this below if no RPI ******************************************************/
// const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
const socket = io.connect('http://192.168.18.45:3000', {reconnect: true}); //client establishes websocket connection to server

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
var simon_says = false;

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

// Front-end Temp Login, keep it disabled for now
// document.querySelector('#loginbutton').onclick = () => {
//     tempname = document.getElementById("user").value;
//     document.getElementById("loginbutton").value = "SIGNOUT";
//     document.getElementById("user-label").innerHTML =`Welcome, ${tempname}!`;
//     userpassbox.removeChild(inputfield); 
//     signup.innerHTML = 'PROFILE';
//     signup.href="profile.html";
// }

document.querySelector('#chatbutton').onclick = () => {
    console.log("Send");
    const text = document.querySelector('#chat-input').value;
    socket.emit('message', text, tempname);
}


//Accounting for both touch and mouse events to toggle the 4 gpios on or off
//led is gpio number (0,1,2,3)
for (let led = 0; led < 4; led++) {  
    addMultipleEventListener(gpio_list[led], ["mousedown", "touchstart"], ()=>{ 
        if (!simon_says)
            socket.emit(`gpio${led}_on`);  //gpio0_on (0,1,2,3)
        if (simon_on) {
            user_says = led;
            socket.emit(`user-says`, user_says);
        }
    });
    addMultipleEventListener(gpio_list[led], ["mouseup", "touchend", "mouseleave"], ()=>{ 
        if (!simon_says)
            socket.emit(`gpio${led}_off`);
    });
}



simon_startquit_btn.onclick = () => { 
    if (simon_startquit_btn.value == "Start") {
        socket.emit('simon-start'); 
        simon_startquit_btn.value = "Quit";
        simon_on = true;

    } else {
        socket.emit('simon-end'); 
        simon_startquit_btn.value = "Start";
        simon_on = false;
    }
};


socket.on('simon-end-all', ()=>{
    simon_end_setup();



});

socket.on('simon-start-all', ()=>{
    simon_start_setup();


});


socket.on('simon-start-onlooker', ()=>{
    document.getElementById('play-buttons').style.display = "none";
    simon_on = true; 
});


socket.on('simon-start-player', ()=>{
    console.log(simon_start_btn.value);
    simon_on = true; 
});


socket.on('simon-end-onlooker', ()=>{
    document.getElementById('play-buttons').style.display = "flex";
    simon_on = false; 
});

socket.on('simon-end-player', ()=>{

    simon_on = false; 
});





/* Possible Code to be added eventually */

// const socket = require('socket.io-client')
// import { io } from "socket.io-client"
// const conn = socket(host, { upgrade: false, transports: ['websocket'] })

// socket.on('gpio1_click', (gpio1_status)=>{
//     gpio1.checked = (gpio1_status) ? true : false;
// });

// socket.on('gpio2_click', (gpio2_status)=>{
//     gpio2.checked = (gpio2_status) ? true : false;
// });
// socket.on('gpio3_click', (gpio3_status)=>{
//     gpio3.checked = (gpio3_status) ? true : false;
// });

// socket.on('gpio4_click', (gpio4_status)=>{
//     gpio4.checked = (gpio4_status) ? true : false;
// });

