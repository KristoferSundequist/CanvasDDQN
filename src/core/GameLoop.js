import { ctx, canvas } from './utils/canvas';
import { timestamp, calculateDeltaTime } from './utils/timestamp';

/**
 * The main GameLoop class. Contains the game loop logic.
 *
 * @property {number} _dt - calculate timestamp difference in seconds
 * @property {number} _now
 * @property {number} _last
 * @property {number} _timeStep
 * @property {Game} _game
 */
class GameLoop {
  /**
   * @param {number} timeStep
   */
  constructor({ timeStep = 1 / 60 } = {}) {
    this._dt = 0;
    this._now = timestamp();
    this._last = this._now;
    this._timeStep = timeStep;
    this._game = null;

    this._frame = this._frame.bind(this);
  }

  /**
   * Start the game!
   */
  start() {
    requestAnimationFrame(this._frame);
  }

  /**
   * @param {Game} game
   */
  setGame(game) {
    this._game = game;
  }

  advanceOneFrame() {
    this._update(this._timeStep);

    this._draw();
  }

  /**
   * Trigger the update method on each game object. Also filters out all dead
   * game objects. Also triggers collision detection.
   *
   * @param {number} dt
   *
   * @private
   */
  _update(dt) {
    this._game.gameObjects = this._game.gameObjects.filter(object => !object.dead);

    this._game.gameObjects.forEach(object => object.update(dt));

    this._game.update(dt);
  }

  /**
   * Clear the canvas and trigger the draw method on every game object.
   *
   * @private
   */
  _draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    this._game.gameObjects.forEach(object => object.draw());
  }

  /**
   * This is one frame of the game loop. Calculates the delta time, updates
   * all game objects and draws them.
   *
   * @private
   */
  _frame() {
    this._now = timestamp();
    this._dt = this._dt + calculateDeltaTime(this._now, this._last);

    while (this._dt > this._timeStep && !this._game.isGameOver) {
      this._dt -= this._timeStep;
      this._update(this._timeStep);
    }

    this._draw();

    this._last = this._now;
    requestAnimationFrame(this._frame);
  }
}

export default GameLoop;
