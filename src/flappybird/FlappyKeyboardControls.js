import { KeyboardControls } from '../core/controls/index';
import KEYS from '../core/utils/keys';
import { NO_ACTION, UP } from './actions';

/**
 * Flappy keyboard controls.
 */
class FlappyKeyboardControls extends KeyboardControls {
  /**
   * Get the action for the next frame based on the keys currently held down.
   *
   * @returns {number}
   */
  getAction() {
    if (this._isKeyDown(KEYS.UP_ARROW)) {
      return UP;
    } else {
      return NO_ACTION;
    }
  }
}

export default FlappyKeyboardControls;
