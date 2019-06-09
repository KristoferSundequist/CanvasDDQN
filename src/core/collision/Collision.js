class Collision {
  /**
   * Detect collision between the given GameObject objects.
   *
   * @param {GameObject[]} gameObjects
   */
  detect(gameObjects) {
    for (let i = 0; i < gameObjects.length; i++) {
      for (let j = i + 1; j < gameObjects.length; j++) {
        const a = gameObjects[i];
        const b = gameObjects[j];

        const aCollider = a.collider;
        const bCollider = b.collider;

        if (aCollider.isColliding(bCollider)) {
          aCollider.collide(bCollider);
          bCollider.collide(aCollider);
        }
      }
    }
  }
}

export default Collision;
