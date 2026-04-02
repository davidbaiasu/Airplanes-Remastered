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
                break;

            case Direction.EAST:
                if (j - 3 < 0 || i - 2 < 0 || i + 2 >= grid.length) {
                    return false;
                }
                break;

            case Direction.SOUTH:
                if (i - 3 < 0 || j - 2 < 0 || j + 2 >= grid[0].length) {
                    return false;
                }
                break;

            case Direction.WEST:
                if (j + 3 >= grid[0].length || i - 2 < 0 || i + 2 >= grid.length) {
                    return false;
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

        const cellsToFill = [[i, j, 2]];

        switch (dir) {
            case Direction.NORTH:
                for (let k = j - 2; k <= j + 2; k++) {
                    cellsToFill.push([i + 1, k, 1]);
                }
                cellsToFill.push([i + 2, j, 1]);
                for (let k = j - 1; k <= j + 1; k++) {
                    cellsToFill.push([i + 3, k, 1]);
                }
                break;

            case Direction.EAST:
                for (let k = i - 2; k <= i + 2; k++) {
                    cellsToFill.push([k, j - 1, 1]);
                }
                cellsToFill.push([i, j - 2, 1]);
                for (let k = i - 1; k <= i + 1; k++) {
                    cellsToFill.push([k, j - 3, 1]);
                }
                break;

            case Direction.SOUTH:
                for (let k = j - 2; k <= j + 2; k++) {
                    cellsToFill.push([i - 1, k, 1]);
                }
                cellsToFill.push([i - 2, j, 1]);
                for (let k = j - 1; k <= j + 1; k++) {
                    cellsToFill.push([i - 3, k, 1]);
                }
                break;

            case Direction.WEST:
                for (let k = i - 2; k <= i + 2; k++) {
                    cellsToFill.push([k, j + 1, 1]);
                }
                cellsToFill.push([i, j + 2, 1]);
                for (let k = i - 1; k <= i + 1; k++) {
                    cellsToFill.push([k, j + 3, 1]);
                }
                break;

            default:
                throw new Error("Invalid direction value.");
        }

        for (const [row, col] of cellsToFill) {
            if (grid[row][col] !== 0) {
                return false;
            }
        }

        for (const [row, col, value] of cellsToFill) {
            grid[row][col] = value;
        }

        return true;

    }

}