import { Settings } from '../core';

/**
 * @property {number} width
 * @property {number} height
 *
 * @property {number} ballRadius
 * @property {number} ballVelocity
 * @property {number} ballInitialAngle
 *
 * @property {number} brickRowCount
 * @property {number} brickColumnCount
 * @property {number} brickHeight
 * @property {number} brickPadding
 * @property {number} brickOffsetTop
 * @property {number} brickOffsetLeft
 *
 * @property {number} paddleWidth
 * @property {number} paddleHeight
 * @property {number} paddleVelocity
 */
class BreakoutSettings extends Settings {
  getDefaultSettings() {
    return {
      ...super.getDefaultSettings(),
      ballRadius: 1,
      ballVelocity: 50,

      brickRowCount: 3,
      brickColumnCount: 5,
      brickHeight: 3,
      brickPadding: 2,
      brickOffsetTop: 3,
      brickOffsetLeft: 3,

      paddleWidth: 15,
      paddleHeight: 2,
      paddleVelocity: 100,
    };
  }
}

export default BreakoutSettings;
