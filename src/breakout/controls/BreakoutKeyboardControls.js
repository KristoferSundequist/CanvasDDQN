import { KeyboardControls } from '../../core/controls/index';
import KEYS from '../../core/utils/keys';
import { LEFT, NO_ACTION, RIGHT } from '../actions';

/**
 * Breakout keyboard controls.
 */
class BreakoutKeyboardControls extends KeyboardControls {
  /**
   * Get the action for the next frame based on the keys currently held down.
   *
   * @returns {number}
   */
  getAction() {
    if (this._isKeyDown(KEYS.LEFT_ARROW)) {
      return LEFT;
    } else if (this._isKeyDown(KEYS.RIGHT_ARROW)) {
      return RIGHT;
    } else {
      return NO_ACTION;
    }
  }
}

export default BreakoutKeyboardControls;
