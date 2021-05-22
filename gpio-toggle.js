const Gpio = require('onoff').Gpio; //Gpio class

//initialize GPIO pins
const LED_1 = new Gpio(17, 'out');
const LED_2 = new Gpio(22, 'out');
const LED_3 = new Gpio(26, 'out');

//fn that toggles gpio given the parameters
toggle1 = (is_on) => {
    LED_1.writeSync(is_on ? 1 : 0);
};

toggle2 = (is_on) => {
    LED_2.writeSync(is_on ? 1 : 0);
};

toggle3 = (is_on) => {
    LED_3.writeSync(is_on ? 1 : 0);
};


module.exports = { toggle1, toggle2, toggle3 }; //export toggle fns
