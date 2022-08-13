
import { Vec2 } from "./modules/math";
import { Ball } from "./modules/ball";

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


const ball = new Ball(10, 10, 5, 1, 1, 0.5);

let mousePos: Vec2 = new Vec2(1, 1);
const physicsInterval = 15;
const tweenInterval = 15;

document.body.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// get mouse position from canvas
canvas.addEventListener('mousemove', (e) => {
    mousePos = new Vec2(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousedown', (e) => {
    const butt = e.button;

    switch(butt) {
        case 0:
            if(ball.velocity.magnitude === 0) ball.applyForce(ball.position.direction(mousePos));
            ball.addEnergy(200);
            break;
        case 2:
            ball.removeEnergy(200);
            break;
    }

    console.log(ball.energy);
    console.log(ball.velocity.magnitude);
});

function animate() {
    // only tweening physics calculations done here; approximations
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, 800, 800);
    // draw the ball
    ctx.beginPath();
    ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
}

// function tween() {
//     ball.drawPos = ball.drawPos.add(ball.velocity.multiply(tweenInterval / physicsInterval));
// }

function physicsUpdate() {
    // have the ball follow the mouse
    const direction: Vec2 = mousePos.subtract(ball.position).normalise();

    // make the ball move faster by scalar
    ball.setDirection(direction);

    // update the ball's position
    ball.position = ball.position.add(ball.velocity);
    ball.drawPosition = ball.position;
}

setInterval(physicsUpdate, physicsInterval);
// setInterval(tween, tweenInterval);

animate();
