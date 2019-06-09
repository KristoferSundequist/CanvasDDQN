import { Game } from '../core/index';
import { canvas } from '../core/utils/canvas';
import Ball from './Ball';
import Rect from './Rect';
import Rect2 from './Rect2';
import FlappySettings from './FlappySettings';

/**
 * @property {GameObject[]} gameObjects
 * @property {boolean} isGameOver;
 * @property {Controls} _controls}
 * @property {GameLoop} _gameLoop
 * @property {Collision} _collision
 * @property {BreakoutSettings} _settings
 * @property {number} _reward
 */
class Flappy extends Game {
   
    constructor({ settings = new FlappySettings(), ...rest } = {}) {
        super({ settings, ...rest });
        this.openingSize = 10;
        this.opening = this.getOpening();
    }

    getOpening(){
        return canvas.clientHeight/2 + (Math.random()*6 - 3) - this.openingSize/2;
    }

    resetOpening(){
        this.opening = this.getOpening();
    }

    start() {
        this.reset();

        super.start();
    }

    update(dt) {
        this._collision.detect(this.gameObjects);

        if (this.isWon()) {
            this.handleWin();
        }
    }

    reset() {
        super.reset();
        this.resetOpening();
        
        const {
            ballRadius,
            gravity,
            flapHeight,
            rectWidth,
            rectHeight,
            rectVelocity
        } = this._settings;

        this.gameObjects.push(new Ball({
            x: ballRadius*5,
            y: canvas.clientHeight/2,
            controls: this._controls,
            game: this,
            radius: ballRadius,
            gravity: gravity,
            flapHeight: flapHeight
        }));

        this.gameObjects.push(new Rect({
            x: canvas.clientWidth,
            y: 0,
            width: rectWidth,
            height: this.opening,
            v: rectVelocity,
            game: this
        }));

        this.gameObjects.push(new Rect2({
            x: canvas.clientWidth,
            y: this.opening + this.openingSize,
            width: rectWidth,
            height: canvas.clientHeight,
            v: rectVelocity,
            openingSize: this.openingSize,
            game: this
        }));
    }

    isWon() {
        return false;
    }
}

export default Flappy;
