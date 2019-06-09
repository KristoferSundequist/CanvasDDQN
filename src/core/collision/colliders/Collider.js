/**
 * Collider base class.
 *
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {Collider[]} _collisions
 * @property {GameObject} object
 */
class Collider {

  constructor({ name, x, y, object }) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.object = object;

    this._collisions = [];
  }

  update({ x = this.x, y = this.y }) {
    this.x = x;
    this.y = y;

    this._collisions = [];
  }

  /**
   * Check if this Collider is colliding with another.
   *
   * @param {Collider} other
   *
   * @return {boolean}
   */
  isColliding(other) {
    throw new Error('Not implemented: isColliding!');
  }

  /**
   * This collider is colliding with another.
   *
   * @param {Collider} other
   */
  collide(other) {
    this._collisions.push(other);
  }

  /**
   * Check if this collider collides with any colliders with the given name.
   *
   * @param {string} colliderName
   *
   * @returns {boolean}
   */
  collidesWith(colliderName) {
    return this._collisions
      .filter(collider => collider.name === colliderName)
      .length !== 0
  }


  /**
   * Get the first collider that this collider collides with.
   *
   * @param colliderName
   *
   * @returns {GameObject}
   */
  getCollisionWith(colliderName) {
    return this._collisions
      .filter(collider => collider.name === colliderName)[0].object;
  }
}

export default Collider;
