const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameOver = document.querySelector('.game-over');

const jump = () => {
    mario.classList.add('jump');
    console.log('pule');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

const waitingFailure = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (
        pipePosition <= 120
        && pipePosition > 0
        && marioPosition < 112
    ) {
        mario.style.animationPlayState = 'paused';
        mario.style.bottom = `${marioPosition}px`;

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.src = './images/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOver.style.display = 'block';

        clearInterval(loop);

        document.removeEventListener('keydown', jump);
        document.removeEventListener('touchstart', jump);
    }
};

var loop = setInterval(waitingFailure, 10);

const restartGame = function () {
    gameOver.style.display = 'none';

    mario.style.animationPlayState = 'running';
    mario.src = './images/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';

    pipe.style.left = 'auto';
    pipe.style.animation = 'pipe-animation 1s infinite linear';

    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump);

    loop = setInterval(waitingFailure, 10);
};

document.querySelector('.retry')
    .addEventListener('click', restartGame);

document.querySelector('.game-board').addEventListener('keydown', jump);
document.querySelector('.game-board').addEventListener('touchstart', jump);