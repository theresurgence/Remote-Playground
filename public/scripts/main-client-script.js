/* Import Websockets module */
import { main_sockets } from './websockets-client/socket-client-main.js'


//************************ uncomment this below if no RPI ******************************************************/
// const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
const socket = io.connect('http://192.168.18.44:3000', {reconnect: true}); //client establishes websocket connection to server

/* Declare all Document Objects to be manipulated */
const online = document.getElementById('online'),
    gpio0 = document.getElementById('gpio0'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),

    simon_startquit_btn = document.getElementById('simon-startquit'),

    curr_score = document.getElementById('curr_score'),

    userpassbox = document.getElementById("userpass"),
    inputfield = document.getElementById("user"),
    signup = document.getElementById("signuplink"),
    play_btns = document.getElementById('play-buttons'),
    chat_btn = document.getElementById('chatbutton'),
    navbar = document.getElementById('nav-bar');

    var sticky = navbar.offsetTop;

    window.onscroll = () => {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    }


function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}


/* Simon Says flags */
var simon_on = false; 
var simon_speaks = false;
const gpio_list = [gpio0, gpio1, gpio2, gpio3];


//intialize all websockets
main_sockets(document, 
    socket,
    addMultipleEventListener,
    gpio_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns,
    chat_btn,
    curr_score
);



// function removeMultipleEventListener(element, events, handler) {
//   events.forEach(e => element.addEventListener(e, handler))
// }
