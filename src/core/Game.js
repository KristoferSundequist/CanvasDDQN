import { Controls, ProgrammaticControls } from './controls';
import GameLoop from './GameLoop';
import { Collision } from './collision';
import Settings from './Settings';
import { resizeCanvas } from './utils/canvas';

/**
 * @property {GameObject[]} gameObjects
 * @property {boolean} isGameOver;
 * @property {GameLoop} _gameLoop
 * @property {Collision} _collision
 * @property {Controls} _controls
 * @property {Settings} _settings
 * @property {number} _reward
 */
class Game {
  /**
   * @param {GameLoop} gameLoop
   * @param {Collision} collision
   * @param {Controls} controls
   * @param {Settings} settings
   */
  constructor({
                gameLoop = new GameLoop(),
                collision = new Collision(),
                controls = new ProgrammaticControls(),
                settings = new Settings(),
              } = {}) {
    this._gameLoop = gameLoop;
    this._gameLoop.setGame(this);
    this._collision = collision;
    this._controls = controls;
    this._settings = settings;

    this.gameObjects = [];
    this.isGameOver = false;
    this._reward = 0;

    resizeCanvas(settings.width, settings.height);
  }

  /**
   * Start the game.
   */
  start() {
    this._gameLoop.start();
  }

  /**
   * Reset the game to the starting position.
   */
  reset() {
    this.gameObjects = [];
    this.isGameOver = false;
    this._reward = 0;
  }

  /**
   * End the game. Feel free to override if this functionality is not enough.
   */
  gameOver() {
    this.isGameOver = true;
  }

  /**
   * Called after all game objects have been updated. Feel free to override if
   * something else needs to be done here.
   *
   * @param {number} dt
   */
  update(dt) {
      this._collision.detect(this.gameObjects);

      if (this.isWon()) {
          this.handleWin();
      }
  }

  /**
   * @param {number} action
   * @returns {[number, boolean]} reward terminal
  */

  step(action) {
    this._reward = 0;

    if (this._controls instanceof ProgrammaticControls) {
      this._controls.setAction(action);
    }

    this._gameLoop.advanceOneFrame();

    const terminal = this.isGameOver || this.isWon()

    if (terminal) {
      const finalReward = this._reward
      this.reset()
      return [finalReward, terminal]
    }

    return [this._reward, terminal];
  }

  /**
   * Increase the reward gained for the current frame.
   *
   * @param {number} amount
   */
  increaseReward(amount) {
    this._reward += amount;
  }

  /**
   * Check if the currently active game has been won.
   *
   * @return {boolean}
   */
  isWon() {
    return false;
  }

  /**
   * Handle the winning of the game. Will just reset the game for now, if more
   * functionality is needed, it can be overridden.
   */
  handleWin() {
    if (!this._controls instanceof ProgrammaticControls) {
      this.start();
    }
  }
}

export default Game;
