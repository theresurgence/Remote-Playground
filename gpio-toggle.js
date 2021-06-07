/* Future add ons: timing difficulty levels
 */

// const Gpio = require('onoff').Gpio; //Gpio class

//initialize GPIO pins
// const LED_0 = new Gpio(17, 'out'),
//       LED_1 = new Gpio(22, 'out'),
//       LED_2 = new Gpio(26, 'out'),
//       LED_3 = new Gpio(12, 'out');

// const leds_list = [LED_0, LED_1, LED_2, LED_3];

// var simon_info = { index: 0 , hist: []}; //to be exported to other modules

// //to be exported to other modules, so that they do not directly change the simon_info obj key-value pairs
// function hist_reset() { simon_info.hist = []; }
// function index_reset() { simon_info.index = 0; }
// function index_add() { simon_info.index++; console.log(`hist_index: ${simon_info.index}`); }

// //for use in async function using await to pause within the async fn
// //code outside the async function still runs
// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// //sets given gpio/LED to a high or low
// function LED_ctl(LED, gpio_status) { LED.writeSync(gpio_status); }

// async function fast_blink(curr_LED) {
//     const slp_time = 500;

//     LED_ctl(curr_LED, 1);
//     await sleep(slp_time); //sleep only within function, rest of code will still run normally
//     LED_ctl(curr_LED, 0);
//     await sleep(slp_time);
// };

// //on LED for 1s, off for 1s
// async function blink(curr_LED) {
//     await sleep(200); //sleep only within function, code outside fn will still run normally
//     LED_ctl(curr_LED, 1);
//     await sleep(200);
//     LED_ctl(curr_LED, 0);
// };

// async function blinks() {
//     let random_led = Math.floor(Math.random() * 4); //random number from 0-3 (incl)
//     simon_info.hist.push(random_led);
//     console.log(simon_info.hist);

//     let i = 0;
//     do {
//         let curr_LED = leds_list[simon_info.hist[i]];
//         // console.log(i)
//         await blink(curr_LED); //ensures that blink happens one at a time
//         i++;

//     } while (i < simon_info.hist.length);
// };

// async function simon_blinks() {
//     await blinks();
// }


// module.exports = { 
//     LED_1, LED_2, LED_3, LED_0,
//     LED_ctl,
//     blink,
//     fast_blink,
//     blinks,
//     sleep,
//     simon_blinks,


//     hist_reset,
//     index_reset,
//     index_add,

//     simon_info
// }; 


// // do this when no one online / never invoke the led 
// function endBlink(LED) { //function to stop blinking
//     LED_ctl(LED, 0); // Turn LED off
//     LED.unexport(); // Unexport GPIO to free resources
// };

