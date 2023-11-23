const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startButton");
const restartBtn = document.getElementById("restartButton");
const shopBtn = document.getElementById("shopButton"); // Shop button
const coinDisplay = document.getElementById("coinDisplay"); // Display for coins
const birdImg = new Image();
birdImg.src = 'bird.png'; // Path to bird image

canvas.width = 500;
canvas.height = 600;

let bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.5,
    velocity: 0,
    color: 'red' // Default color
};

let spacePressed = false;
let gameRunning = false;
let pillars = [];
let pillarInterval = 2000; // time (in milliseconds) between pillar spawns
let pillarWidth = 50; // width of the pillars
let gap = 150; // vertical gap size between pillars
let lastPillarTime = 0; // the last time a pillar was spawned
let score = 0;
let bestScore = 0;  // Variable to track the best score
let coins = 0; // Total coins player has
const pointsToCoinsRate = 5; // Conversion rate from points to coins

function animate(time) {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Bird physics
    if (spacePressed) bird.velocity = -8;
    bird.velocity += bird.gravity;
    bird.velocity *= 0.9;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }

    // Pillars
    if (time - lastPillarTime > pillarInterval) {
        let pillarHeight = Math.random() * (canvas.height - gap);
        pillars.push({ x: canvas.width, y: 0, width: pillarWidth, height: pillarHeight, passed: false });
        pillars.push({ x: canvas.width, y: pillarHeight + gap, width: pillarWidth, height: canvas.height - pillarHeight - gap, passed: false });
        lastPillarTime = time;
    }

    pillars.forEach(pillar => {
        pillar.x -= 2; // Pillar speed
        ctx.fillStyle = 'green';
        ctx.fillRect(pillar.x, pillar.y, pillar.width, pillar.height);

        // Collision detection
        if (bird.x < pillar.x + pillar.width &&
            bird.x + bird.width > pillar.x &&
            bird.y < pillar.y + pillar.height &&
            bird.y + bird.height > pillar.y) {
            gameOver();
        }

        // Scoring
        if (pillar.x + pillar.width < bird.x && !pillar.passed) {
            pillar.passed = true;
            score++;
        }
    });

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Best: ' + bestScore, 10, 60); // Display the best score

    // Remove off-screen pillars
    pillars = pillars.filter(pillar => pillar.x + pillar.width > 0);

    requestAnimationFrame(animate);
}

function startGame() {
    gameRunning = true;
    score = 0;
    lastPillarTime = performance.now();
    animate(0);
    startBtn.style.display = 'none';
}

function gameOver() {
    gameRunning = false;
    bestScore = Math.max(score, bestScore); // Update best score if current score is higher
    let coinsEarned = score * pointsToCoinsRate;
    coins += coinsEarned;
    coinDisplay.textContent = `Coins: ${coins}`;
    alert(`Game Over. Score: ${score}. Best Score: ${bestScore}. Coins Earned: ${coinsEarned}`);
    restartBtn.style.display = 'block';
    
}
// Shop functionality
function buyColor(color) {
    let colorCost = 10; // Cost for changing color
    if (coins >= colorCost) {
        coins -= colorCost;
        bird.color = color;
        coinDisplay.textContent = `Coins: ${coins}`;
        alert(`Your bird is now ${color}!`);
    } else {
        alert('Not enough coins!');
    }
}

document.getElementById("blueBtn").addEventListener('click', function() {
    buyColor('blue');
});

document.getElementById("greenBtn").addEventListener('click', function() {
    buyColor('green');
});

document.getElementById("yellowBtn").addEventListener('click', function() {
    buyColor('yellow');
});
// Shop functionality
shopBtn.addEventListener('click', function() {
    let itemCost = 100; // Cost of an item
    if (coins >= itemCost) {
        coins -= itemCost;
        coinDisplay.textContent = `Coins: ${coins}`;
        alert('You bought an item!');
        // Implement item effect here
    } else {
        alert('Not enough coins!');
    }
});

startBtn.addEventListener('click', startGame);

restartBtn.addEventListener('click', function() {
    // Reset game state without refreshing the page
    gameRunning = false;
    spacePressed = false; // Ensure spacePressed is reset to false
    pillars = []; // Reset pillars
    score = 0; // Reset score
    bird.y = 150; // Reset bird position
    bird.velocity = 0; // Reset bird velocity
    startBtn.style.display = 'block'; // Show start button again
    restartBtn.style.display = 'none'; // Hide restart button
    // Do not reset coins here, so they remain accumulated
    animate(); // Restart the animation loop
});

window.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowUp') spacePressed = true;
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'ArrowUp') spacePressed = false;
});

coinDisplay.textContent = `Coins: ${coins}`;