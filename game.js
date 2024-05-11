var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 5;
var paddle1Y = 250;
var paddle2Y = 250;
var speedMultiplier = 1.1;
var player1Score = 0;
var player2Score = 0;
var showingWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 1000;



window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    var framesPerSecond = 60;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);
    
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);

    canvas.addEventListener('mousedown', handleMouseClick);
    });
}

function handleMouseClick(evt) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function ballReset() {

    if(player1Score >= WINNING_SCORE ||
        player2Score >= WINNING_SCORE) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = true;
        }
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = -ballSpeedY;
    
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    }else if(paddle2YCenter > ballY+35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if( ballX < 0) {
        if (ballY > paddle1Y && 
            ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;

        }else {
            player2Score += 100;
            ballReset();
        }
    }
    if( ballX > canvas.width) {
        if (ballY > paddle2Y && 
            ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        }else {
            player1Score += 100;
            ballReset();
        }
    }
    if(ballY > (canvas.height) || ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawEverything() {
    // Draw black canvas
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showingWinScreen) {
        canvasContext.fillStyle = 'white';
        if(player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Player 1 wins!", 350, 200);
        }else{
            canvasContext.fillText("Player 2 wins!", 350, 200);
        }
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }
    // Draw left paddle
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    // Draw right paddle
    colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    // Draw ball
    colorCircle(ballX, ballY, 10, 'white');

    // Draw net
    for(var i=10; i<canvas.height-10; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'white');
    }

    // Draw score
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}