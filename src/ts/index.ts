
import { Vec2 } from "./modules/Vec2";
import { Ball } from "./modules/Ball";

//----------------------------------------[VARIABLES]----------------------------------------

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const balls: Ball[] = [];
const physicsInterval = 10;
const tweenInterval = 15;
const bounceNoise = 5; // degrees
const energyNoise = 0.5; // float

const ballParams = {
    radius: 5,
    elasticity: 0.75
}

let centreBall: Vec2 = new Vec2();
let mousePos: Vec2 = new Vec2(1, 1);
let mouseDown: boolean = false;

//----------------------------------------[INITIALIZATIONS]----------------------------------------

resize();
recenter();
animate();

setInterval(physicsUpdate, physicsInterval);
setInterval(() => {
    if (mouseDown) {
        spawnBall();
    }
}, 50);

// setInterval(tween, tweenInterval);

//----------------------------------------[LISTENERS]----------------------------------------

window.addEventListener('resize', resize);

document.body.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// get mouse position from canvas
canvas.addEventListener('mousemove', (e) => {
    mousePos = new Vec2(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousedown', (e) => {
    const butt = e.button;
    if(butt === 2) mouseDown = true;
    // if(butt === 1) alert("Middle!");
    if(butt === 0) spawnBall();
});

canvas.addEventListener('mouseup', (e) => {
    const butt = e.button;
    if(butt === 2) mouseDown = false;
});

canvas.addEventListener('mouseout', (e) => {
    const butt = e.button;
    if(butt === 2) mouseDown = false;
});

//----------------------------------------[FUNCTIONS]----------------------------------------

function recenter() {
    centreBall.x = canvas.width / 2;
    centreBall.y = canvas.height / 2;
}

function resize() {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth * 0.9;
    canvas.height = innerHeight * 0.9;

    recenter();
}

// check the mouse pos with setinterval
function spawnBall() {
    const spawnPos = centreBall;
    const vel = mousePos.subtract(spawnPos).multiply(0.03);
    balls.push(new Ball(spawnPos.x, spawnPos.y, ballParams.radius, vel.x, vel.y, ballParams.elasticity, `hsl(${Math.random()*360}, 100%, 50%)`));
}

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw a marker centre screen to canvasDims
    drawBall(ctx, new Ball(centreBall.x, centreBall.y, ballParams.radius));

    // draw the ball
    for (const ball of balls) {
        drawBall(ctx, ball);
    }

    // console.log(balls.length);
}

// function tween() {
//     for (const ball of balls) {
//         ball.drawPosition = ball.drawPosition.add(ball.velocity.multiply(tweenInterval / physicsInterval));
//     }
// }

function physicsUpdate() {
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        ball.position = ball.position.add(ball.velocity);
        ball.drawPosition = ball.position;

        // if the ball goes off canvas remove from array
        if (ball.position.x > canvas.width || ball.position.x < 0 || ball.position.y > canvas.height || ball.position.y < 0) {
            // balls.splice(i, 1);
        }

        // if the ball hits wall bounce
        const xWallsCollide = (ball.position.x > canvas.width - ball.radius || ball.position.x < ball.radius);
        const yWallsCollide = (ball.position.y > canvas.height - ball.radius || ball.position.y < ball.radius);

        if (xWallsCollide) {
            if (!ball.xColliding) { // Prevent ball wall collision event from firing multiple times IN A ROW (back to back).
                ball.xColliding = true;
                ball.velocity.x = -ball.velocity.x;
                ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, energyNoise));
            }
        } else {
            ball.xColliding = false;
        }

        if (yWallsCollide) {
            if (!ball.yColliding) {
                ball.yColliding = true;
                ball.velocity.y = -ball.velocity.y;
                ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, energyNoise));
            }
        } else {
            ball.yColliding = false;
        }

        if (xWallsCollide || yWallsCollide) {
            const mag = ball.velocity.magnitude; //Convsere ball's velocity
            let dir = ball.velocity.toAngle(); //Angle of ball in radians
            const bounceNoiseRads = bounceNoise * Math.PI / 180; //Convert bounce noise from degrees to radians
            dir += randFloat(-bounceNoiseRads, bounceNoiseRads);
            ball.velocity = Vec2.fromAngle(dir).multiply(mag); // convert direction (normalised vector) and multiply by magnitude to get original vector
        }

        // avoids balls sinking into the floor
        const gravity = yWallsCollide ? 0 : 0.1;
        ball.applyForce(new Vec2(0, gravity));

    }
}

function randFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
