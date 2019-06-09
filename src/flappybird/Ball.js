import { GameObject } from '../core/index';
import { ctx, canvas } from '../core/utils/canvas';
import { CircleCollider } from '../core/collision/colliders/index';

import { NO_ACTION, UP } from './actions';

/**
 * @property {number} radius
 * @property {number} v
 * @property {number} angle
 * @property {Game} _game
 */
class Ball extends GameObject {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {Controls} controls
     * @param {Game} game
     * @param {number} radius
     * @param {number} v
     */
    constructor({ x, y, controls, game, radius, gravity, flapHeight}) {
        super({ x, y });

        this.controls = controls;
        this.radius = radius;
        this.gravity = gravity;
        this.flapHeight = flapHeight;
        this._dy = 0;
        this._game = game;

        this.collider = new CircleCollider({ x, y, radius, name: 'Ball', object: this });
    }

    update(dt) {
        const { x, y, v, radius } = this;
        const move = this.controls.getAction();
        
        if (move === UP) {
            this._dy = this.flapHeight;
        }
        this.y += this._dy;
        this._dy += this.gravity;
        
        if(this.y < 0 || this.y > canvas.clientHeight || this.collider.collidesWith('Rect')){
            this._game.gameOver();
        }

        this.collider.update({ x: this.x, y: this.y });
    }

    draw() {
        const { x, y, radius } = this;

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

}

export default Ball;
