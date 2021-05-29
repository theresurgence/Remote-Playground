const gpio = require('./gpio-toggle'); //import toggle fn from gpio-toggle module


var simon_history = []; 
var user_history = []; 


var user_input = -1;

async function user_inputs() {

    for (let i=0; i<simon_history.length; i++) {
        user_history.push(user_input);
        await gpio.blinks(simon_history);

    }
    if (user_input == simon_history[simon_history.length-1]) {

}




async function simon() {
    var game_on = true;

    while (game_on) {

        await gpio.blinks(simon_history);

        console.log();
        if (user_input == simon_history[simon_history.length-1]) {
            user_history.push(user_input);
            await gpio.blinks(simon_history);

        }


        game_on = false;
    }
}





simon();






/* how to do successive blinks calls without them all
 * clustering together
 *
 * can have easy medium hard mode for simon says...
 * change timings
 */














// gpio.blink(leds_list[0]);
// console.log('Hi');

// gpio.LED_ctl(gpio.LED_1, 0);
    


//
// var nums = [1,2,3,4,5,6,7,8,9,10]
// console.log(nums.forEach(function))

// for (let i = 0; i < simon_history.length-1; i++) {
//     gpio.blink(leds_list[simon_history[i]],
//                 leds_list[simon_history[i+1]], 5);
// }

// leds_list.forEach(gpio.endBlink);




// setTimeout(() => {
//     blink(LED_1);
// }, 3000);

// gpio.LED_ctl(toggle.LED_1, 0);

// gpio.blink(gpio.LED_1);


// setTimeout(() => {
//     gpio.endBlink(gpio.LED_1);
//     console.log("END");
// }, 3000);


// var blinkInterval = setInterval(blink, 250); //run the blinkLED function every 250ms

// function blinkLED() { //function to start blinking
//   if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
//     LED.writeSync(1); //set pin state to 1 (turn LED on)
//   } else {
//     LED.writeSync(0); //set pin state to 0 (turn LED off)
//   }
// }

// function endBlink() { //function to stop blinking
//   clearInterval(blinkInterval); // Stop blink intervals
//   LED.writeSync(0); // Turn LED off
//   LED.unexport(); // Unexport GPIO to free resources
// }

// setTimeout(endBlink, 5000); //stop blinking after 5 seconds
