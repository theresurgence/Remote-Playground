var socket = io.connect('http://192.168.18.45:3000'); //client establishes websocket connection to server

var online = document.getElementById('online');

//Listen for events
socket.on('online', (online_num)=>{
    online.innerHTML = online_num;  
});


