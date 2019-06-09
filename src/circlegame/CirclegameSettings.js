import { Settings } from '../core';

/**
 * @property {number} width
 * @property {number} height
 *
 * @property {number} ballRadius
 * @property {number} gravity
 * @property {number} flapHeight
 */
class CirclegameSettings extends Settings {
  getDefaultSettings() {
    return {
        width: 28,
        height: 28,
        ballRadius: 2,
    };
  }
}

export default CirclegameSettings;
