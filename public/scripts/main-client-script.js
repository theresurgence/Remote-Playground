/* Import Websockets module */
import { main_sockets } from './websockets-client/socket-client-main.js'


//************************ uncomment this below if no RPI ******************************************************/
const socket = io.connect('https://localhost:3000', {reconnect: true}); //client establishes websocket connection to server

/************************************** comment if no RPI *****************************/
// const socket = io.connect('https://192.168.20.4:3000', {reconnect: true}); //client establishes websocket connection to server

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
    bar1 = document.getElementById("bar1"),
    bar2 = document.getElementById("bar2"),
    bar3 = document.getElementById("bar3"),
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
    navbar = document.getElementById('nav-bar'),
    inputs_class = document.getElementsByClassName('inputs');





var input_focus = false;

for (let i=0; i < inputs_class.length; i++) {
    inputs_class[i].addEventListener('focus', function() { input_focus = true; console.log(input_focus) });
    inputs_class[i].addEventListener('blur', function() { input_focus = false; console.log(input_focus) });
}

// function addMultipleEventListener(element, events, handler) {
//   events.forEach(e => element.addEventListener(e, handler))
// }


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

    inputfield.addEventListener("keyup", (event) => {
      if (event.key === "A") {
        event.preventDefault();
        idlebtn.click();
      }
    })

    //Background Music Toggle
    var musicbtn = document.getElementById("bgmusicbtn");
    var bgmusic = document.getElementById("bgmusic");

    musicbtn.onclick = () => {
      bgmusic.play();
    }

    //temp resource for idle game
    var tickets = 0;

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

    //Modal Box
    var infomodal = document.getElementById("infomodal");
    var infobtn = document.getElementById("modalbtn");
    var span = document.getElementsByClassName("close")[0];
    

    infobtn.onclick = () => {
      infomodal.style.display = "block";
    }

    span.onclick = () => {
      infomodal.style.display = "none";
    }

    window.onclick = (event) => {
      if (event.target == infomodal) {
        infomodal.style.display = "none";
      }
    }


    //Idle Progress Bar
    var i = 0;
    var isMoveHop = false, isMoveSwing = false, isMoveSlide = false;

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




function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}


/* Simon Says flags */
var simon_on = false; 
var simon_speaks = false;
const gpio_list = [gpio0, gpio1, gpio2, gpio3];
const box_list = [box1, box2, box3, box4, box5];


//intialize all websockets
main_sockets(window, document, 
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
);


export { input_focus, btnpress } ;
