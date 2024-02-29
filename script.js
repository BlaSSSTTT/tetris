// ДЗ №3
// 1.Зробити розмітку висновків гри (Час гри, набрана кількість балів і т.п)
// 2.Створити окрему кнопку рестарт що перезапускатиме гру посеред гри
// 3.Додати клавіатуру на екрані браузеру 

// Додаткове складніше завдання
// 4.Показувати наступну фігуру що буде випадати
// 5.Додати рівні при котрих збільшується швидкість падіння фігур
// 6.Зберегти і виводити найкращий власний результат

let bestScore=0;
const scoreElement = document.querySelector('.score');
const timeElement = document.querySelector('.time');
const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
const TETROMINO_NAMES = [
    'O',
    'J',
    'L',
    'I',
    'S',
    'T',
    'Z'
]

const TETROMINOES = {
    'O': [
        [1,1],
        [1,1]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}
let playfield;
let tetromino;
let score = 0;
let isPaused = false;
let isGameOver = false;
let timedId = null;

const overlay = document.querySelector(".overlay");
const bntRestart = document.querySelector(".btn-restart");


let cells;
init()


bntRestart.addEventListener("click",function(){
    seconds = 0;
    document.querySelector(".grid").innerHTML = "";
    init();
    overlay.style.display = "none";

});


function init(){
    isGameOver = false;
    console.log(bestScore);
    console.log(score);
    if(bestScore<score){
        bestScore=score;
        document.getElementById('bestScore').innerHTML = bestScore;
        score=0;
    }
    scoreElement.innerHTML = 0;
    generatePlayField();
    generateTetromino();
    cells = document.querySelectorAll('.grid div');
    moveDown();
}

function convertPositionToIndex(row, column){
    return row * PLAYFIELD_COLUMNS + column;
}

function getRandomElement(array){
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex];
}



function countScore(destroyRows){
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2: 
            score += 20;
                break;
        case 3: 
            score += 50;
                break;
        case 4: 
            score += 100;
                break;
    }
    scoreElement.innerHTML = score;
}

function generatePlayField(){
    for(let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++){
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )
    console.table(playfield);
}

function generateTetromino(){

    const name   = getRandomElement(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -2;

    // console.log(matrix);
    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column
    }
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            console.log(isOutsideOfTopboard(row));
            if(isOutsideOfTopboard(row)){

                isGameOver = true;
                return;
            }
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }

    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
    countScore(filledRows.length);

}

function removeFillRows(filledRows){
    for(let i = 0; i < filledRows.length; i++){
        const row = filledRows[i];
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete){
    for(let row = rowDelete; row > 0; row--){
        playfield[row] = playfield[row - 1];
    }

    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}


function findFilledRows(){
    const fillRows = [];
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        let filledColumns = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] != 0){
                filledColumns++;
            }
        }
        // for 2
        if(PLAYFIELD_COLUMNS === filledColumns){
            fillRows.push(row);
        }
        // if
    }
    // for 1

    return fillRows;
}



function drawPlayField(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(playfield[row][column] == 0) continue;
            
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row,column);
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;
    
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            // Щоб подивитись результат алгоритму з функції rotateMatrix()!!!!!

            // const cellIndex = convertPositionToIndex(
            //     tetromino.row + row,
            //     tetromino.column + column
            // );
            // cells[cellIndex].innerHTML = showRotated[row][column];
            // -----------------------
            if(isOutsideOfTopboard(row)) continue;
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}
// drawTetromino();
// drawPlayField();

function draw(){
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}


function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}

// let showRotated = [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9]
// ]
// draw();

function rotate(){
    rotateTetromino();
    draw();
}

document.addEventListener('keydown', onKeyDown);
function onKeyDown(e){
    console.log(e.key);
    if(e.key == 'Escape'){
        togglePauseGame();
    }
    // if Escape
    if(!isPaused){
        switch(e.key){
            case 'ArrowUp':
                rotate();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
            case ' ':
                dropTetraminoDown();
                break;
        }
        // switch
    }
    // if isPaused
    draw();
}

function dropTetraminoDown(){
    while(isValid()){
        tetromino.row++;
    }
    tetromino.row--;
}



function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }

    return rotateMatrix;
}

function moveTetrominoDown(){
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
    startLoop()
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(!isValid()){
        tetromino.column += 1;
    }
}
function moveTetrominoRight(){
    tetromino.column += 1;
    if(!isValid()){
        tetromino.column -= 1;
    }
}

function moveDown(){
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver){
        gameOver();
    }
}
let seconds =0;
function startTimer() {
    intervalId = setInterval(() => {
        if(!isPaused&&!isGameOver){
            seconds++;
            timeElement.innerHTML = seconds;
        }
    }, 1000); // Часовий інтервал в мілісекундах (тут 1000 мілісекунд = 1 секунда)
}

startTimer();

function gameOver(){
    stopLoop();
    timeElement.innerHTML = 0;
    overlay.style.display = "flex";
    document.getElementById('points-sum').innerHTML = score;
    document.getElementById('time-sum').innerHTML = seconds;
    
}
function startLoop(){
    if(!timedId){
        timedId = setTimeout(()=>{ requestAnimationFrame(moveDown) }, 700);
    }
}




function stopLoop(){
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);

    timedId = null;
}


function togglePauseGame(){
    if(isPaused === false){
        stopLoop();
    } else {
        startLoop();
    }
    isPaused = !isPaused;
}

function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            // if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)) { return false; }
            if(hasCollisions(row, column)) { return false; }
        }
    }

    return true;
}

function isOutsideOfTopboard(row){
    return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column){
    return tetromino.matrix[row][column] && 
    (
        tetromino.column + column < 0 
        || tetromino.column + column >= PLAYFIELD_COLUMNS
        || tetromino.row + row >= PLAYFIELD_ROWS
    );
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] 
    && playfield[tetromino.row + row]?.[tetromino.column + column];
}



document.getElementById('left').addEventListener('click', function(){
    moveTetrominoLeft();
    draw();
});
document.getElementById('right').addEventListener('click', function(){
    moveTetrominoRight();
    draw();
});
document.getElementById('down').addEventListener('click', function(){
    moveTetrominoDown();
    draw();
});
document.getElementById('up').addEventListener('click', function(){
    rotate();
    draw();
});
document.getElementById('arrow').addEventListener('click', function(){
    seconds = 0;
    document.querySelector(".grid").innerHTML = "";
    init();
    overlay.style.display = "none";
});
document.getElementById('fix').addEventListener('click', function(){
    dropTetraminoDown();
    draw();
});