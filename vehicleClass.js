class Vehicle {

    headX = 0;
    headY = 0;
    direction = Direction.NORTH;

    constructor(headX, headY, direction) {
        if (new.target === Vehicle) {
            throw new Error("Vehicle is an abstract class.");
        }

        if (!Object.values(Direction).includes(direction)) {
            throw new Error("Invalid direction value.");
        }

        this.headX = headX;
        this.headY = headY;
        this.direction = direction;
    }

    changeAttributes(headX, headY, direction) {
        if (!Object.values(Direction).includes(direction)) {
            throw new Error("Invalid direction value.");
        }
        this.headX = headX;
        this.headY = headY;
        this.direction = direction;
    }

    rotateVehicle() {
        this.direction = (this.direction + 1) % 4;
    }

}
