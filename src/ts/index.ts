
import { Vec2 } from "./modules/math";

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const ball = {
    position: new Vec2(10, 5),
    drawPos: new Vec2(10, 5),
    velocity: new Vec2(1, 1)
}

let mousePos: Vec2 = new Vec2(1, 1);
const physicsInterval = 100;
const tweenInterval = 15;

// get mouse position from canvas
canvas.addEventListener('mousemove', (e) => {
    mousePos = new Vec2(e.offsetX, e.offsetY);
});

function animate() {
    // only tweening physics calculations done here; approximations
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, 800, 800);
    // draw the ball
    ctx.beginPath();
    ctx.arc(ball.drawPos.x, ball.drawPos.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
}

function tween() {
    ball.drawPos = ball.drawPos.add(ball.velocity.multiply(tweenInterval / physicsInterval));
}

function physicsUpdate() {
    const direction: Vec2 = mousePos.subtract(ball.position).normalise();
    ball.velocity = direction.multiply(25);

    ball.velocity = ball.velocity.add(direction);
    ball.position = ball.position.add(ball.velocity);
    ball.drawPos = ball.position;
}

setInterval(physicsUpdate, physicsInterval);
setInterval(tween, tweenInterval);

animate();