//************************ uncomment this below if no RPI ******************************************************/
// const socket = io.connect('http://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
const socket = io.connect('http://192.168.18.45:3000', {reconnect: true}); //client establishes websocket connection to server

/* Declare all Document Objects to be manipulated */
const online = document.getElementById('online'),
    gpio0 = document.getElementById('gpio0'),
    gpio1 = document.getElementById('gpio1'),
    gpio2 = document.getElementById('gpio2'),
    gpio3 = document.getElementById('gpio3'),

    userpassbox = document.getElementById("userpass"),
    inputfield = document.getElementById("user"),
    signup = document.getElementById("signuplink"),
    simon_startquit_btn = document.getElementById('simon-startquit'),
    play_btns = document.getElementById('play-buttons'),
    chat_btn = document.querySelector('#chatbutton');

function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}


/* Simon Says flags */
var simon_on = false; 
var simon_speaks = false;
const gpio_list = [gpio0, gpio1, gpio2, gpio3];


/* Import Websockets module */
require('./websockets-client/main')(document, 
    socket,
    addMultipleEventListener,
    gpio_list,
    simon_on,
    simon_speaks,
    simon_startquit_btn,
    play_btns);


// function removeMultipleEventListener(element, events, handler) {
//   events.forEach(e => element.addEventListener(e, handler))
// }
