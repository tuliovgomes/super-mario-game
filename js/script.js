const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const turtle = document.querySelector('.turtle');
const bullet = document.querySelector('.bullet');
const clouds = document.querySelector('.clouds');
const gameOver = document.querySelector('.game-over');
const score = document.querySelector('.score');
const gameBoard = document.getElementById('game-board');
const highScore = document.querySelector('#high-score');

var musicGame = new Audio('/sound/game.mp3');
    musicGame.play();
    musicGame.loop =true;

const setCookie = function (name, value, expirationDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";SameSite=Lax;path=/";
};

const getCookie = function (name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    name = name + "=";

    console.log(ca);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
};

var scoreValue = -1;
var highScoreValue = getCookie('high-score');
var beginnerLevel = 8;
var proLevel = 16;

highScore.textContent = getCookie('high-score');

const jump = () => {
    if (
        gameOver.style.display === 'block'
        || mario.classList.contains('jump')
    ) {
        return;
    }

    const musicJump = new Audio('sound/jump.wav');
    musicJump.play();

    mario.classList.add('jump');

    scoreValue += 1;

    levelPass();

    if(scoreValue >= proLevel) {
        mario.src = './images/mario-flying.gif';
        mario.style.width = '100px';
    }

    score.textContent = scoreValue;

    if (highScoreValue < scoreValue) {
        setCookie('high-score', scoreValue, 365);
        highScoreValue = scoreValue;
        highScore.textContent = highScoreValue;
    }

    setTimeout(() => {
        mario.classList.remove('jump');
        if(scoreValue >= proLevel) {
            mario.src = './images/mario-pro.gif';
            mario.style.width = '150px';
        }
    }, 800);
}

const waitingFailure = () => {
    const pipePosition = pipe.offsetLeft;
    const turtlePosition = turtle.offsetLeft;
    const bulletPosition = bullet.offsetLeft;
    const cloudsPosition = clouds.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (
        (pipePosition <= 100 || turtlePosition <= 100 || bulletPosition <= 100)
        && (pipePosition > 0 || turtlePosition > 0 || bulletPosition > 0)
        && marioPosition < 112
    ) {
        musicGame.pause();
        musicGame = new Audio('sound/mariodie.wav');
        musicGame.play();

        mario.style.animationPlayState = 'paused';
        mario.style.bottom = `${marioPosition}px`;

        clouds.style.animation = 'none';
        clouds.style.left = `${cloudsPosition}px`;

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        turtle.style.animation = 'none';
        turtle.style.left = `${turtlePosition}px`;

        bullet.style.animation = 'none';
        bullet.style.left = `${bulletPosition}px`;

        mario.src = './images/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOver.style.display = 'block';

        clearInterval(loop);

        document.removeEventListener('keydown', jump);
        document.removeEventListener('touchstart', jump);
        gameBoard.classList.add('game-board-over');
    }
};

levelPass = () => {
 switch (scoreValue) {
    case beginnerLevel:
        mario.src = './images/mario-beginner.gif';
        mario.style.width = '125px';
        break;
    case proLevel:
        mario.src = './images/mario-pro.gif';
        mario.style.width = '150px';
        break;
    default:
        break;
 }
};

var loop = setInterval(waitingFailure, 10);

const restartGame = function () {
    gameOver.style.display = 'none';

    gameBoard.classList.remove('game-board-over');

    mario.style.animationPlayState = 'running';
    mario.src = './images/mario-starter.gif';
    mario.style.width = '75px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';

    clouds.style.left = 'auto';
    clouds.style.animation = 'clouds-animation 20s infinite linear';

    pipe.style.left = 'auto';
    pipe.style.animation = 'pipe-animation 4s infinite linear';

    turtle.style.left = 'auto';
    turtle.style.animation = 'turtle-animation 36s infinite linear';

    bullet.style.left = 'auto';
    bullet.style.animation = 'bullet-animation 128s infinite linear';

    scoreValue = 0;
    score.textContent = scoreValue;

    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump);

    musicGame = new Audio('sound/game.mp3');
    musicGame.play();
    musicGame.loop =true;

    loop = setInterval(waitingFailure, 10);
};

document.querySelector('.retry').addEventListener('click', restartGame);

document.querySelector('.game-board').addEventListener('keydown', jump);
document.querySelector('.game-board').addEventListener('touchstart', jump);