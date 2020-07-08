let rows           = 11;
let columns        = 23;
let aspectRatio    = 16/9;
let triangleWidth  = 10;
let triangleHeight = 20;
let iteratorA      = 768;
let iteratorB      = 2048;
let drawIterator   = 0;
let iteratorX      = 0;
let iteratorY      = 0;
let maxChromaC     = 0;

function setup() {
	aspectRatio    = windowWidth / windowHeight;
	columns        = Math.ceil( windowWidth / 100 );
	rows           = Math.ceil( columns / aspectRatio );
	triangleWidth  = windowWidth / columns;
	triangleHeight = windowHeight / rows;
	iteratorX      = parseInt( columns/2 );
	iteratorY      = parseInt( rows/2 );
	createCanvas(windowWidth, windowHeight);
	background(0);
	frameRate(60);
	noStroke();
	fillCanvas();

	// noLoop();
}

function draw() {
	drawIterator += 1;
	drawHexagon();
	//drawSingle();
	moveDrawPoint();
}

function moveDrawPoint() {
	let positionsShifts = [-1, 0, 1];
	let xStartPoints = [0, 0, 2, Math.ceil( columns/2 ), columns - 2, columns, columns ];
	let yStartPoints = [0, 0, 2, Math.ceil( rows/2 ), rows - 2 , rows, rows ];

	iteratorX += random(positionsShifts);
	iteratorY += random(positionsShifts);

	if (iteratorX > columns+1 || iteratorX < -1) {
		iteratorX = random(xStartPoints);
	}

	if (iteratorY > rows+1 || iteratorY < -1) {
		iteratorY = random(yStartPoints);
	}
}

function drawTriangle(xPos, yPos) {
	triangle(xPos,yPos, xPos+triangleWidth/2,yPos+triangleHeight, xPos-triangleWidth/2,yPos+triangleHeight);
}

function drawInvertedTriangle(xPos, yPos) {
	triangle(xPos,yPos, xPos-triangleWidth/2,yPos+triangleHeight, xPos-triangleWidth,yPos);
}

function drawSingle() {
	let td = getTriangleData(iteratorX, iteratorY, 25, 33);
	let topOrBottom = [0, 1];

	if (random(topOrBottom) === 0) {
		setFillColor(td);
		drawTriangle(td.xPos, td.yPos);
	} else {
		setFillColor(td, 0.75, 25);
		drawInvertedTriangle(td.xPos, td.yPos);
	}
}

function drawHexagon() {
	let td = getTriangleData(iteratorX, iteratorY, 25, 33);

	// Top triangles
	setFillColor(td);
	drawTriangle(td.xPos, td.yPos);
	setFillColor(td, 0.75, 25);
	drawInvertedTriangle(td.xPos, td.yPos);

	td = getTriangleData(iteratorX-1, iteratorY, 50, 75);
	setFillColor(td);
	drawTriangle(td.xPos, td.yPos);

	// Bottom triangles
	td = getTriangleData(iteratorX-1, iteratorY+1, 50, 75);
	setFillColor(td);
	drawTriangle(td.xPos, td.yPos);
	setFillColor(td, 0.75, 25);
	drawInvertedTriangle(td.xPos, td.yPos);

	td = getTriangleData(iteratorX, iteratorY+1, 50, 75);
	setFillColor(td, 0.75, 25);
	drawInvertedTriangle(td.xPos, td.yPos);
}

function getXPos(x, y) {
	let xPos = x*triangleWidth;
	if (y%2 === 0) {
		xPos += (triangleWidth/2);
	}

	return xPos;
}

function getYPos(y) {
	return y*triangleHeight;
}

function getChromaA(seed) {
	return Math.ceil(seed*(256/rows));
}

function getChromaB(seed) {
	return Math.ceil(seed*(256/columns));
}

function getChromaC(seed) {
	return Math.ceil(seed*((255-columns)/rows));
}

function getOpacity(seedA, seedB, min, max) {
	return min+(seedA+seedB)%(max-min);
}

function getTriangleData(x, y, opacityMin, opacityMax) {
	return {
		xPos: getXPos(x, y),
		yPos: getYPos(y),
		chromaA: getChromaA(y),
		chromaB: getChromaB(x),
		chromaC: getChromaC(x+y),
		opacity: getOpacity(x, y, opacityMin, opacityMax),
	}
}

function setFillColor(td, saturationModifier = 1, opacityModifier = 0) {
	let pattern = Math.ceil(drawIterator/1000)%5;

	switch (pattern) {
		case 0:
			fill(
				td.chromaC*saturationModifier,
				td.chromaB*saturationModifier,
				td.chromaA*saturationModifier,
				td.opacity+opacityModifier,
			);
			break;
		case 1:
			fill(
				td.chromaA*saturationModifier,
				td.chromaC*saturationModifier,
				td.chromaB*saturationModifier,
				td.opacity+opacityModifier,
			);
			break;
		case 2:
			fill(
				td.chromaB*saturationModifier,
				td.chromaA*saturationModifier,
				td.chromaC*saturationModifier,
				td.opacity+opacityModifier,
			);
			break;
		case 3:
			fill(
				td.chromaA*saturationModifier,
				td.chromaB*saturationModifier,
				td.chromaC*saturationModifier,
				td.opacity+opacityModifier,
			);
			break;
		case 4:
			fill(
				td.chromaC*saturationModifier,
				td.chromaA*saturationModifier,
				td.chromaB*saturationModifier,
				td.opacity+opacityModifier,
			);
			break;
	}
}

function fillCanvas() {
	for (let y = 0; y < rows+1; y++) {
		iteratorA+=5;
		if (iteratorA > 2048) {
			iteratorA = 1;
		}

		for (let x = 0; x < columns+1; x++) {
			iteratorB+=7;
			if (iteratorB > 4096) {
				iteratorB = 1;
			}

			let xPos    = x*triangleWidth;
			let yPos    = y*triangleHeight;
			let chromaA = 128+((iteratorA*(xPos+y+1))%128);
			let chromaB = 128+((iteratorB*(yPos+x+1))%128);
			let chromaC = 128+((iteratorA*(yPos+xPos+1))%128);
			let opacity = 50+(iteratorA+iteratorB)%25;

			// Align the triangles base to base
			if (y%2 === 0) {
				xPos += (triangleWidth/2);
			}

			fill(chromaA,chromaB,chromaC,opacity);
			drawTriangle(xPos, yPos);

			fill(chromaA*0.75,chromaB*0.75,chromaC*0.75,opacity+25);
			drawInvertedTriangle(xPos, yPos);
		}
	}
}

function mousePressed() {
	loop();
}

function mouseReleased() {
	noLoop();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setup();
	loop();
}