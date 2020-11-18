//import { BreakoutKeyboardControls } from './breakout/controls'
//import { Breakout, BreakoutSettings, actions } from './breakout'
import './charts'

import FlappyKeyboardControls from './flappybird/FlappyKeyboardControls'
import { Flappy, FlappySettings } from './flappybird'

//import CirclegameKeyboardControls from './circlegame/CirclegameKeyboardControls';
//import { Circlegame, CirclegameSettings} from './circlegame';

import funcs from './learning'
window['funcs'] = funcs

// function startKeyboardControlledGame() {
//     const game = new Circlegame({
//         controls: new CirclegameKeyboardControls(),
//     });

//     game.start();

//     return game;
// }
//fills replay buffer with random actions
//funcs.init();

//renders memory (as neural net sees it)
//funcs.renderMemory(0,200);

/*
function startKeyboardControlledGame() {
    // To override settings we can pass in an instance of BreakoutSettings
    // e.g. settings: new BreakoutSettings({ ballVelocity: 100 }) and import from
    // './breakout'.
    const game = new Breakout({
        controls: new BreakoutKeyboardControls(),
        settings: new BreakoutSettings({
            width: 28,
            height: 28,

            brickHeight: 1,
            brickColumnCount: 5,
            brickRowCount: 3,
            brickOffsetLeft: 0,
            brickPadding: 0,
            brickOffsetTop: 2,

            paddleHeight: 2,
            paddleWidth: 9,
            paddleVelocity: 50,

            ballRadius: 0.6,
            ballVelocity: 50
        })
    })

    game.start()

    return game
}
*/

function startKeyboardControlledGame() {
    // To override settings we can pass in an instance of BreakoutSettings
    // e.g. settings: new BreakoutSettings({ ballVelocity: 100 }) and import from
    // './breakout'.
    const game = new Flappy({
        controls: new FlappyKeyboardControls()
    })
    game.start()
    return game
}

document.querySelector('#js-keyboard-button').addEventListener('click', () => {
    startKeyboardControlledGame()
})

document.querySelector('#js-training-button').addEventListener('click', () => {
    funcs.trainwrapper()
})

//
// /**
//  * @return {Breakout}
//  */
// function startProgrammaticControlledGame() {
//   const game = new Breakout();
//
//   game.reset();
//
//   return game;
// }
//
//
// // All available actions are here: actions.ACTIONS_LIST
//
// const game = startProgrammaticControlledGame();
// let moves = 0;
//
// // advance();
// //
// // function advance() {
// //   game.step(Math.floor(Math.random() * Math.floor(3)));
// //
// //   if (moves < 100) {
// //     window.requestAnimationFrame(advance);
// //     moves++;
// //   }
// // }
//
// while (moves < 100) {
//   const reward = game.step(Math.floor(Math.random() * Math.floor(3)));
//
//   console.log('reward', reward);
//
//   moves++;
// }
