import { canvas } from '../../core/utils/canvas';
import { Brick } from '../gameObjects';

/**
 * Calculates the width of one brick using values from the imported
 * configuration file.
 *
 * @param {number} brickOffsetLeft
 * @param {number} brickColumnCount
 * @param {number} brickPadding
 *
 * @returns {number}
 */
export const brickWidth = ({
                             brickOffsetLeft,
                             brickColumnCount,
                             brickPadding,
                           }) =>
  (
    canvas.clientWidth
    - (2 * brickOffsetLeft)
    - ((brickColumnCount - 1) * brickPadding)
  ) / brickColumnCount;

/**
 * Generate the bricks at the start of the game. Using values from the imported
 * configuration file.
 *
 * @param {number} brickColumnCount
 * @param {number} brickRowCount
 * @param {number} brickPadding
 * @param {number} brickHeight
 * @param {number} brickOffsetLeft
 * @param {number} brickOffsetTop
 *
 * @returns {Brick[]}
 */
export const generateBricks = ({
                                 brickColumnCount,
                                 brickRowCount,
                                 brickPadding,
                                 brickHeight,
                                 brickOffsetLeft,
                                 brickOffsetTop,
                               }) => {
  const bw = brickWidth({ brickOffsetLeft, brickColumnCount, brickPadding });

  const bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks.push(new Brick({
        x: (c * (bw + brickPadding)) + brickOffsetLeft,
        y: (r * (brickHeight + brickPadding)) + brickOffsetTop,
        width: bw,
        height: brickHeight,
      }));
    }
  }

  return bricks;
};
