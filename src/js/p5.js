let rows           = 11;
let columns        = 23;
let aspectRatio    = 16/9;
let triangleWidth  = 10;
let triangleHeight = 20;
let iteratorA      = 768;
let iteratorB      = 2048;
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
	let xPos        = iteratorX*triangleWidth;
	let yPos        = iteratorY*triangleHeight;
	let chromaA     = Math.ceil(iteratorY*(256/rows));
	let chromaB     = Math.ceil(iteratorX*(256/columns));
	let chromaC     = Math.ceil(iteratorX+iteratorY*((255-columns)/rows));
	let opacity     = 50+(iteratorX+iteratorY)%25;
	let topOrBottom = [0, 1];

	if (iteratorY%2 === 0) {
		xPos += (triangleWidth/2);
	}

	if (chromaC > maxChromaC) {
		maxChromaC = chromaC;
	}

	if (random(topOrBottom) === 0) {
		fill(chromaA,chromaB,chromaC,opacity);
		drawTriangle(xPos, yPos);
	} else {
		fill(chromaC*0.75,chromaB*0.75,chromaA*0.75,25+opacity);
		drawInvertedTriangle(xPos, yPos);
	}

	moveDrawPoint();
}

function moveDrawPoint() {
	let positionsShifts = [-1, 0, 1];
	let xStartPoints = [0, 0, 2, Math.ceil( columns/2 ), columns - 2, columns, columns ];
	let yStartPoints = [0, 0, 2, Math.ceil( rows/2 ), rows - 2 , rows, rows ];

	iteratorX += random(positionsShifts);
	iteratorY += random(positionsShifts);

	if (iteratorX > columns || iteratorX < 0) {
		iteratorX = random(xStartPoints);
	}

	if (iteratorY > rows || iteratorY < 0) {
		iteratorY = random(yStartPoints);
	}
}

function drawTriangle(xPos, yPos) {
	triangle(xPos,yPos, xPos+triangleWidth/2,yPos+triangleHeight, xPos-triangleWidth/2,yPos+triangleHeight);
}

function drawInvertedTriangle(xPos, yPos) {
	triangle(xPos,yPos, xPos-triangleWidth/2,yPos+triangleHeight, xPos-triangleWidth,yPos);
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