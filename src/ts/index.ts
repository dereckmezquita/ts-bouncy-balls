
import { Vec2 } from "./modules/math";
import { Ball } from "./modules/ball";

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const canvasDims = {
    width: canvas.width,
    height: canvas.height
}

const ballParams = {
    radius: 5,
    elasticity: 0.75
}

const balls: Ball[] = [];

let mousePos: Vec2 = new Vec2(1, 1);
const physicsInterval = 10;
const tweenInterval = 15;

document.body.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// get mouse position from canvas
canvas.addEventListener('mousemove', (e) => {
    mousePos = new Vec2(e.offsetX, e.offsetY);
});

let mouseDown: boolean = false;

// check the mouse pos with setinterval
setInterval(() => {
    if (mouseDown) {
        const spawnPos = new Vec2(canvasDims.width / 2, canvasDims.height / 2);
        const dist = mousePos.distance(spawnPos);
        const vel = mousePos.subtract(spawnPos).multiply(0.02);
        balls.push(new Ball(canvasDims.width / 2, canvasDims.height / 2, ballParams.radius, vel.x, vel.y, ballParams.elasticity, `hsl(${Math.random()*360}, 100%, 50%)`));
    }

    console.log(balls.length);
}, 50);


canvas.addEventListener('mousedown', (e) => {
    const butt = e.button;
    if(butt === 0) mouseDown = true;
});

canvas.addEventListener('mouseup', (e) => {
    const butt = e.button;
    if(butt === 0) mouseDown = false;
});

canvas.addEventListener('mouseout', (e) => {
    const butt = e.button;
    if(butt === 0) mouseDown = false;
});

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball): void {
    ctx.beginPath();
    ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.colour;
    ctx.fill();
}

function animate() {
    // only tweening physics calculations done here; approximations
    requestAnimationFrame(animate);

    // clear the screen to draw again every frame
    ctx.clearRect(0, 0, 800, 800);
    // draw a marker centre screen to canvasDims
    drawBall(ctx, new Ball(canvasDims.width / 2, canvasDims.height / 2, ballParams.radius));

    // draw the ball
    for (const ball of balls) {
        drawBall(ctx, ball);
    }
}

// function tween() {
//     ball.drawPos = ball.drawPos.add(ball.velocity.multiply(tweenInterval / physicsInterval));
// }

function physicsUpdate() {
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        ball.position = ball.position.add(ball.velocity);
        ball.drawPosition = ball.position;

        // if the ball goes of canvas remove from array
        if (ball.position.x > canvasDims.width || ball.position.x < 0 || ball.position.y > canvasDims.height || ball.position.y < 0) {
            // balls.splice(i, 1);
        }

        // if the ball hits wall bounce
        const xWallsCollide = (ball.position.x > canvasDims.width - ball.radius || ball.position.x < ball.radius);
        const yWallsCollide = (ball.position.y > canvasDims.height - ball.radius || ball.position.y < ball.radius);

        if (xWallsCollide) {
            ball.velocity.x = -ball.velocity.x;
            // minus the elasticity of the ball
            // ball.removeEnergy(ball.elasticity * 1000);
            ball.removeEnergy(ball.energy * (1 - ball.elasticity));
        }
        if (yWallsCollide) {
            ball.velocity.y = -ball.velocity.y;
        }

        console.log(ball.energy);
    }
}

setInterval(physicsUpdate, physicsInterval);
// setInterval(tween, tweenInterval);

animate();
