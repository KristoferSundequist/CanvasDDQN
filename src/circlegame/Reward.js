import { GameObject } from '../core/index';
import { ctx, canvas } from '../core/utils/canvas';
import { RectangleCollider, CircleCollider } from '../core/collision/colliders/index';

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
    constructor({ x, y, game, radius}) {
        super({ x, y });

        this.radius = radius;
        this._game = game;
        this.reset();

        this.collider = new RectangleCollider({ x:this.x, y:this.y, width:radius, height:radius, name: 'Reward', object: this });
    }

    reset(){
        this.x = Math.random()*canvas.clientWidth;
        this.y = Math.random()*canvas.clientHeight;
    }
    
    update(dt) {
        const { x, y, v, radius } = this;

        this.collider.update({ x: this.x, y: this.y });
    }

    draw() {
        const { x, y, radius } = this;

        ctx.fillStyle = 'indigo';
        ctx.rect(x,y, radius, radius);
        ctx.fill();
    }

}

export default Enemy;
