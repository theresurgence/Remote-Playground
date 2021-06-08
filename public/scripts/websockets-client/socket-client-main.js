import { simon_sockets } from './simon.js';

/* Main Client Websockets Events */

var tempname = null;

export function main_sockets(document,
    socket, 
    addMultipleEventListener,
    gpio_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns, 
    chat_btn
)  {

    //Listen for events
    socket.on('online', (online_num)=>{
        online.innerHTML = `<b>Online: ${online_num}</b>`;  
    });

    socket.on('message', text => {
        const el = document.createElement('li');
        el.innerHTML = text;
        document.querySelector('ul').appendChild(el);
    });

    chat_btn.onclick = () => {
        console.log("Send");
        const text = document.querySelector('#chat-input').value;
        socket.emit('message', text, tempname);
    }

    simon_sockets(socket,
        addMultipleEventListener,
        gpio_list,
        simon_on,
        simon_speaks,
        simon_startquit_btn,
        play_btns);

}


// Front-end Temp Login, keep it disabled for now
// document.querySelector('#loginbutton').onclick = () => {

//     document.getElementById("loginbutton").value = "SIGNOUT";
//     document.getElementById("user-label").innerHTML =`Welcome, ${tempname}!`;
//     userpassbox.removeChild(inputfield); 

//     signup.href="profile.html";
// }



/* Possible Code to be added eventually */

// const socket = require('socket.io-client')
// import { io } from "socket.io-client"
// const conn = socket(host, { upgrade: false, transports: ['websocket'] })





