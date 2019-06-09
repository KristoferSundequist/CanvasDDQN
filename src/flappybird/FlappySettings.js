import { Settings } from '../core';

/**
 * @property {number} width
 * @property {number} height
 *
 * @property {number} ballRadius
 * @property {number} gravity
 * @property {number} flapHeight
 */
class FlappySettings extends Settings {
  getDefaultSettings() {
    return {
        width: 28,
        height: 28,
        ballRadius: 1,
        gravity: .05,
        flapHeight: -0.5,
        rectWidth: 5,
        rectHeight: 15,
        rectVelocity: .4
    };
  }
}

export default FlappySettings;
