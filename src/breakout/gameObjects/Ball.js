import { GameObject } from '../../core/index';
import { ctx, canvas } from '../../core/utils/canvas';
import { CircleCollider } from '../../core/collision/colliders/index';
import {
  calculateAdjacentSide,
  calculateOppositeSide,
  mirrorAngleHorizontally,
  mirrorAngleVertically,
} from '../../core/utils/trigonometry';
import { primary, defaultColor } from '../config/colors';

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
   * @param {Game} game
   * @param {number} radius
   * @param {number} v
   * @param {number} angle
   */
  constructor({ x, y, game, radius, v, angle }) {
    super({ x, y });

    this.radius = radius;
    this.v = v;
    this.angle = angle;
    this._game = game;

    this.collider = new CircleCollider({ x, y, radius, name: 'Ball', object: this });
  }

  update(dt) {
    const { x, y, v, radius } = this;

    // Calculate initial coordinate changes
    let dx = calculateAdjacentSide({ angle: this.angle, hypotenuse: v }) * dt;
    let dy = -calculateOppositeSide({ angle: this.angle, hypotenuse: v }) * dt;

    this._checkPaddleCollision();
    this._checkBrickCollision();

    // Bounce off of walls
    if (x + dx < radius || x + dx > canvas.clientWidth - radius) {
      this.angle = mirrorAngleHorizontally(this.angle);
    }
    if (y + dy < radius) {
      this.angle = mirrorAngleVertically(this.angle);
    }

    // Recalculate the changes because we might have changed something (angle)
    dx = calculateAdjacentSide({ angle: this.angle, hypotenuse: v }) * dt;
    dy = -calculateOppositeSide({ angle: this.angle, hypotenuse: v }) * dt;

    // Collision with the floor - GameLoop Over
    if (y + dy > canvas.clientHeight - radius) {
      this._game.increaseReward(-1)
      this._game.gameOver();
    }

    this.x = x + dx;
    this.y = y + dy;

    this.collider.update({ x: this.x, y: this.y });
  }

  draw() {
    const { x, y, radius } = this;

    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = defaultColor;
  }

  /**
   * Check if there has been a collision with a Brick object. If there has been
   * a collision, bounce off of it and set the Brick as dead.
   */
  _checkBrickCollision() {
    if (this.collider.collidesWith('Brick')) {
      const { x, y } = this;

      const brick = this.collider.getCollisionWith('Brick');

      if (x >= brick.x && x <= brick.x + brick.width) {
        this.angle = mirrorAngleVertically(this.angle);
      } else if (y >= brick.y && y <= brick.y + brick.height) {
        this.angle = mirrorAngleHorizontally(this.angle);
      } else {
        // In the corner, we want to bounce back the way we came
        this.angle = mirrorAngleVertically(this.angle);
        this.angle = mirrorAngleHorizontally(this.angle);

        // TODO: Came from bot left, hit bot right corner?
      }

      this._game.increaseReward(.05);

      brick.die();
    }
  }

  /**
   * Check for collision with the Paddle.
   *
   * @private
   */
  _checkPaddleCollision() {
    if (this.collider.collidesWith('Paddle')) {
      const paddle = this.collider.getCollisionWith('Paddle');
      const hitPositionOnPaddle = Math.min(Math.max(this.x - paddle.x, 0), paddle._width);
      const percent = Math.max(1 - hitPositionOnPaddle / paddle._width, 0);
      // Flip the percent (1 - ...) so that the left is max and right is min

      const minAngle = Math.PI / 6;
      const maxAngle = Math.PI - minAngle;

      this.angle = percent * (maxAngle - minAngle) + minAngle;

      // TODO: What if it hits the corner/side?
      // TODO: Different angle depending on the paddle position
    }
  }
}

export default Ball;
