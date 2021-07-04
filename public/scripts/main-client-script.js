/* Import Websockets module */
import { main_sockets } from './websockets-client/socket-client-main.js'


//************************ uncomment this below if no RPI ******************************************************/
const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
// const socket = io.connect('https://192.168.20.4:4000', {reconnect: true}); //client establishes websocket connection to server

/**********************DEPLOYMENT ********************/
// const socket = io.connect('https://20.194.44.54:8080', {reconnect: true}); //client establishes websocket connection to server

/* Declare all Document Objects to be manipulated */
const online = document.getElementById('online'),
    gpio0 = document.getElementById('gpio0'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),
    box1 = document.getElementById('box1'),
    box2 = document.getElementById('box2'),
    box3 = document.getElementById('box3'),
    box4 = document.getElementById('box4'),
    box5 = document.getElementById('box5'),
    idlebtn1 = document.getElementById('idlebutton1'),
    idlebtn2 = document.getElementById('idlebutton2'),
    idlebtn3 = document.getElementById('idlebutton3'),
    collapsecol = document.getElementById('collapsecol'),
    ticketcount = document.getElementById('ticket-count'),
    btnpress = document.getElementById('btnsound'),
    chatcon = document.getElementById('cht'),
    statcon = document.getElementById('stat'),
    bigcon = document.getElementById('big-container'),

    simon_startquit_btn = document.getElementById('simon-startquit'),

    curr_score = document.getElementById('curr_score'),


    username = document.getElementById("user").innerHTML,
    inputfield = document.getElementById("chat-input"),
    play_btns = document.getElementsByClassName('play-buttons'),
    chat_btn = document.getElementById('chatbutton'),
    queue_btn = document.getElementById('queuebutton'),
    exit_btn = document.getElementById('exitbutton'),
    navbar = document.getElementById('nav-bar');

    //Sticky Navbar
    var sticky = navbar.offsetTop;

    //temp resource for idle game
    var tickets = 0;

    window.onscroll = () => {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    }

    //Use enter key to send chat messages
    inputfield.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        chat_btn.click();
      }
    });

    inputfield.addEventListener("keyup", (event) => {
      if (event.key === "A") {
        event.preventDefault();
        idlebtn.click();
      }
    })

    //Audio Elements to Buttons
    gpio0.onclick = () => {
      btnpress.play();
    }

    gpio1.onclick = () => {
      btnpress.play();
    }

    gpio2.onclick = () => {
      btnpress.play();
    }

    gpio3.onclick = () => {
      btnpress.play();
    }

    idlebtn1.onclick = () => {
      btnpress.play();
      tickets += 1;
      ticketcount.innerHTML = `Tickets: ${tickets}`;    
    }

    idlebtn2.onclick = () => {
      btnpress.play();
      tickets += 5;
      ticketcount.innerHTML = `Tickets: ${tickets}`;    
    }

    idlebtn3.onclick = () => {
      btnpress.play();
      tickets += 50;
      ticketcount.innerHTML = `Tickets: ${tickets}`;    
    }
    
    //ability to collapse 2nd column
    var isCollapsed = false;

    collapsecol.onclick = () => {
      if (isCollapsed) {
        bigcon.classList.remove("big-container2");
        statcon.classList.remove("dispnone");
        chatcon.classList.remove("dispnone");
        bigcon.classList.add("big-container1");
        collapsecol.value = ">";
        isCollapsed = false;        
      }
      else {
        bigcon.classList.remove("big-container1");
        statcon.classList.add("dispnone");
        chatcon.classList.add("dispnone");
        bigcon.classList.add("big-container2");
        collapsecol.value = "<";
        isCollapsed = true;
      }
    }


function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}


/* Simon Says flags */
var simon_on = false; 
var simon_speaks = false;
const gpio_list = [gpio0, gpio1, gpio2, gpio3];
const box_list = [box1, box2, box3, box4, box5];


//intialize all websockets
main_sockets(document, 
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
    username
);



// function removeMultipleEventListener(element, events, handler) {
//   events.forEach(e => element.addEventListener(e, handler))
// }
