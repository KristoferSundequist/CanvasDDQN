import Controls from './Controls';

/**
 * Keyboard controls where pressing the left or right arrow keys triggers
 * movement.
 *
 * @abstract
 */
class KeyboardControls extends Controls {
  constructor() {
    super();

    this.keys = {};

    this._registerListeners();
  }

  /**
   * Register event listeners.
   *
   * @private
   */
  _registerListeners() {
    window.addEventListener('keydown', e => {
      this.keys[e.keyCode] = true;
    });

    window.addEventListener('keyup', e => {
      this.keys[e.keyCode] = false;
    });
  }

  /**
   * Check if the key with the given key code is pressed down currently.
   *
   * @param {number} keyCode
   *
   * @returns {boolean}
   *
   * @protected
   */
  _isKeyDown(keyCode) {
    return this.keys.hasOwnProperty(keyCode) ? this.keys[keyCode] : false;
  }
}

export default KeyboardControls;
