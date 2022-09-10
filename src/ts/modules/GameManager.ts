
import { Vec2 } from "./Vec2";
import { Ball } from "./Ball";
import { randFloat } from "./helpers";

export class GameManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    physicsInterval: number = 10;

    mousePos: Vec2 = new Vec2(1, 1);
    centreBall: Vec2 = new Vec2();
    mouseDown: boolean = false;

    ballParams = {
        radius: 5,
        elasticity: 0.75,
        angleNoise: 5, // degrees
        energyNoise: 0.3 // float
    }

    ballSliders = {
        addEnergySlider: 0,
        addNumBalls: 1
    }

    balls: Ball[] = [];

    // ------------------------------
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        // prevent menu when right click
        document.body.addEventListener('contextmenu', e => {
            e.preventDefault();
        });

        // ------------------------------
        this.resize();
        this.recenter();
        window.addEventListener('resize', this.resize.bind(this));

        // update current mouse position
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePos = new Vec2(e.offsetX, e.offsetY);
        });

        // ------------------------------
        // right click spawn balls
        setInterval(() => {
            if (this.mouseDown) {
                for (let i = 0; i < this.ballSliders.addNumBalls; i++) {
                    this.spawnBall(this.centreBall);
                }
            }
        }, 50);

        // ------------------------------
        this.canvas.addEventListener('mousedown', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown = true;
            // for this.ballSliders.addNumBalls.length
            if (button === 0) {
                for (let i = 0; i < this.ballSliders.addNumBalls; i++) {
                    this.spawnBall(this.centreBall);
                }
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown = false;
        });

        // if mouse leaves canvas area
        this.canvas.addEventListener('mouseout', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown = false;
        })

        // ------------------------------
        this.animate();
        setInterval(this.physicsUpdate.bind(this), this.physicsInterval);

        // ------------------------------
        // print to html
        const numBalls = document.querySelector('.num-balls') as HTMLDivElement;
        numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}`;
        // --------------
        const addEnergySlider_label = document.querySelector('.energy-slider-label') as HTMLInputElement;
        addEnergySlider_label.innerHTML = `Add energy (0):`
        // --------------
        const addNumBalls = document.querySelector('.add-n-balls-slider-label') as HTMLInputElement;
        addNumBalls.innerHTML = `Add/delete n balls (1):`

        // print to html every n
        setInterval(() => {
            // number of balls
            numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}`;

            // add energy to all balls
            addEnergySlider_label.innerHTML = `Add energy (${this.ballSliders.addEnergySlider}):`
            const addEnergySlider_value = document.querySelector('.energy-slider-value') as HTMLInputElement;
            this.ballSliders.addEnergySlider = parseInt(addEnergySlider_value.value);

            // number of balls per click
            addNumBalls.innerHTML = `Add/delete n balls (${this.ballSliders.addNumBalls}):`
            const addNumBalls_value = document.querySelector('.add-n-balls-slider-value') as HTMLInputElement;
            this.ballSliders.addNumBalls = parseInt(addNumBalls_value.value);
        }, 250);
    }

    get getAverageSpeed() {
        if(this.balls.length == 0) return 0;

        let totalSpeed = 0;
        for (const ball of this.balls) {
            totalSpeed += ball.velocity.magnitude;
        }

        return (totalSpeed / this.balls.length).toFixed(3);
    }

    recenter(): void {
        this.centreBall.x = this.canvas.width / 2;
        this.centreBall.y = this.canvas.height / 2;
    }

    resize(): void {
        const { innerWidth, innerHeight } = window;
        this.canvas.width = innerWidth * 0.9;
        this.canvas.height = innerHeight * 0.9;
    
        this.recenter();
    }

    // check the mouse pos with setinterval
    spawnBall(fromVec: Vec2): void {
        const mousePos = this.mousePos;

        const vel = mousePos.subtract(fromVec).multiply(0.075);
        this.balls.push(new Ball(
            fromVec.x,
            fromVec.y,
            this.ballParams.radius,
            vel.x,
            vel.y,
            this.ballParams.elasticity,
            `hsl(${Math.random() * 360}, 100%, 50%)`
        ));
    }

    // ------------------------------
    animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        // clear the screen to draw again every frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw a marker centre screen to canvasDims
        Ball.draw(this.ctx, new Ball(this.centreBall.x, this.centreBall.y, this.ballParams.radius));

        // draw the ball
        for (const ball of this.balls) {
            Ball.draw(this.ctx, ball);
        }
    }

    // ------------------------------
    physicsUpdate(): void {
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
    
            ball.position = ball.position.add(ball.velocity);
            ball.drawPosition = ball.position;
    
            // if the ball goes off canvas remove from array
            if (ball.position.x > this.canvas.width || ball.position.x < 0 || ball.position.y > this.canvas.height || ball.position.y < 0) {
                // balls.splice(i, 1);
            }
    
            // if the ball hits wall bounce
            const xWallsCollide = (ball.position.x > this.canvas.width - ball.radius || ball.position.x < ball.radius);
            const yWallsCollide = (ball.position.y > this.canvas.height - ball.radius || ball.position.y < ball.radius);
    
            if (xWallsCollide) {
                if (!ball.xColliding) { // Prevent ball wall collision event from firing multiple times IN A ROW (back to back).
                    ball.xColliding = true;
                    ball.velocity.x = -ball.velocity.x;
                    ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, this.ballParams.energyNoise));
                }
            } else {
                ball.xColliding = false;
            }
    
            if (yWallsCollide) {
                if (!ball.yColliding) {
                    ball.yColliding = true;
                    ball.velocity.y = -ball.velocity.y;
                    ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, this.ballParams.energyNoise));
                }
            } else {
                ball.yColliding = false;
            }
    
            if (xWallsCollide || yWallsCollide) {
                const mag = ball.velocity.magnitude; //Convsere ball's velocity
                let dir = ball.velocity.toAngle(); //Angle of ball in radians
                const angleNoiseRads = this.ballParams.angleNoise * Math.PI / 180; //Convert bounce noise from degrees to radians
                dir += randFloat(-angleNoiseRads, angleNoiseRads);
                ball.velocity = Vec2.fromAngle(dir).multiply(mag); // convert direction (normalised vector) and multiply by magnitude to get original vector
            }
    
            // avoids balls sinking into the floor
            const gravity = yWallsCollide ? 0 : 0.1;
            ball.applyForce(new Vec2(0, gravity));
    
            // add this.addEnergySlider to the balls energy
            if (this.ballSliders.addEnergySlider > 0) {
                ball.addEnergy(this.ballSliders.addEnergySlider / 50);
            }
        }
    }
}
