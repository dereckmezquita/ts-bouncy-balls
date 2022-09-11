
import { Vec2 } from "./Vec2";
import { Ball } from "./Ball";
import { randFloat } from "./helpers";

export class GameManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    physicsInterval: number = 10;

    mousePos: Vec2 = new Vec2(1, 1);
    centreBall: Vec2 = new Vec2(0, 0);

    mouseDown = {
        left: false,
        right: false,
        middle: false
    }

    gravity: number = 0.1;

    ballParams = {
        radius: 5,
        elasticity: 0.75,
        angleNoise: 5, // degrees
        energyNoise: 0.3 // float
    }

    ballSliders = {
        addEnergySlider: 0,
        addRemoveNumBalls: 1
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
            if (this.mouseDown.left) {
                for (let i = 0; i < this.ballSliders.addRemoveNumBalls; i++) {
                    this.spawnBall(this.centreBall);
                }
            }
        }, 50);

        // ------------------------------
        // mouse click spawn balls
        this.canvas.addEventListener('mousedown', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown.left = true;
            if (button === 1) this.mouseDown.middle = true;
            // for this.ballSliders.addRemoveNumBalls.length
            if (button === 0) {
                for (let i = 0; i < this.ballSliders.addRemoveNumBalls; i++) {
                    this.spawnBall(this.centreBall);
                }
            }

            // delete n balls if middle button
            if (button === 1) {
                this.balls.splice(0, this.ballSliders.addRemoveNumBalls);
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown.left = false;
            if (button === 1) this.mouseDown.middle = false;
        });

        // if mouse leaves canvas area
        this.canvas.addEventListener('mouseout', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown.left = false;
            if (button === 1) this.mouseDown.middle = false;
        })

        // ------------------------------
        this.animate();

        const dynamicTimeout = () => {
            setTimeout(() => {
                this.physicsUpdate();
                dynamicTimeout();
            }, this.physicsInterval);
        }

        dynamicTimeout();

        // ------------------------------
        // print to html every n
        this.updateUserSettings();
    }

    get getAverageSpeed() {
        if(this.balls.length == 0) return 0;

        let totalSpeed = 0;
        for (const ball of this.balls) {
            totalSpeed += ball.velocity.magnitude;
        }

        return (totalSpeed / this.balls.length).toFixed(3);
    }

    get getAverageEnergy() {
        if(this.balls.length == 0) return 0;

        let totalEnergy = 0;
        for (const ball of this.balls) {
            totalEnergy += ball.energy;
        }

        return (totalEnergy / this.balls.length).toFixed(3);
    }

    recenter(): void {
        this.centreBall.x = this.canvas.width / 2;
        this.centreBall.y = this.canvas.height / 2;
    }

    resize(): void {
        const { innerWidth, innerHeight } = window;
        this.canvas.width = innerWidth * 0.9;
        this.canvas.height = innerHeight * 0.8;
    
        this.recenter();
    }

    // check the mouse pos with setinterval
    spawnBall(fromVec: Vec2, randOffset: boolean = true): void {
        const mousePos = this.mousePos;

        // to avoid overlapping balls on spawn slight offset
        const offsets = {
            x: randOffset ? randFloat(0, 0.5) : 0,
            y: randOffset ? randFloat(0, 0.5) : 0
        }

        const vel = mousePos.subtract(fromVec).multiply(0.075);
        this.balls.push(new Ball(
            fromVec.x + offsets.x,
            fromVec.y + offsets.y,
            this.ballParams.radius,
            vel.x,
            vel.y,
            this.ballParams.elasticity,
            `hsl(${Math.random() * 360}, 100%, 50%)`
        ));
    }

    // ------------------------------
    updateUserSettings(): void {
        // ------------------------------
        // ball stats
        const numBalls = document.querySelector('.num-balls') as HTMLDivElement;
        numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}; Average energy: ${this.getAverageEnergy}`;

        // ------------------------------
        // ball settings
        const ballRadius_label = document.querySelector('.ball-radius-label') as HTMLInputElement;
        ballRadius_label.innerHTML = `Ball radius (${this.ballParams.radius})`;
        // ball elasticity
        const ballElasticity_label = document.querySelector('.ball-elasticity-label') as HTMLInputElement;
        ballElasticity_label.innerHTML = `Ball elasticity (${this.ballParams.elasticity})`;

        // ------------------------------
        // universe settings
        const addEnergySlider_label = document.querySelector('.energy-slider-label') as HTMLInputElement;
        addEnergySlider_label.innerHTML = `Add energy (0):`
        // --------------
        const addRemoveNumBalls = document.querySelector('.add-n-balls-slider-label') as HTMLInputElement;
        addRemoveNumBalls.innerHTML = `Add/delete n balls (1):`
        // --------------
        const gravitySlider_label = document.querySelector('.gravity-slider-label') as HTMLInputElement;
        gravitySlider_label.innerHTML = `Gravity:`
        // --------------
        // time
        const timeSlider_label = document.querySelector('.time-slider-label') as HTMLInputElement;
        timeSlider_label.innerHTML = `Time ms:`

        setInterval(() => {
            // ball stats
            numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}; Average energy: ${this.getAverageEnergy}`;

            // ------------------------------
            // ball radius
            ballRadius_label.innerHTML = `Ball radius (${this.ballParams.radius})`;
            const ballRadius_value = document.querySelector('.ball-radius-value') as HTMLInputElement;
            this.ballParams.radius = parseInt(ballRadius_value.value);
            // ball elasticity
            ballElasticity_label.innerHTML = `Ball elasticity (${this.ballParams.elasticity})`;
            const ballElasticity_value = document.querySelector('.ball-elasticity-value') as HTMLInputElement;
            this.ballParams.elasticity = parseFloat(ballElasticity_value.value);

            // ------------------------------
            // universe settings
            // add energy to all balls
            addEnergySlider_label.innerHTML = `Add energy (${this.ballSliders.addEnergySlider}):`
            const addEnergySlider_value = document.querySelector('.energy-slider-value') as HTMLInputElement;
            this.ballSliders.addEnergySlider = parseInt(addEnergySlider_value.value);

            // number of balls per click
            addRemoveNumBalls.innerHTML = `Add/delete n balls (${this.ballSliders.addRemoveNumBalls}):`
            const addRemoveNumBalls_value = document.querySelector('.add-n-balls-slider-value') as HTMLInputElement;
            this.ballSliders.addRemoveNumBalls = parseInt(addRemoveNumBalls_value.value);

            // gravity
            gravitySlider_label.innerHTML = `Gravity:`
            const gravitySlider_value = document.querySelector('.gravity-slider-value') as HTMLInputElement;
            this.gravity = parseFloat(gravitySlider_value.value);

            // time
            timeSlider_label.innerHTML = `Time ms:`
            const timeSlider_value = document.querySelector('.time-slider-value') as HTMLInputElement;
            this.physicsInterval = parseInt(timeSlider_value.value);
        }, 250);
    }

    // ------------------------------
    animate(): void {
        requestAnimationFrame(this.animate.bind(this));

        // clear the screen to draw again every frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw a marker centre screen to canvasDims
        Ball.draw(this.ctx, new Ball(this.centreBall.x, this.centreBall.y, this.ballParams.radius));

        // draw a red ring 2 times bigger around centreBall
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.arc(this.centreBall.x, this.centreBall.y, this.ballParams.radius * 2, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();

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
            const gravity_value = yWallsCollide ? 0 : this.gravity;
            ball.applyForce(new Vec2(0, gravity_value));
    
            // ------------------------------
            // ball energy modifications
            // add this.addEnergySlider to the balls energy
            if (this.ballSliders.addEnergySlider != 0) {
                // if ball energy is 0 then apply a random velocity
                if (ball.energy == 0) {
                    ball.velocity = Vec2.fromAngle(randFloat(0, Math.PI * 2)).multiply(randFloat(0, 0.5));
                }

                ball.addEnergy(this.ballSliders.addEnergySlider / 50);
            }

            // ------------------------------
            // ball collisions
            for (let j = 0; j < this.balls.length; j++) {
                const ball2 = this.balls[j];
                if (ball != ball2) {
                    const distance = ball.position.distance(ball2.position);
                    const radiusSum = ball.radius + ball2.radius;
                    if (distance < radiusSum) {
                        // if balls collide then bounce
                        const normal = ball.position.subtract(ball2.position).normalise();
                        const tangent = new Vec2(-normal.y, normal.x);
                        const dpTan1 = ball.velocity.dot(tangent);
                        const dpTan2 = ball2.velocity.dot(tangent);
                        const dpNorm1 = ball.velocity.dot(normal);
                        const dpNorm2 = ball2.velocity.dot(normal);
                        const m1 = (dpNorm1 * (ball.mass - ball2.mass) + 2 * ball2.mass * dpNorm2) / (ball.mass + ball2.mass);
                        const m2 = (dpNorm2 * (ball2.mass - ball.mass) + 2 * ball.mass * dpNorm1) / (ball.mass + ball2.mass);
                        ball.velocity = tangent.multiply(dpTan1).add(normal.multiply(m1));
                        ball2.velocity = tangent.multiply(dpTan2).add(normal.multiply(m2));
                    }
                }
            }
        }
    }
}
