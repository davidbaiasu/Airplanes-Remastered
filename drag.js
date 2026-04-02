const tableElement = document.getElementById('id_table');
const planeElement = document.getElementById('id_img_plane');
const parkDiv = document.getElementById('id_div_park');

const ROWS = 10;
const COLS = 10;

const rotationToDirection = {
	0: 'north',
	90: 'east',
	180: 'south',
	270: 'west'
};

tableElement.addEventListener('click', (e) => {
	
	if (e.target.classList.contains('cell') && isFollowing === true && planeCount < 3 ) {
		
		const cellID = e.target.id;
		console.log("Clicked on cell: " + cellID);
		const parts = cellID.split('_');
		const tempI = parseInt(parts[2]);
		const tempJ = parseInt(parts[3]);
			
		const direction = rotationToDirection[rotation];
		const offsetPlace = {
			'north': [0, -1],
			'east': [1, 0],
			'south': [0, 1],
			'west': [-1, 0]
		};
			
		let offsetX, offsetY;
		[offsetX, offsetY] = offsetPlace[direction];
			
		if( isValidPlanePlacement(grid,tempI+offsetY,tempJ+offsetX,direction) ){
			placePlane(grid,tempI+offsetY,tempJ+offsetX,direction);
		}
		
		updateHTMLTable(grid);
		
		snapPlaneImageBack();
		if( planeCount == 3 ){
			removePlaneImage();
		}
		
	}
	
});

function snapPlaneImageBack(){
	
	isFollowing = false;
            
	planeElement.style.left = ''; 
	planeElement.style.top = '';
            
	rotation = 0;
	planeElement.style.transform = `rotate(0deg)`;
		
}

function removePlaneImage(){
	
	planeElement.style.display = 'none';
	parkDiv.style.cursor = 'default';
	
}

let isFollowing = false;

// 1. Click the grey box to pick up the plane
parkDiv.addEventListener('click', (e) => {
    isFollowing = true;
    
    // Move it immediately to where you clicked so it doesn't "jump" from (0,0)
    movePlane(e.pageX, e.pageY);
});

window.addEventListener('keydown', (event) => {
	
	if( event.key === 'r' || event.key === 'R' ){
		rotatePlane();
	}
	
});

function rotatePlane() {
	
	if( isFollowing === true ){
		rotation = (rotation + 90) % 360;
		planeElement.style.transform = `rotate(${rotation}deg)`;
	}
  
}

// 2. Follow the mouse
document.addEventListener('mousemove', (e) => {
    if (isFollowing) {
        movePlane(e.pageX, e.pageY);
    }
});

// Helper function to handle the math
function movePlane(x, y) {
    const offsetX = planeElement.offsetWidth * 0.5;
    const offsetY = planeElement.offsetHeight * 0.4;
    planeElement.style.left = (x - offsetX) + 'px';
    planeElement.style.top = (y - offsetY) + 'px';
}

function createHTMLTable(tableElement, ROWS, COLS){
    for( let i = 1; i <= ROWS; i++ ){
        let newRow = document.createElement('tr');
        for( let j = 1; j <= COLS; j++ ){
            let newCell = document.createElement('td');
            newCell.id = `id_cell_${i}_${j}`;
            newCell.classList.add("cell");
            //newCell.innerHTML = '0';
            newRow.appendChild(newCell);
        }
        tableElement.appendChild(newRow);
    }
}

///--------------------------------------------------

let rotation = 0;
let planeCount = 0;
let grid = [

	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0]

];

createHTMLTable(tableElement, ROWS, COLS);

///---------------------------------------------------

function placePlane(grid, i, j, dir){
	
	planeCount++;
	grid[i][j] = 2;
	let bodyValue = 1;
	
	switch(dir){
		
		case 'north':
		
			for( let k = j - 2; k <= j + 2; k++ ){
				grid[i+1][k] = bodyValue;
			}
			grid[i+2][j] = bodyValue;
			for( let k = j - 1; k <= j + 1; k++ ){
				grid[i+3][k] = bodyValue;
			}
			break;
			
		case 'east':
			
			for( let k = i - 2; k <= i + 2; k++ ){
				grid[k][j-1] = bodyValue;
			}
			grid[i][j-2] = bodyValue;
			for( let k = i - 1; k <= i + 1; k++ ){
				grid[k][j-3] = bodyValue;
			}
			break;
			
		case 'south':
			
			for (let k = j - 2; k <= j + 2; k++){ 
				grid[i - 1][k] = bodyValue;
			}
			grid[i - 2][j] = bodyValue;
			for (let k = j - 1; k <= j + 1; k++){
				grid[i - 3][k] = bodyValue;
			}
			break;
			
		case 'west':
		
			for (let k = i - 2; k <= i + 2; k++){
				grid[k][j + 1] = bodyValue;
			}
			grid[i][j + 2] = bodyValue;
			for (let k = i - 1; k <= i + 1; k++){
				grid[k][j + 3] = bodyValue;
			}
			break;
			
		default:
			console.log("Error: placePlane() unknown direction");
	}
	
}

function unplacePlane(grid, i, j, dir) {
	
	grid[i][j] = 0;
	
	switch(dir) {
		
		case 'north':
			for (let k = j - 2; k <= j + 2; k++) {
				grid[i + 1][k] = 0;
			}
			grid[i + 2][j] = 0;
			for (let k = j - 1; k <= j + 1; k++) {
				grid[i + 3][k] = 0;
			}
			break;
			
		case 'east':
			for (let k = i - 2; k <= i + 2; k++) {
				grid[k][j - 1] = 0;
			}
			grid[i][j - 2] = 0;
			for (let k = i - 1; k <= i + 1; k++) {
				grid[k][j - 3] = 0;
			}
			break;
			
		case 'south':
			for (let k = j - 2; k <= j + 2; k++) {
				grid[i - 1][k] = 0;
			}
			grid[i - 2][j] = 0;
			for (let k = j - 1; k <= j + 1; k++) {
				grid[i - 3][k] = 0;
			}
			break;
			
		case 'west':
			for (let k = i - 2; k <= i + 2; k++) {
				grid[k][j + 1] = 0;
			}
			grid[i][j + 2] = 0;
			for (let k = i - 1; k <= i + 1; k++) {
				grid[k][j + 3] = 0;
			}
			break;
	}
	
	planeCount--; 
}

function isValidPlanePlacement(grid, i, j, dir){ // boolean

	if ( i < 1 || i > 10 || j < 1 || j > 10 ){
		return false;
	}

	if ( grid[i][j] != 0 )
		return false;

	switch (dir){

		case 'north':
		
			if ( i > 7 || j < 3 || j > 8 )
				return false;

			for ( let k = j - 2; k <= j + 2; k++ ) {
				if ( grid[i + 1][k] != 0 )
					return false;
			}
			if ( grid[i + 2][j] != 0 )
				return false;
			for ( let k = j - 1; k <= j + 1; k++ ) {
				if ( grid[i + 3][k] != 0 )
					return false;
			}
			break;

		case 'south':
		
			if ( i < 4 || j < 3 || j > 8 )
				return false;

			for ( let k = j - 2; k <= j + 2; k++ ) {
				if ( grid[i - 1][k] != 0 )
					return false;
			}
			if ( grid[i - 2][j] != 0 )
				return false;
			for ( let k = j - 1; k <= j + 1; k++ ) {
				if ( grid[i - 3][k] != 0 )
					return false;
			}
			break;

		case 'east':
		
			if ( j < 4 || i < 3 || i > 8 )
				return false;

			for ( let k = i - 2; k <= i + 2; k++ ) {
				if ( grid[k][j - 1] != 0 )
					return false;
			}
			if ( grid[i][j - 2] != 0 )
				return false;
			for ( let k = i - 1; k <= i + 1; k++ ) {
				if ( grid[k][j - 3] != 0 )
					return false;
			}
			break;

		case 'west':
		
			if ( j > 7 || i < 3 || i > 8 )
				return false;

			for ( let k = i - 2; k <= i + 2; k++ ) {
				if ( grid[k][j + 1] != 0 )
					return false;
			}
			if ( grid[i][j + 2] != 0 )
				return false;
			for ( let k = i - 1; k <= i + 1; k++ ) {
				if ( grid[k][j + 3] != 0 )
					return false;
			}
			break;

		default:
			console.log("Error: placePlane() unknown direction");
			return false;
	}

	return true;
}

///--------------------------------------------------------

const colorMap = {
	
	0: 'white',
	1: 'red',
	2: 'darkred'
	
};

function updateHTMLTable(grid){
	
	for( let i = 1; i <= ROWS; i++ ){
		for( let j = 1; j <= COLS; j++ ){
			const cell = document.getElementById(`id_cell_${i}_${j}`);
			cell.style.backgroundColor = colorMap[grid[i][j]];
		}
	}
	
}