const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; 
const canvasSize = 400;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let nextDirection = "RIGHT"; 
let food = generateFood();
let gameRunning = false; 
let game;

drawStartScreen();

document.addEventListener("keydown", startGame);

function startGame(event) {
    if (!gameRunning) {
        gameRunning = true;
        document.removeEventListener("keydown", startGame);
        document.addEventListener("keydown", changeDirection);
        game = setInterval(gameLoop, 220); 
    }
}

function changeDirection(event) {
    const key = event.keyCode;

    if (
        (key === 37 && direction !== "RIGHT") ||
        (key === 38 && direction !== "DOWN") ||
        (key === 39 && direction !== "LEFT") ||
        (key === 40 && direction !== "UP")
    ) {
        nextDirection = key === 37 ? "LEFT" :
                       key === 38 ? "UP" :
                       key === 39 ? "RIGHT" :
                       key === 40 ? "DOWN" : direction;
    }
}


function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function update() {
    if (!gameRunning) return;

    direction = nextDirection;

    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop(); 
    }

    snake.unshift(head);
}

function draw() {
    if (!gameRunning) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime"; 
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function drawStartScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Pressione qualquer tecla para começar!", canvasSize / 2, canvasSize / 2);
}

function gameOver() {
    gameRunning = false;
    clearInterval(game);
    setTimeout(() => {
        alert("Game Over!");
        location.reload(); 
    }, 200);
}

function gameLoop() {
    update();
    draw();
}
