import { Game } from '../core/index';
import { canvas } from '../core/utils/canvas';
import SimpleBall from './SimpleBall';
import Enemy from './Enemy';
import Reward from './Reward';
import CirclegameSettings from './CirclegameSettings';

/**
 * @property {GameObject[]} gameObjects
 * @property {boolean} isGameOver;
 * @property {Controls} _controls}
 * @property {GameLoop} _gameLoop
 * @property {Collision} _collision
 * @property {BreakoutSettings} _settings
 * @property {number} _reward
 */
class Circlegame extends Game {
   
    constructor({ settings = new CirclegameSettings(), ...rest } = {}) {
        super({ settings, ...rest });
        this.Ball = null;
        this.Enemy = null;
        this.Reward = null;
    }

    start() {
        this.reset();

        super.start();
    }

    update(dt) {
        this._collision.detect(this.gameObjects);

        if (this.Ball.collider.collidesWith('Enemy')){
            this.increaseReward(-1);
            this.Enemy.reset();
        }

        if (this.Ball.collider.collidesWith('Reward')){
            this.increaseReward(0.2);
            this.Reward.reset();
        }
        
        if (this.isWon()) {
            this.handleWin();
        }
        
    }

    reset() {
        super.reset();

        this.Ball = new SimpleBall({
            x: Math.random()*canvas.clientWidth,
            y: Math.random()*canvas.clientHeight,
            controls: this._controls,
            game: this,
            radius: 2
        });

        this.Enemy = new Enemy({
            x: Math.random()*canvas.clientWidth,
            y: Math.random()*canvas.clientHeight,
            controls: this._controls,
            game: this,
            radius: 3,
            target: this.Ball
        });

        this.Reward = new Reward({
            x: Math.random()*canvas.clientWidth,
            y: Math.random()*canvas.clientHeight,
            game: this,
            radius: 5
        });

        this.gameObjects.push(this.Ball);

        this.gameObjects.push(this.Enemy);

        this.gameObjects.push(this.Reward);
    }

    isWon() {
        return false;
    }
}

export default Circlegame;
