
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const startBtn = document.querySelector('#start-btn');
const width = 10;
let timerId;
let score = 0;

let nextRandom = 0;

//to add colors
const colors = [
    'orange',
    'red',
    'pink',
    'blue',
    'purple'
]

// The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

//now let's put these shapes in array of their own
const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let currentPosition = 4;
let currentRotation = 0;

// let's select a random index
let random = Math.floor(Math.random()*tetrominoes.length);
let current = tetrominoes[random][currentRotation];

//draw the first rotation in the first tetromino
function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}

//undraw the tetromino
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    })
}

draw();

//make the tetromino move down every second 
// timerId = setInterval(moveDown, 500);

//move down function
function moveDown(){
    undraw();
    currentPosition+=width;
    draw();
    freeze();
}

function freeze(){
    if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition+index].classList.add('taken'));
        // start a new tetromino falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random()*tetrominoes.length);
        current = tetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

//controls
function control(e){
    if(e.keyCode == 37){
        moveLeft();
    }else if(e.keyCode == 39){
        moveRight();
    }else if(e.keyCode == 38){
        rotate();
    }else if(e.keyCode == 40){
        moveDown();
    }
}
document.addEventListener('keyup',control);

//move the block to the left unless it steps out of the grid
function moveLeft(){
    undraw();
    const lastLeft = current.some(index => (currentPosition+index)%10 === 0);
    //if the current position is not last left, then move left
    if(!lastLeft){
        currentPosition-=1;
    }
    //if the current position contains a position that is taken then push the block back to its place
    //i.e not move further left
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
        currentPosition+=1;
    }
    draw();
}

//move the block to the right unless it is stepping out of the grid
function moveRight(){
    undraw();
    const lastRight = current.some(index => (currentPosition+index)%width === width-1);
    if(!lastRight)currentPosition+=1;
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) currentPosition-=1;
    draw();
}

//rotate with up key
function rotate(){
    undraw();
    currentRotation ++;
    if(currentRotation===current.length){
        currentRotation=0;
    }
    current = tetrominoes[random][currentRotation];
    draw();
}


//show the upnext tetromino in the mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

//the tetrominos without rotation
const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2],//lTetromino
    [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],//zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2],//tTetromino
    [0, 1, displayWidth, displayWidth+1],//oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//iTetromino
]

//display the shape in mini-grid display
function displayShape(){
    //remove any trace of tetromino from the grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })
    upNextTetromino[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor=colors[nextRandom];
    })
}

//add functionality to the button
startBtn.addEventListener('click', () => {
    if(timerId){
        clearInterval(timerId);
        timerId = null;
    }else{
        draw();
        timerId = setInterval(moveDown,500);
        nextRandom = Math.floor(Math.random()*tetrominoes.length);
        displayShape();
    }
})

// add score
function addScore(){
    for(let i=0; i<199; i+=width){
        const row =[i, i+1, i+2, i+3, i+4,i+5, i+6, i+7, i+8, i+9];

        if(row.every(index => squares[index].classList.contains('taken'))){
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor='';
            })
            const squaresRemoved = squares.splice(i,width);
            console.log(squaresRemoved);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}  

function gameOver(){
    if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
        scoreDisplay.innerHTML="Game Over";
        clearInterval(timerId);
    }
}