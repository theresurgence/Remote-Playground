import { simon_sockets } from './simon.js';

/* Main Client Websockets Events */

export function main_sockets(window, document,
    socket, 
    addMultipleEventListener,
    gpio_list,
    box_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns, 
    chat_btn,
    curr_score,
    queue_btn,
    exit_btn,
    inputfield,
    username, 

)  {

    //Listen for events
    socket.on('curr_score', (score)=>{
        curr_score.innerHTML = `<b>Score: ${score}</b>`;  
        console.log("CHANGE SCORE");
    });

    socket.on('online', (online_num)=>{
        online.innerHTML = `<b>Online: ${online_num}</b>`;  
    });

    socket.on('message', (text, r, g, b) => {
        const el = document.createElement('li');
        var textbox = document.getElementById('text-box');
        el.innerHTML = text;
        el.style.color = `rgb(${r}, ${g}, ${b})`;
        textbox.querySelector('ul').appendChild(el);
    });

    socket.on('leaderboard', (entry) => {
        const ent = document.createElement('li');
        var leaderbox = document.getElementById('leader-box');
        ent.innerHTML = entry;
        leaderbox.querySelector('ul').appendChild(ent);
    });


    socket.on('check-register', ()=>{
        socket.emit('receive-register', username);
    });




    socket.on('queuestatus', (queue) => {
        let queue_no = undefined;
        console.log(`Queue Num: ${queue_no}`);
        for (let i = 0; i < queue.length; i++) {
            if (queue[i] == username) {
                queue_no = i;
                console.log('test');
                console.log(queue_no);
                break;
            }
        }
        //Display queue visually
        for (let i = 0; i < 5; i++) {
            if (queue[i] !== undefined)
                box_list[i].innerHTML = queue[i];
            else
                box_list[i].innerHTML = "";
        }

        ////find username in the queue, then return the number
        //if (!isRegistered) {
        //    queuetext.innerHTML = `<b>Please login to play</b>`;
        //    // alert('Please login to play');
        //} 

        //else {
        //    if (queue_no === undefined)
        //        queuetext.innerHTML = `<b>Queue Number: Not in Queue</b>`;
        //    else if (queue_no === 0)
        //        queuetext.innerHTML = `<b>Queue Number: Your turn to play!</b>`;
        //    else
        //        queuetext.innerHTML = `<b>Queue Number: ${queue_no}</b>`;
        //}      
    });

    socket.on('queuetext', (queue, isRegistered, isExit) => {
        let queue_no = undefined;
        console.log(`Queue Num: ${queue_no}`);
        for (let i = 0; i < queue.length; i++) {
            if (queue[i] == username) {
                queue_no = i;
                console.log('test');
                console.log(queue_no);
                break;
            }
        }

        //find username in the queue, then return the number
        if (!isRegistered) {
            if (!isExit)
                queuetext.innerHTML = `<b>Please login to play</b>`;
        } 

        else {
            if (queue_no === undefined)
                queuetext.innerHTML = `<b>Queue Number: Not in Queue</b>`;
            else if (queue_no === 0)
                queuetext.innerHTML = `<b>Queue Number: Your turn to play!</b>`;
            else
                queuetext.innerHTML = `<b>Queue Number: ${queue_no}</b>`;
        }      
    });

    queue_btn.onclick = () => {
        console.log("Queue");
        socket.emit('enterqueue', username);
    }

    exit_btn.onclick = () => {
        console.log("Exit");
        socket.emit('exitqueue', username);
    }

    chat_btn.onclick = () => {
        console.log("Send");
        const text = inputfield.value;
        inputfield.value = "";
        socket.emit('message', text, username);
    }

    simon_sockets(window, document, socket,
        addMultipleEventListener,
        gpio_list,
        simon_on,
        simon_speaks,
        simon_startquit_btn,
        play_btns,
    );

}


/* Possible Code to be added eventually */

// const socket = require('socket.io-client')
// import { io } from "socket.io-client"
// const conn = socket(host, { upgrade: false, transports: ['websocket'] })





