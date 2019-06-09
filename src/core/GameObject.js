/**
 * @property {number} x
 * @property {number} y
 * @property {Collider|null} collider
 * @property {boolean} dead
 */
class GameObject {
  /**
   * @param {number} x
   * @param {number} y
   * @param {boolean} dead
   */
  constructor({ x, y, dead = false }) {
    this.x = x;
    this.y = y;
    this.dead = dead;

    this.collider = null;
  }

  /**
   * Update the properties and values on this GameLoop Object.
   *
   * @param {number} dt - delta time
   */
  update(dt) {
    console.error('Update not implemented!');
  }

  /**
   * Draw this GameLoop Object to the screen. This must not modify any
   * properties on this object.
   */
  draw() {
    console.error('Draw not implemented!');
  }

  /**
   * Kill this object, objects with dead = true are removed from the game
   * objects list.
   */
  die() {
    this.dead = true;
  }
}

export default GameObject;
