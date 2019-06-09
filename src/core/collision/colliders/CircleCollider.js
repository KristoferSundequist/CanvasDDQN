import Collider from './Collider';
import RectangleCollider from './RectangleCollider';

class CircleCollider extends Collider {
    constructor({ x, y, name, radius, object }) {
        super({ x, y, name, object });

        this.radius = radius;
    }

    update({ x = this.x, y = this.y, radius = this.radius }) {
        super.update({ x, y });

        this.radius = radius;
    }

    isColliding(other) {
        if (other instanceof RectangleCollider) {
            // From https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
            const rectCenter = other.center();
            const circleDistanceX = Math.abs(rectCenter.x - this.x);
            const circleDistanceY = Math.abs(rectCenter.y - this.y);

            if (circleDistanceX > (other.width / 2 + this.radius)) return false;
            if (circleDistanceY > (other.height / 2 + this.radius)) return false;

            if (circleDistanceX <= (other.width / 2)) return true;
            if (circleDistanceY <= (other.height / 2)) return true;

            const cornerDistanceSq = (circleDistanceX - other.width / 2) ^ 2 + (circleDistanceY - other.height / 2) ^ 2;

            return cornerDistanceSq <= this.radius ^ 2;
        }else if(other instanceof CircleCollider){
            return this.radius + other.radius > Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2)
        }
        

        return false;
    }
}

export default CircleCollider;
