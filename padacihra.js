const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    width: 50,
    height: 50,
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    speed: 7,
    color: 'black'
};

const obstacles = [];
const obstacleImage = new Image();
obstacleImage.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvD1WEzHlgluiPxLC1TLg5N4jZ4JBlWXvrXqU1l5LVkH2RPoCfl_PvTbcKqkOgJflqJrw&usqp=CAU';

let collisions = 0; 
let gameOver = false;
let gameTime = 15; 
let elapsedTime = 0;
let startTime = Date.now();

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function createObstacle() {
    if (gameOver) return;

    const width = 80;
    const height = 60; 
    const x = Math.random() * (canvas.width - width);
    const speed = 7 + Math.random() * 3;

    obstacles.push({ x, y: -30, width, height, speed });
}

function drawObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += obstacle.speed;

        if (
            obstacle.x < player.x + player.width &&
            obstacle.x + obstacle.width > player.x &&
            obstacle.y < player.y + player.height &&
            obstacle.y + obstacle.height > player.y
        ) {
            if (!obstacle.hasCollided) {  
                collisions++; 
                obstacle.hasCollided = true;
            }
        }

        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }
}

function drawTime() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Zbývající čas: ${Math.max(0, gameTime - elapsedTime)} s`, 10, 30);
}

function movePlayer() {
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
    if (rightPressed && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    }
});


function showGameOver() {
    document.getElementById('scoreDisplay').textContent = collisions;
    document.getElementById('gameOverPopup').style.display = 'block';
}

// Restart hry
function restartGame() {
    collisions = 0;
    gameOver = false;
    obstacles.length = 0;
    elapsedTime = 0;
    startTime = Date.now();
    document.getElementById('gameOverPopup').style.display = 'none';
    startGame();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();
    drawObstacles();
    drawTime();

    if (Math.random() < 0.16) { 
        createObstacle();
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function updateTime() {
    if (!gameOver) {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        if (elapsedTime >= gameTime) {
            gameOver = true;
            showGameOver();
        } else {
            requestAnimationFrame(updateTime);
        }
    }
}

function startGame() {
    gameOver = false;
    collisions = 0;
    elapsedTime = 0;
    startTime = Date.now();
    obstacles.length = 0;
    
    gameLoop();
    updateTime();
}

startGame();
