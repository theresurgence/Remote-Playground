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

    socket.on('message', (text, r, g, b) => {
        const el = document.createElement('li');
        el.innerHTML = text;
        el.style.color = `rgb(${r}, ${g}, ${b})`;
        document.querySelector('ul').appendChild(el);
    });

    chat_btn.onclick = () => {
        console.log("Send");
        const text = document.querySelector('#chat-input').value;
        tempname = document.getElementById("user").innerHTML;
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


/* Possible Code to be added eventually */

// const socket = require('socket.io-client')
// import { io } from "socket.io-client"
// const conn = socket(host, { upgrade: false, transports: ['websocket'] })





