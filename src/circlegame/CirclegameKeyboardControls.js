import { KeyboardControls } from '../core/controls/index';
import KEYS from '../core/utils/keys';
import { NO_ACTION, UP, DOWN, LEFT, RIGHT } from './actions';

/**
 * Flappy keyboard controls.
 */
class CirclegameKeyboardControls extends KeyboardControls {
    /**
     * Get the action for the next frame based on the keys currently held down.
     *
     * @returns {number}
     */
    getAction() {
        if (this._isKeyDown(KEYS.UP_ARROW)) {
            return UP;
        }
        else if (this._isKeyDown(KEYS.DOWN_ARROW)) {
            return DOWN;
        }
        else if (this._isKeyDown(KEYS.LEFT_ARROW)) {
            return LEFT;
        }
        else if (this._isKeyDown(KEYS.RIGHT_ARROW)) {
            return RIGHT;
        }
        else {
            return NO_ACTION;
        }
    }
}

export default CirclegameKeyboardControls;
