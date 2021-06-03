//************************ uncomment this below if no RPI ******************************************************/
// const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
const socket = io.connect('http://192.168.18.45:3000', {reconnect: true}); //client establishes websocket connection to server

const online = document.getElementById('online'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),
    gpio4 = document.getElementById('gpio4'),

    userpassbox = document.getElementById("userpass"),
    inputfield = document.getElementById("user"),
    signup = document.getElementById("signuplink"),
    simon_startquit_btn = document.getElementById('simon-startquit');

var tempname = null;   //*************************************************

const gpio_list = [gpio1, gpio2, gpio3, gpio4];





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


function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}

function removeMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}

//Accounting for both touch and mouse events to toggle the 4 gpios on or off
for (let i = 0; i < 4; i++) {
    addMultipleEventListener(gpio_list[i], ["mousedown", "touchstart"], ()=>{ socket.emit(`gpio${i + 1}_on`);});
    addMultipleEventListener(gpio_list[i], ["mouseup", "touchend", "mouseleave"], ()=>{ socket.emit(`gpio${i + 1}_off`);});
    console.log(`gpio${i + 1}_on`);
}

// function simon_start_setup() {
//     for (let i = 0; i < 4; i++) {
//         addMultipleEventListener(gpio_list[i], ["mousedown", "touchstart"], ()=>{ 
//             socket.emit(`gpio${i + 1}_on`);
//         });
//         addMultipleEventListener(gpio_list[i], ["mouseup", "touchend", "mouseleave"], ()=>{ 
//             socket.emit(`gpio${i + 1}_off`);
//         });
//     }
// }




simon_startquit_btn.onclick = () => { 
    if (simon_startquit_btn.value == "Start") {
        socket.emit('simon-start'); 
        simon_startquit_btn.value = "Quit";
    } else {
        socket.emit('simon-end'); 
        simon_startquit_btn.value = "Start";
    }
};

var simon_on = false; 

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

