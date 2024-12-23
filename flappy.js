const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Dynamic canvas resizing for responsiveness
function resizeCanvas() {
    const aspectRatio = 4 / 3; // Original aspect ratio: 800x600
    const screenWidth = Math.min(window.innerWidth * 0.95, 800); // Cap max width for laptops
    const screenHeight = screenWidth / aspectRatio;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let frames = 0;
let pipes = [];
let gameInterval;
let gameOver = false;
let score = 0;

const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.3,
    lift: -6,
    velocity: 0,
    img: new Image(),
};
bird.img.src = 'bird.png';

let gap;
let pipeSpeed;

function startGame(difficulty) {
    document.getElementById('difficulty').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    frames = 0;
    score = 0;
    gameOver = false;

    // Set difficulty levels
    if (difficulty === 'Easy') {
        gap = canvas.height / 2.5;
        pipeSpeed = 2; // Slightly faster pipes
    } else if (difficulty === 'Hard') {
        gap = canvas.height / 3;
        pipeSpeed = 2.5; // Moderate speed
    } else if (difficulty === 'Advanced') {
        gap = canvas.height / 4;
        pipeSpeed = 3; // Fast pipes for advanced level
    }
    countdown();
}

function countdown() {
    let count = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.font = `${canvas.height / 10}px Arial`;
        ctx.fillText(count, canvas.width / 2 - 20, canvas.height / 2);
        count--;
        if (count < 0) {
            clearInterval(countdownInterval);
            gameInterval = setInterval(updateGame, 1000 / 60);
        }
    }, 1000);
}

function updateGame() {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    checkCollision();
    drawScore();
    if (gameOver) {
        clearInterval(gameInterval);
        displayGameOver();
    }
}

function drawBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    ctx.drawImage(bird.img, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    if (frames % 90 === 0) { // Slightly faster appearance of pipes
        const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        ctx.fillStyle = 'green';
        const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 50, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');
        ctx.fillStyle = gradient;

        // Top pipe
        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.y + gap, 50, canvas.height - pipe.y - gap);

        if (pipe.x + 50 < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

function checkCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + 50 &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + gap)
        ) {
            gameOver = true;
        }
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = `${canvas.height / 20}px Arial`;
    ctx.fillText(`Score: ${score}`, 10, canvas.height / 20);
}

function displayGameOver() {
    document.getElementById('restart').style.display = 'block';
}

function restartGame() {
    document.getElementById('restart').style.display = 'none';
    document.getElementById('difficulty').style.display = 'block';
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.lift;
    }
});
canvas.addEventListener('click', () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    }
});
