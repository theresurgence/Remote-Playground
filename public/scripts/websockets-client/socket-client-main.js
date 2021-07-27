import { simon_sockets } from './simon.js';

import { 
    isCamPublic,
    btn_pubsimon,
    toggle_flag,
} from '../main-client-script.js';

// import {queue} from '../../../websockets-server/main-sockets.js';

/* Main Client Websockets Events */

export function main_sockets(
    document,
    socket, 
    box_list,
    chat_btn,
    curr_score,
    queue_btn,
    exit_btn,
    inputfield,
    username, 
    cashout_btn,
    ticketcount,
    multiplier,
)  {

    if (username)
        socket.emit('led-multiplier', username);

    socket.on('led-multiplier', (led_multiplier) => {
        multiplier.innerHTML = `Simon Says Multiplier: x${led_multiplier}`;
    });

    //Listen for events
    socket.on('curr-score', (score)=>{
        curr_score.innerHTML = `<b>Multiplier: ${score}</b>`;  
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


    socket.on('check-login', ()=>{ socket.emit('checked-login', username); });

    socket.on('queuestatus', (queue) => {
        let queue_no = undefined;
        for (let i = 0; i < queue.length; i++) {
            if (queue[i] === username) {
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
    });

    //Notification Message regarding player's queue status
    socket.on('queuetext', (queue, isRegistered, isExit) => {
        let queue_no = undefined;
        console.log(`Queue Num: ${queue_no}`);
        for (let i = 0; i < queue.length; i++) {
            if (queue[i] == username) {
                queue_no = i;
                break;
            }
        }
        //find username in the queue, then return the number
        if (!isRegistered) {
            if (!isExit) queuetext.innerHTML = `<b>Please login to play</b>`;
        } 

        else {
            if (queue_no === undefined)
                queuetext.innerHTML = `<b>Not in Queue</b>`;
            else if (queue_no === 0)
                queuetext.innerHTML = `<b>Your turn to play!</b>`;
            else
                queuetext.innerHTML = `<b>Queue Number: ${queue_no}</b>`;
        }      
    });

    queue_btn.onclick = () =>  { 
        socket.emit('enterqueue', username);
        if (username && isCamPublic) {
            btn_pubsimon.click(); //switch to Playground view 
            console.log(`isCamPublic: ${isCamPublic}`);
            toggle_flag(isCamPublic);
            console.log(`isCamPublic: ${isCamPublic}`);
        }
    }

    exit_btn.onclick = () =>  socket.emit('exitqueue', username); 

    //Send message to chat
    chat_btn.onclick = () => {
        console.log("Send");
        const text = inputfield.value;
        inputfield.value = "";
        socket.emit('message', text, username);
    }

    //Notification Test
    function notification(count, type) {
        console.log('yo' + count + type);
        console.log(achievements);
        if (type == 'hop') {
            if (count == 1 && achievements.ach1 != 1) {
                alertify.notify("Get Hoppin' (Unlock Hopscotch)", 'success', 3);  
            } else if (count == 50 && achievements.ach2 != 1) {
                alertify.notify("Hop 50 (Own 50 Hopscotches)", 'success', 3);
            } else if (count == 200 && achievements.ach3 != 1) {
                alertify.notify("Thunder Calf (Own 200 Hopscotches)", 'success', 3);
            } 
            socket.emit('achievement', count, 'hop', username);
        } else if (type == 'swing') {
            if (count == 1 && achievements.ach4 != 1) {
                alertify.notify("Swing and a Hit (Unlock Swing)", 'success', 3);  
            } else if (count == 50 && achievements.ach5 != 1) {
                alertify.notify("Swing 50 (Own 50 Swings)", 'success', 3);
            } else if (count == 200 && achievements.ach6 != 1) {
                alertify.notify("The Pendulum (Own 200 Swings)", 'success', 3);
            } 
            socket.emit('achievement', count, 'swing', username);
        } else if (type == 'slide') {
            if (count == 1 && achievements.ach7 != 1) {
                alertify.notify("Slip n Slide (Unlock Slide)", 'success', 3);  
            } else if (count == 50 && achievements.ach8 != 1) {
                alertify.notify("Slide 50 (Own 50 Slides)", 'success', 3);
            } else if (count == 200 && achievements.ach9 != 1) {
                alertify.notify("Mr Smooth (Own 200 Slides)", 'success', 3);
            } 
            socket.emit('achievement', count, 'slide', username);
        }
        
    }    
    //test test 
    // testbtn = document.getElementById("testbutton");
    // testbtn.onclick = () => {
    //     alertify.message("alert test");
    // }

    // Variables/Objects for idle game
    const achievementsJson = document.getElementById("achievements").innerHTML;
    var achievements;
    if (username !== "")
        achievements = JSON.parse(achievementsJson);

    console.log(achievements);


    var tickets = 0, hopResCount = 0, swingResCount = 0, slideResCount = 0, prestigeMultiplier = 1;
    const hopStartCost = 4, swingStartCost = 60, slideStartCost = 8640;
    const hopBaseIncome = 1.67, swingBaseIncome = 60, slideBaseIncome = 4320;
    const hopBaseMultiplier = 1.07, swingBaseMultiplier = 1.15,  slideBaseMultiplier = 1.13;
    var i = 0;
    var isMoveHop = false, isMoveSwing = false, isMoveSlide = false;
    const idlebtn1 = document.getElementById('idlebutton1'),
    idlebtn2 = document.getElementById('idlebutton2'),
    idlebtn3 = document.getElementById('idlebutton3'),
    bar1 = document.getElementById("bar1"),
    bar2 = document.getElementById("bar2"),
    bar3 = document.getElementById("bar3"),
    addbtn1 = document.getElementById("addbutton1"),
    addbtn2 = document.getElementById("addbutton2"),
    addbtn3 = document.getElementById("addbutton3"),
    btnpress = document.getElementById('btnsound'),
    bling = document.getElementById('blingsound'),
    rescount1 = document.getElementById("res-display-1"),
    rescount2 = document.getElementById("res-display-2"),
    rescount3 = document.getElementById("res-display-3"),
    cost1 = document.getElementById("cost1"),
    cost2 = document.getElementById("cost2"),
    cost3 = document.getElementById("cost3"),
    income1 = document.getElementById("income1"),
    income2 = document.getElementById("income2"),
    income3 = document.getElementById("income3")
    

    // expand.onclick = () => {
    //     tickets = 0;
    //     prestigeMultiplier *= 5;
    //     ticketcount.innerHTML = `Tickets: ${tickets}`;  
    //     hopResCount = 0; swingResCount = 0; slideResCount = 0;
    //     rescount1.innerHTML = `${hopResCount}`; cost1.innerHTML = "0";
    //     income1.innerHTML = `${twoDp(hopBaseIncome * hopResCount * prestigeMultiplier)}`;
    //     rescount2.innerHTML = `${swingResCount}`; cost2.innerHTML = `${swingNextCost}`;
    //     income2.innerHTML = `${twoDp(swingBaseIncome * swingResCount * prestigeMultiplier)}`;
    //     rescount3.innerHTML = `${slideResCount}`; cost3.innerHTML = `${slideNextCost}`;
    //     income3.innerHTML = `${twoDp(slideBaseIncome * slideResCount * prestigeMultiplier)}`;
    // }

    cashout_btn.onclick = () => {
        if (username != "") {
            bling.play();
            let text = ticketcount.innerHTML;
            let regex = /[0-9]+/;
            var array = text.match(regex);
            const currTickets = parseInt(array[0]);
            socket.emit('cashout', currTickets, username);     
            tickets = 0;
            ticketcount.innerHTML = `Tickets: ${tickets}`;  
        }
        
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

    addbtn1.onclick = () => {
        if (username) {
            let hopCurrCost = twoDp(hopStartCost * (hopBaseMultiplier ** (hopResCount-1)));
            let hopNextCost = twoDp(hopStartCost * (hopBaseMultiplier ** (hopResCount)));

            if (hopResCount == 0) {
                hopResCount += 1;
                hopCurrCost = hopStartCost;
                rescount1.innerHTML = `${hopResCount}`; cost1.innerHTML = `${hopNextCost}`;
                income1.innerHTML = `${twoDp(hopBaseIncome * hopResCount * prestigeMultiplier)}`;
                notification(hopResCount, 'hop');
            }

            if (tickets >= hopCurrCost) {
                hopResCount += 1; 
                rescount1.innerHTML = `${hopResCount}`; cost1.innerHTML = `${hopNextCost}`;
                income1.innerHTML = `${twoDp(hopBaseIncome * hopResCount * prestigeMultiplier)}`;
                tickets -= hopCurrCost;
                ticketcount.innerHTML = `Tickets: ${twoDp(tickets)}`;      
                notification(hopResCount, 'hop');   
                // dispResInfo(rescount1, hopResCount, cost1, hopCurrCost, hopNextCost, income1, hopBaseIncome);
            }    
        }
    }

    addbtn2.onclick = () => {
        if (username) {
            let swingCurrCost = twoDp(swingStartCost * (swingBaseMultiplier ** swingResCount));
            let swingNextCost = twoDp(swingStartCost * (swingBaseMultiplier ** (swingResCount+1)));
            if (tickets >= swingCurrCost) {
                swingResCount += 1;
                rescount2.innerHTML = `${swingResCount}`; cost2.innerHTML = `${swingNextCost}`;
                income2.innerHTML = `${twoDp(swingBaseIncome * swingResCount * prestigeMultiplier)}`;
                tickets -= swingCurrCost;      
                ticketcount.innerHTML = `Tickets: ${twoDp(tickets)}`; 
                notification(swingResCount, 'swing');
            }     
        }
    }

    addbtn3.onclick = () => {       
        if (username) {
            let slideCurrCost = twoDp(slideStartCost * (slideBaseMultiplier ** slideResCount));
            let slideNextCost = twoDp(slideStartCost * (slideBaseMultiplier ** (slideResCount+1)));
            if (tickets >= slideCurrCost) {
                slideResCount += 1;
                rescount3.innerHTML = `${slideResCount}`; cost3.innerHTML = `${slideNextCost}`;
                income3.innerHTML = `${twoDp(slideBaseIncome * slideResCount * prestigeMultiplier)}`;
                tickets -= slideCurrCost;
                ticketcount.innerHTML = `Tickets: ${twoDp(tickets)}`; 
                notification(slideResCount, 'slide');
            }       
        }
    }

    //Helper function to round and display 2 decimal places

    function twoDp(num) {
        return Number.parseFloat(num).toFixed(2);
    }

    function nextIncome(baseIncome, count) {
        return twoDp(baseIncome * count * prestigeMultiplier);
    }

    // Updates Display Information for Idle Game (TO-DO: Make each resource an object so that I can pass by ref)

    function dispResInfo(resCountObj, resCount,costObj, currCost, nextCost, incomeObj, baseIncome) {
        resCount += 1;
        console.log(resCount);
        resCountObj.innerHTML = `${resCount}`;
        costObj.innerHTML = `${nextCost}`;
        incomeObj.innerHTML = `${nextIncome(baseIncome, resCount)}`;
        tickets -= currCost;
        ticketcount.innerHTML = `Tickets: ${twoDp(tickets)}`;
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
            tickets += (hopBaseIncome * hopResCount * prestigeMultiplier); isMoveHop = false;
            }       

            else if (progbar == bar2) {
            tickets += (swingBaseIncome * swingResCount * prestigeMultiplier); isMoveSwing = false;
            }
            
            else if (progbar == bar3) {
            tickets += (slideBaseIncome * slideResCount * prestigeMultiplier); isMoveSlide = false;
            } 
            ticketcount.innerHTML = `Tickets: ${twoDp(tickets)}`;    
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

    simon_sockets();
}


