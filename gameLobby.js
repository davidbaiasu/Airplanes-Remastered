const ROWS = 10;
const COLS = 10;

const tableElement = document.getElementById("id-table-game");
const flyingPlaneElement = document.getElementById("id-div-flying-plane");

const params = new URLSearchParams(window.location.search);
const rawRoomCode = params.get("room") || "";
const roomCode = rawRoomCode.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4);
const room = new Room(roomCode);

// --- Direction helpers ---

const directionToRotation = {
    [Direction.NORTH]: 0,
    [Direction.EAST]:  90,
    [Direction.SOUTH]: 180,
    [Direction.WEST]:  270,
};

const rotationToDirection = {
    0:   Direction.NORTH,
    90:  Direction.EAST,
    180: Direction.SOUTH,
    270: Direction.WEST,
};

// Offset from the clicked cell to the plane head (cursor is at the center of the plane shape)
const headOffset = {
    [Direction.NORTH]: [-1,  0],  // [rowOffset, colOffset]
    [Direction.EAST]:  [ 0, +1],
    [Direction.SOUTH]: [+1,  0],
    [Direction.WEST]:  [ 0, -1],
};

// --- Initial planes ---

const planes = [
    new Plane(1, 3, Direction.NORTH),
    new Plane(1, 8, Direction.NORTH),
    new Plane(6, 5, Direction.NORTH),
];

planes.forEach(p => p.placeOnGrid(room.myGrid));

// --- State ---

let flyingPlane   = null;
let flyingRotation = 0; // degrees: 0=N, 90=E, 180=S, 270=W

// --- Grid rendering ---

const cellColorMap = {
    [GridParts.EMPTY]: "",
    [GridParts.BODY]:  "#5ba4d4",
    [GridParts.HEAD]:  "#1870a3",
};

function updateHTMLTable(grid) {
    for (let i = 1; i <= ROWS; i++) {
        for (let j = 1; j <= COLS; j++) {
            const cell = document.getElementById(`id_cell_${i}_${j}`);
            cell.style.backgroundColor = cellColorMap[grid[i][j]];
        }
    }
}

// --- Table creation ---

function createHTMLTable(tableElement, rows, cols) {
    for (let i = 1; i <= rows; i++) {
        const newRow = document.createElement("tr");
        for (let j = 1; j <= cols; j++) {
            const newCell = document.createElement("td");
            newCell.id = `id_cell_${i}_${j}`;
            newCell.classList.add("cell");
            newRow.appendChild(newCell);
        }
        tableElement.appendChild(newRow);
    }
}

createHTMLTable(tableElement, ROWS, COLS);
updateHTMLTable(room.myGrid);

// --- Click handler: pick up or place ---

tableElement.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;

    const parts  = e.target.id.split("_");
    const clickI = parseInt(parts[2]);
    const clickJ = parseInt(parts[3]);

    if (flyingPlane !== null) {
        // Place the flying plane
        const dir = rotationToDirection[flyingRotation];
        const [rowOff, colOff] = headOffset[dir];
        const headI = clickI + rowOff;
        const headJ = clickJ + colOff;

        flyingPlane.changeAttributes(headI, headJ, dir);

        if (flyingPlane.placeOnGrid(room.myGrid)) {
            flyingPlane = null;
            flyingRotation = 0;
            flyingPlaneElement.style.display = "none";
            updateHTMLTable(room.myGrid);
        }
        // placement failed: keep flying
        return;
    }

    // Pick up a plane by clicking its HEAD cell
    if (room.myGrid[clickI][clickJ] === GridParts.HEAD) {
        const plane = planes.find(p => p.headX === clickI && p.headY === clickJ);
        if (plane) {
            plane.removeFromGrid(room.myGrid);
            flyingPlane    = plane;
            flyingRotation = directionToRotation[plane.direction];
            flyingPlaneElement.style.transform = `rotate(${flyingRotation}deg)`;
            flyingPlaneElement.style.display   = "block";
            moveFlyingPlane(e.pageX, e.pageY);
            updateHTMLTable(room.myGrid);
        }
    }
});

// --- Mouse tracking ---

document.addEventListener("mousemove", (e) => {
    if (flyingPlane !== null) {
        moveFlyingPlane(e.pageX, e.pageY);
    }
});

function moveFlyingPlane(x, y) {
    const offsetX = flyingPlaneElement.offsetWidth  * 0.5;
    const offsetY = flyingPlaneElement.offsetHeight * 0.5;
    flyingPlaneElement.style.left = (x - offsetX) + "px";
    flyingPlaneElement.style.top  = (y - offsetY) + "px";
}

// --- Rotate with R key ---

window.addEventListener("keydown", (e) => {
    if ((e.key === "r" || e.key === "R") && flyingPlane !== null) {
        flyingRotation = (flyingRotation + 90) % 360;
        flyingPlaneElement.style.transform = `rotate(${flyingRotation}deg)`;
    }
});

// --- Rotate with right-click ---

document.addEventListener("contextmenu", (e) => {
    if (flyingPlane !== null) {
        e.preventDefault();
        flyingRotation = (flyingRotation + 90) % 360;
        flyingPlaneElement.style.transform = `rotate(${flyingRotation}deg)`;
    }
});

