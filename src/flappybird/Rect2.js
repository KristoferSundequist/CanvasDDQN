import { GameObject } from '../core/index';
import { ctx, canvas } from '../core/utils/canvas';
import { RectangleCollider } from '../core/collision/colliders/index';

/**
 * The Rect game object.
 *
 * @property {number} x
 * @property {number} y
 * @property {number} _width
 * @property {number} _height
 * @property {number} velocity
 */
class Rect2 extends GameObject {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} v
     */
    constructor({ x, y, width, height, v, openingSize, game }) {
        super({ x, y });

        this._width = width;
        this._height = height;
        this.vy = v;

        this.x = x;
        this.y = y;
        this._game = game;
        this.openingSize = openingSize;

        this.collider = new RectangleCollider({
            x: this.x,
            y: this.y,
            width: this._width,
            height: this._height,
            name: 'Rect',
            object: this,
        });
    }

    update(dt) {
        const { vy } = this;
        this.x -= vy;

        if(this.x + this._width < 0){
            this.x = canvas.clientWidth;
            this.y = this._game.opening + this.openingSize;
        }
        this.collider.update({ x: this.x, y: this.y});
    }

    draw() {
        const { x, y, _width, _height } = this;

        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, _width, _height);
    }
}

export default Rect2;
