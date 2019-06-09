/**
 * "Interface" for Controls. Can be implemented by keyboard controls, mouse
 * controls or REINFORCEMENT LEARNING controls, etc.
 *
 * A Controls object is injected into the Game.
 *
 * @interface
 */
class Controls {
  /**
   * Make a move for this frame. Return action for making that move.
   *
   * This could receive some game stats if needed later (for machine learning).
   * Also, after making a move, it could somehow receive a reward.
   *
   * @returns {number}
   *
   * @abstract
   */
  getAction() {
    throw new Error('makeMove not implemented!');
  }
}

export default Controls;
