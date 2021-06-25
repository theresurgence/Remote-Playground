const gpio = require('./gpio-toggle'); //import toggle fn from gpio-toggle module

const Gpio = require('onoff').Gpio; //Gpio class

gpio.start_signal();
// for (i = 0; i < 20; i++)
//     console.log(Math.floor(Math.random() * 4));



/* how to do successive blinks calls without them all
 * clustering together
 *
 * can have easy medium hard mode for simon says...
 * change timings
 */















// function endBlink() { //function to stop blinking
//   clearInterval(blinkInterval); // Stop blink intervals
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
// }

// setTimeout(endBlink, 5000); //stop blinking after 5 seconds
