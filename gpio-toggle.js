const Gpio = require('onoff').Gpio; //Gpio class

//initialize GPIO pins
const LED_1 = new Gpio(17, 'out');
const LED_2 = new Gpio(22, 'out');
const LED_3 = new Gpio(26, 'out');

//fn that toggles gpio given the parameters
toggle = (gpio1, gpio2, gpio3) => {
    LED_1.writeSync(gpio1 ? 1 : 0);
    LED_2.writeSync(gpio2 ? 1 : 0);
    LED_3.writeSync(gpio3 ? 1 : 0);
};

module.exports = { toggle }; //export toggle fn
