import { GameObject } from '../core/index';
import { ctx, canvas } from '../core/utils/canvas';
import { CircleCollider } from '../core/collision/colliders/index';

import { NO_ACTION, UP, DOWN, LEFT, RIGHT } from './actions';

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
    constructor({ x, y, controls, game, radius}) {
        super({ x, y });

        this.controls = controls;
        this.radius = radius;
        this._dx = 0;
        this._dy = 0;
        this._game = game;
        this.maxspeed = 2;
        this.change = 0.4;

        this.collider = new CircleCollider({ x, y, radius, name: 'Ball', object: this });
    }

    update(dt) {
        const { x, y, v, radius } = this;
        const move = this.controls.getAction();
        
        if (move === UP) {
            this._dy -= this.change;
        }
        if (move === DOWN) {
            this._dy += this.change;
        }
        if (move === LEFT) {
            this._dx -= this.change;
        }
        if (move === RIGHT) {
            this._dx += this.change;
        }
        
        this.y += this._dy;
        this.x += this._dx;

        
        if(this._dy < -this.maxspeed){
            this._dy = -this.maxspeed;
        }
        if(this._dy > this.maxspeed){
            this._dy = this.maxspeed;
        }
        if(this._dx < -this.maxspeed){
            this._dx = -this.maxspeed;
        }
        if(this._dx > this.maxspeed){
            this._dx = this.maxspeed;
        }
        
        
        if(this.y < 0){
            this.y = 0;
            this._dy *= -1;
        }
        if(this.y > canvas.clientHeight){
            this.y = canvas.clientHeight;
            this._dy *= -1;
        }
        if(this.x < 0){
            this.x = 0;
            this._dx *= -1;
        }
        if(this.x > canvas.clientWidth){
            this.x = canvas.clientWidth;
            this._dx *= -1;
        }

        this._dx *= 0.95;
        this._dy *= 0.95;
        this.collider.update({ x: this.x, y: this.y });
    }

    draw() {
        const { x, y, radius } = this;

        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

}

export default Ball;
