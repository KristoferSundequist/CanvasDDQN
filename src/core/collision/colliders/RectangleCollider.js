import Collider from './Collider';
import CircleCollider from './CircleCollider';

/**
 * @property {number} width
 * @property {number} height
 */
class RectangleCollider extends Collider {
  constructor({ x, y, width, height, name, object }) {
    super({ x, y, name, object });

    this.width = width;
    this.height = height;
  }

  update({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    super.update({ x, y });

    this.width = width;
    this.height = height;
  }

  isColliding(other) {
    if (other instanceof CircleCollider) {
      return other.isColliding(this);
    }

    return false;
  }

  center() {
    const { x, y, width, height } = this;

    return {
      x: x + width / 2,
      y: y + height / 2,
    };
  }
}

export default RectangleCollider;
