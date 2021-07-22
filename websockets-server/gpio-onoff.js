gpio = require('../gpio-toggle');

module.exports = function (socket) {

    socket.on('gpio0_on', ()=> { gpio.LED_ctl(gpio.LED_0,1); console.log("0 on");});
    socket.on('gpio0_off', ()=> { gpio.LED_ctl(gpio.LED_0,0); console.log("0 off");});

    socket.on('gpio1_on', ()=> { gpio.LED_ctl(gpio.LED_1,1); console.log("1 on");});
    socket.on('gpio1_off', ()=> { gpio.LED_ctl(gpio.LED_1,0); console.log("1 off");});

    socket.on('gpio2_on', ()=> { gpio.LED_ctl(gpio.LED_2,1); console.log("2 on");});
    socket.on('gpio2_off', ()=> { gpio.LED_ctl(gpio.LED_2,0); console.log("2 off");});

    socket.on('gpio3_on', ()=> { gpio.LED_ctl(gpio.LED_3,1); console.log("3 on");});
    socket.on('gpio3_off', ()=> { gpio.LED_ctl(gpio.LED_3,0); console.log("3 off");});


    socket.on('gpio4_on', ()=> { gpio.LED_ctl(gpio.LED_4,1); console.log("4 on");});
    socket.on('gpio4_off', ()=> { gpio.LED_ctl(gpio.LED_4,0); console.log("4 off");});

    socket.on('gpio5_on', ()=> { gpio.LED_ctl(gpio.LED_5,1); console.log("5 on");});
    socket.on('gpio5_off', ()=> { gpio.LED_ctl(gpio.LED_5,0); console.log("5 off");});

    socket.on('gpio6_on', ()=> { gpio.LED_ctl(gpio.LED_6,1); console.log("6 on");});
    socket.on('gpio6_off', ()=> { gpio.LED_ctl(gpio.LED_6,0); console.log("6 off");});

    socket.on('gpio7_on', ()=> { gpio.LED_ctl(gpio.LED_7,1); console.log("7 on");});
    socket.on('gpio7_off', ()=> { gpio.LED_ctl(gpio.LED_7,0); console.log("7 off");});
}
