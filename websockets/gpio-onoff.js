gpio = require('../gpio-toggle');


module.exports = function (socket) {

    socket.on('gpio0_on', ()=> { gpio.LED_ctl(gpio.LED_0,1); });
    socket.on('gpio0_off', ()=> { gpio.LED_ctl(gpio.LED_0,0); });

    socket.on('gpio1_on', ()=> { gpio.LED_ctl(gpio.LED_1,1); });
    socket.on('gpio1_off', ()=> { gpio.LED_ctl(gpio.LED_1,0);});

    socket.on('gpio2_on', ()=> { gpio.LED_ctl(gpio.LED_2,1); });
    socket.on('gpio2_off', ()=> { gpio.LED_ctl(gpio.LED_2,0);});

    socket.on('gpio3_on', ()=> { gpio.LED_ctl(gpio.LED_3,1); });
    socket.on('gpio3_off', ()=> { gpio.LED_ctl(gpio.LED_3,0);});
}
