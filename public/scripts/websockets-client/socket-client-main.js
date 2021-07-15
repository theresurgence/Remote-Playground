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
    cashout_btn,
    ticketcount
)  {

    //Listen for events
    socket.on('curr_score', (score)=>{
        curr_score.innerHTML = `<b>Score: ${score}</b>`;  
        console.log("CHANGE SCORE");
    });

    socket.on('online', (online_num)=>{
        online.innerHTML = `<b>Online: ${online_num}</b>`;  
    });

    socket.on('message', (text) => {
        const el = document.createElement('li');
        var textbox = document.getElementById('text-box');
        el.innerHTML = text;
        // el.style.color = `rgb(${r}, ${g}, ${b})`;
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

    //temp resource for idle game
    var tickets = 0;
    var i = 0;
    var isMoveHop = false, isMoveSwing = false, isMoveSlide = false;
    const idlebtn1 = document.getElementById('idlebutton1'),
    idlebtn2 = document.getElementById('idlebutton2'),
    idlebtn3 = document.getElementById('idlebutton3'),
    bar1 = document.getElementById("bar1"),
    bar2 = document.getElementById("bar2"),
    bar3 = document.getElementById("bar3"),
    btnpress = document.getElementById('btnsound'),
    bling = document.getElementById('blingsound')


    cashout_btn.onclick = () => {
        bling.play();
        console.log("test");
        console.log("bling bling");
        let text = ticketcount.innerHTML;
        let regex = /[0-9]+/;
        var array = text.match(regex);
        const currTickets = parseInt(array[0]);
        socket.emit('cashout', currTickets, username);     
        tickets = 0;
        ticketcount.innerHTML = `Tickets: ${tickets}`;  
    }
    
    idlebtn1.onclick = () => {
        btnpress.play();
        move(bar1);    
    }

    idlebtn2.onclick = () => {
        btnpress.play();
        move(bar2);
    }

    idlebtn3.onclick = () => {
        btnpress.play(); 
        move(bar3);
    }

    //Idle Progress Bar
   
    
    function move(progbar) {
        
        var width = 0;

        if (progbar == bar1) {
        if (!isMoveHop) {
        isMoveHop = true;
        var id = setInterval(frame, 10); //run frame every 10ms
        } else return;
        }

        else if (progbar == bar2) {
        if (!isMoveSwing) {
            isMoveSwing = true;
            var id = setInterval(frame, 30); //run frame every 30ms
        } else return;
        }

        else if (progbar == bar3) {
        if (!isMoveSlide) {
            isMoveSlide = true;
            var id = setInterval(frame, 50); //run frame every 50ms
        } else return;        
        }
    
        function frame() {
        if (width >= 100) {
            if (progbar == bar1) {
            tickets += 1; isMoveHop = false;
            }       

            else if (progbar == bar2) {
            tickets += 5; isMoveSwing = false;
            }
            
            else if (progbar == bar3) {
            tickets += 50; isMoveSlide = false;
            } 
            
            ticketcount.innerHTML = `Tickets: ${tickets}`;    
            clearInterval(id);
            i = 0;
            
            progbar.style.width = 0 + "%";
        
            return true;
        } else {
            width++;
            progbar.style.width = width + "%";
            return false;
        }
        }
    
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





