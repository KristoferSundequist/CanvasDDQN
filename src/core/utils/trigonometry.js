/**
 * Calculate the opposite side of a triangle given an angle (in radians) and the
 * length of a hypotenuse.
 *
 * @param {number} angle
 * @param {number} hypotenuse
 *
 * @returns {number}
 */
export const calculateOppositeSide = ({ angle, hypotenuse }) =>
  Math.sin(angle) * hypotenuse;

/**
 * Calculate the adjacent side of a triangle given an angle (in radians) and the
 * length of a hypotenuse.
 *
 * @param {number} angle
 * @param {number} hypotenuse
 *
 * @returns {number}
 */
export const calculateAdjacentSide = ({ angle, hypotenuse }) =>
  Math.cos(angle) * hypotenuse;

/**
 * Mirror the angle horizontally to simulate reflecting on a vertical wall.
 */
export const mirrorAngleHorizontally = (angle) => {
  angle = -angle + Math.PI;
  if (angle < 0) {
    angle = (angle % (Math.PI * 2)) + Math.PI * 2
  }

  return angle;
};

/**
 * Mirror the angle vertically to simulate reflecting on a horizontal wall.
 */
export const mirrorAngleVertically = (angle) => {
  angle = -angle;
  if (angle < 0) {
    angle = (angle % (Math.PI * 2)) + Math.PI * 2;
  }

  return angle;
};
