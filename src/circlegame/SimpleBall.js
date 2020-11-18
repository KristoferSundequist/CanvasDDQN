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
class SimpleBall extends GameObject {
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
        this._game = game;
        this.speed = 1;

        this.collider = new CircleCollider({ x, y, radius, name: 'Ball', object: this });
    }

    update(dt) {
        const { x, y, v, radius } = this;
        const move = this.controls.getAction();
        
        if (move === UP) {
            this.y -= this.speed;
        }
        if (move === DOWN) {
            this.y += this.speed;
        }
        if (move === LEFT) {
            this.x -= this.speed;
        }
        if (move === RIGHT) {
            this.x += this.speed;
        }
        
        
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y > canvas.clientHeight){
            this.y = canvas.clientHeight;
        }
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > canvas.clientWidth){
            this.x = canvas.clientWidth;
        }

        this.collider.update({ x: this.x, y: this.y });
    }

    draw() {
        const { x, y, radius } = this;

        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

}

export default SimpleBall;
