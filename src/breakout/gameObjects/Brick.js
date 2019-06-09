import { GameObject } from '../../core/index';
import { RectangleCollider } from '../../core/collision/colliders/index';
import { ctx } from '../../core/utils/canvas';
import { defaultColor, primary } from '../config/colors';

/**
 * @property {number} x
 * @property {number} y
 * @property {boolean} dead
 * @property {Collider} collider
 * @property {number} width
 * @property {number} height
 */
class Brick extends GameObject {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor({ x, y, width, height }) {
    super({ x, y });

    this.width = width;
    this.height = height;

    this.collider = new RectangleCollider({
      x, y, width, height, name: 'Brick', object: this,
    });
  }

  update(dt) {
    this.collider.update({});
  }

  draw() {
    const { x, y, width, height } = this;

    ctx.fillStyle = primary;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = defaultColor;
  }
}

export default Brick;
