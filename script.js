const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 150, y: 150 }];
let direction = 'right';
let newDirection = 'right';
let food = { x: 300, y: 300 };
let gridSize = 15;
let canvasWidth, canvasHeight;
let gameInterval;

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWidth = Math.floor(canvas.width / gridSize) * gridSize;
    canvasHeight = Math.floor(canvas.height / gridSize) * gridSize;
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

function drawSnake() {
    ctx.fillStyle = 'rgba(50, 205, 50, 0.8)'; 
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}


function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    direction = newDirection;
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'right':
            head.x += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
    }

    // Wrap around the edges
    if (head.x >= canvasWidth) head.x = 0;
    if (head.x < 0) head.x = canvasWidth - gridSize;
    if (head.y >= canvasHeight) head.y = 0;
    if (head.y < 0) head.y = canvasHeight - gridSize;

    // Check collision with body
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            restartGame();
            return;
        }
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    let validFoodPosition = false;
    while (!validFoodPosition) {
        food.x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
        food.y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
        validFoodPosition = !snake.some(part => part.x === food.x && part.y === food.y);
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawSnake();
    drawFood();
}

function changeDirection() {
    const directions = ['up', 'right', 'down', 'left'];
    let newDir;
    do {
        newDir = directions[Math.floor(Math.random() * directions.length)];
    } while ((direction === 'up' && newDir === 'down') ||
             (direction === 'down' && newDir === 'up') ||
             (direction === 'left' && newDir === 'right') ||
             (direction === 'right' && newDir === 'left'));
    newDirection = newDir;
}

function restartGame() {
    clearInterval(gameInterval);
    snake = [{ x: 150, y: 150 }];
    direction = 'right';
    newDirection = 'right';
    placeFood();
    gameInterval = setInterval(update, 100);
}

function moveToFood() {
    if (snake[0].x < food.x) newDirection = 'right';
    else if (snake[0].x > food.x) newDirection = 'left';
    else if (snake[0].y < food.y) newDirection = 'down';
    else if (snake[0].y > food.y) newDirection = 'up';
}

gameInterval = setInterval(() => {
    moveToFood();
    update();
}, 100);
