import { GameObject } from '../../core/index';
import { ctx, canvas } from '../../core/utils/canvas';
import { RectangleCollider } from '../../core/collision/colliders/index';
import { defaultColor, primary } from '../config/colors';
import { LEFT, RIGHT } from '../actions';

/**
 * The Paddle game object.
 *
 * @property {number} x
 * @property {number} y
 * @property {Controls} controls
 * @property {number} _width
 * @property {number} _height
 */
class
Paddle extends GameObject {

  /**
   * @param {number} x
   * @param {number} y
   * @param {Controls} controls
   * @param {number} width
   * @param {number} height
   * @param {number} v
   */
  constructor({ x, y, controls, width, height, v }) {
    super({ x, y });

    this.controls = controls;
    this._width = width;
    this._height = height;
    this.vx = v;

    this.x = (canvas.clientWidth - this._width) / 2;
    this.y = (canvas.clientHeight - this._height);

    this.collider = new RectangleCollider({
      x: this.x,
      y: this.y,
      width: this._width,
      height: this._height,
      name: 'Paddle',
      object: this,
    });
  }

  update(dt) {
    const { vx } = this;
    const dx = vx * dt;

    const move = this.controls.getAction();
    if (move === LEFT) {
      this.x = Math.max(0, this.x - dx);
    } else if (move === RIGHT) {
      this.x = Math.min(canvas.clientWidth - this._width, this.x + dx);
    }

    this.collider.update({ x: this.x });
  }

    draw() {
        const { x, y, _width, _height } = this;

        ctx.fillStyle = primary;
        ctx.fillRect(x, y, _width, _height);
        ctx.fillStyle = defaultColor;
    }
}

export default Paddle;
