const Gpio = require('onoff').Gpio; //Gpio class

//initialize GPIO pins
const LED_1 = new Gpio(17, 'out');
const LED_2 = new Gpio(22, 'out');
const LED_3 = new Gpio(26, 'out');
const LED_4 = new Gpio(12, 'out');

var simon_history = []; 
var user_history = [];

const leds_list = [LED_1, LED_2, LED_3, LED_4];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

//fn that sets given gpio to a high or low
function LED_ctl(LED, gpio_status) {
    LED.writeSync(gpio_status);
};

async function blink(curr_LED) {
    LED_ctl(curr_LED, 1);
    await sleep(1000); //sleep only within function, rest of code will still run normally
    LED_ctl(curr_LED, 0);
    await sleep(1000);
};

async function blinks(simon_history) {
    let random_led = Math.floor(Math.random() * 4);
    simon_history.push(random_led);
    console.log(simon_history);

    let i = 0;
    do {
        let curr_LED = leds_list[simon_history[i]];
        blink(curr_LED);
        i++;

        await sleep(2000);
    } while (i < simon_history.length);
};

// do this when no one online / never invoke the led 
function endBlink(LED) { //function to stop blinking
    LED_ctl(LED, 0); // Turn LED off
    LED.unexport(); // Unexport GPIO to free resources
};



module.exports = { 
    LED_1, LED_2, LED_3, LED_4,
    LED_ctl,
    blink,
    blinks,
    endBlink,
    sleep
}; //export toggle fns






// function blinkLED() { //function to start blinking
//     if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
//         LED.writeSync(1); //set pin state to 1 (turn LED on)
//     } else {
//         LED.writeSync(0); //set pin state to 0 (turn LED off)




////fn that toggles gpio given the parameters
//function LED1(gpio1_status) {
//    LED_1.writeSync(gpio1_status ? 1 : 0);
//};

//function LED1(gpio1_status) {
//    LED_1.writeSync(gpio1_status ? 1 : 0);
//};

//function LED1(gpio1_status) {
//    LED_1.writeSync(gpio1_status ? 1 : 0);
//};
    //
    //
    //
    //

// function blink(curr_LED, next_LED, num_of_blinks) {
//     LED_ctl(curr_LED, 1);
//     setTimeout(() => {
//         LED_ctl(curr_LED, 0)
//         console.log("off")
//         if (--num_of_blinks) {
//             setTimeout(() => {
//                 blink(next_LED, num_of_blinks);
//                 console.log("newgblink")     
//         },500)
//         }; 
//     }, 500);
// };

