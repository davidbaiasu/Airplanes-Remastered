class Plane extends Vehicle {

    constructor(headX, headY, direction) {
        super(headX, headY, direction);
    }

    attemptPlacement(grid) {

        const i = this.headX;
        const j = this.headY;
        const dir = this.direction;

        switch (dir) {

            case Direction.NORTH:
                if (i + 3 >= grid.length || j - 2 < 0 || j + 2 >= grid[0].length) {
                    return false;
                }

                if (grid[i][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = j - 2; k <= j + 2; k++) {
                    if (grid[i + 1][k] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                if (grid[i + 2][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = j - 1; k <= j + 1; k++) {
                    if (grid[i + 3][k] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                break;

            case Direction.EAST:
                if (j - 3 < 0 || i - 2 < 0 || i + 2 >= grid.length) {
                    return false;
                }

                if (grid[i][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = i - 2; k <= i + 2; k++) {
                    if (grid[k][j - 1] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                if (grid[i][j - 2] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = i - 1; k <= i + 1; k++) {
                    if (grid[k][j - 3] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                break;

            case Direction.SOUTH:
                if (i - 3 < 0 || j - 2 < 0 || j + 2 >= grid[0].length) {
                    return false;
                }

                if (grid[i][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = j - 2; k <= j + 2; k++) {
                    if (grid[i - 1][k] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                if (grid[i - 2][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = j - 1; k <= j + 1; k++) {
                    if (grid[i - 3][k] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                break;

            case Direction.WEST:
                if (j + 3 >= grid[0].length || i - 2 < 0 || i + 2 >= grid.length) {
                    return false;
                }

                if (grid[i][j] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = i - 2; k <= i + 2; k++) {
                    if (grid[k][j + 1] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                if (grid[i][j + 2] !== GridParts.EMPTY) {
                    return false;
                }
                for (let k = i - 1; k <= i + 1; k++) {
                    if (grid[k][j + 3] !== GridParts.EMPTY) {
                        return false;
                    }
                }
                break;

            default:
                throw new Error("Invalid direction value.");

        }

        return true;
    
    }

    placeOnGrid(grid) {

        const i = this.headX;
        const j = this.headY;
        const dir = this.direction;

        if (!this.attemptPlacement(grid)) {
            return false;
        }

        switch (dir) {

            case Direction.NORTH:
                for (let k = j - 2; k <= j + 2; k++) {
                    grid[i + 1][k] = GridParts.BODY;
                }
                grid[i + 2][j] = GridParts.BODY;
                for (let k = j - 1; k <= j + 1; k++) {
                    grid[i + 3][k] = GridParts.BODY;
                }
                grid[i][j] = GridParts.HEAD;
                break;

            case Direction.EAST:
                for (let k = i - 2; k <= i + 2; k++) {
                    grid[k][j - 1] = GridParts.BODY;
                }
                grid[i][j - 2] = GridParts.BODY;
                for (let k = i - 1; k <= i + 1; k++) {
                    grid[k][j - 3] = GridParts.BODY;
                }
                grid[i][j] = GridParts.HEAD;
                break;

            case Direction.SOUTH:
                for (let k = j - 2; k <= j + 2; k++) {
                    grid[i - 1][k] = GridParts.BODY;
                }
                grid[i - 2][j] = GridParts.BODY;
                for (let k = j - 1; k <= j + 1; k++) {
                    grid[i - 3][k] = GridParts.BODY;
                }
                grid[i][j] = GridParts.HEAD;
                break;

            case Direction.WEST:
                for (let k = i - 2; k <= i + 2; k++) {
                    grid[k][j + 1] = GridParts.BODY;
                }
                grid[i][j + 2] = GridParts.BODY;
                for (let k = i - 1; k <= i + 1; k++) {
                    grid[k][j + 3] = GridParts.BODY;
                }
                grid[i][j] = GridParts.HEAD;
                break;

            default:
                throw new Error("Invalid direction value.");
                
        }

        return true;

    }

}