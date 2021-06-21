/* Import Websockets module */
import { main_sockets } from './websockets-client/socket-client-main.js'


//************************ uncomment this below if no RPI ******************************************************/
const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
// const socket = io.connect('http://192.168.18.44:3000', {reconnect: true}); //client establishes websocket connection to server

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

    simon_startquit_btn = document.getElementById('simon-startquit'),

    curr_score = document.getElementById('curr_score'),

    userpassbox = document.getElementById("userpass"),
    username = document.getElementById("user").innerHTML,
    inputfield = document.getElementById("chat-input"),
    signup = document.getElementById("signuplink"),
    play_btns = document.getElementById('play-buttons'),
    chat_btn = document.getElementById('chatbutton'),
    queue_btn = document.getElementById('queuebutton'),
    exit_btn = document.getElementById('exitbutton'),
    navbar = document.getElementById('nav-bar');

    //Sticky Navbar
    var sticky = navbar.offsetTop;

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
