import { GameObject } from '../core/index';
import { ctx, canvas } from '../core/utils/canvas';
import { CircleCollider } from '../core/collision/colliders/index';

/**
 * @property {number} radius
 * @property {number} v
 * @property {number} angle
 * @property {Game} _game
 */
class Enemy extends GameObject {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {Controls} controls
     * @param {Game} game
     * @param {number} radius
     * @param {number} v
     */
    constructor({ x, y, game, radius, target}) {
        super({ x, y });

        this.radius = radius;
        this._game = game;
        this.reset();
        this.target = target;
        this.speed = 0.2;
        this.collider = new CircleCollider({ x, y, radius, name: 'Enemy', object: this });
    }

    reset(){
        this.x = Math.random()*canvas.clientWidth;
        this.y = Math.random()*canvas.clientHeight;
    }
    
    update(dt) {
        const { x, y, v, radius } = this;
        
        if(this.y < this.target.y){
            this.y += this.speed;
        }
        if(this.y > this.target.y){
            this.y -= this.speed;
        }
        if(this.x < this.target.x){
            this.x += this.speed;
        }
        if(this.x > this.target.x){
            this.x -= this.speed;
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

export default Enemy;
