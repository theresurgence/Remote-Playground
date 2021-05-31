//************************ uncomment this below if no RPI ******************************************************/
const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
// const socket = io.connect('http://192.168.18.45:3000', {reconnect: true}); //client establishes websocket connection to server

const online = document.getElementById('online'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),
    gpio4 = document.getElementById('gpio4'),

    userpassbox = document.getElementById("userpass"),
    inputfield = document.getElementById("user"),
    signup = document.getElementById("signuplink"),
    simon_startquit_btn = document.getElementById('simon-startquit');

// var tempname = null;   //*************************************************


//Listen for events
socket.on('online', (online_num)=>{
    online.innerHTML = `<b>Online: ${online_num}</b>`;  
});

socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el);
});

document.querySelector('#loginbutton').onclick = () => {
    tempname = document.getElementById("user").value;
    document.getElementById("loginbutton").value = "SIGNOUT";
    document.getElementById("user-label").innerHTML =`Welcome, ${tempname}!`;
    userpassbox.removeChild(inputfield); 
    signup.innerHTML = 'PROFILE';
    signup.href="profile.html";
}

document.querySelector('#chatbutton').onclick = () => {
    const text = document.querySelector('#chat-input').value;
    socket.emit('message', text, tempname);
}



gpio1.addEventListener("mousedown", ()=>{ socket.emit('gpio1_down'); }); 
gpio1.addEventListener('mouseup', ()=>{ socket.emit('gpio1_leave'); });
gpio1.addEventListener("touchstart", ()=>{ socket.emit('gpio1_down'); }); 
gpio1.addEventListener('touchend', ()=>{ socket.emit('gpio1_leave'); });

gpio2.addEventListener('mousedown', ()=>{ socket.emit('gpio2_down'); }); 
gpio2.addEventListener('mouseup', ()=>{ socket.emit('gpio2_leave'); });
gpio2.addEventListener("touchstart", ()=>{ socket.emit('gpio2_down'); }); 
gpio2.addEventListener('touchend', ()=>{ socket.emit('gpio2_leave'); });

gpio3.addEventListener('mousedown', ()=>{ socket.emit('gpio3_down'); }); 
gpio3.addEventListener('mouseup', ()=>{ socket.emit('gpio3_leave'); });
gpio3.addEventListener("touchstart", ()=>{ socket.emit('gpio3_down'); }); 
gpio3.addEventListener('touchend', ()=>{ socket.emit('gpio3_leave'); });

gpio4.addEventListener('mousedown', ()=>{ socket.emit('gpio4_down'); }); 
gpio4.addEventListener('mouseup', ()=>{ socket.emit('gpio4_leave'); });
gpio4.addEventListener("touchstart", ()=>{ socket.emit('gpio4_down'); }); 
gpio4.addEventListener('touchend', ()=>{ socket.emit('gpio4_leave'); });

simon_startquit_btn.onclick = () => { 
    if (simon_startquit_btn.value == "Start") {
        socket.emit('simon-start'); 
        simon_startquit_btn.value = "Quit";
    } else {
        socket.emit('simon-end'); 
        simon_startquit_btn.value = "Start";
    }
};

socket.on('simon-start-onlooker', ()=>{
    document.getElementById('play-buttons').style.display = "none";
});


socket.on('simon-start-player', ()=>{
    console.log(simon_start_btn.value);
});


socket.on('simon-end-onlooker', ()=>{
    document.getElementById('play-buttons').style.display = "flex";
});

socket.on('simon-end-player', ()=>{

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

