import { Vec2 } from "./modules/Vec2";
import { Ball } from "./modules/Ball";
import { randFloat } from "./modules/helpers";

export class GameManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    physicsInterval: number = 10;
    mousePos: Vec2 = new Vec2(1, 1);

    mouseDown = {
        left: false,
        right: false,
        middle: false
    }

    universeParams = {
        centreBall: new Vec2(0, 0),
        friction: 0.01,
        gravity: 0.1,
        interBallAttraction: 0.1,
        mouseAttractor: false,
        ballsAttractor: false
    }

    ballParams = {
        radius: 1,
        elasticity: 0.75,
        angleNoise: 5, // degrees
        energyNoise: 0.3 // float
    }

    userParams = {
        spawnSelector: "ball",
        addEnergySlider: 0,
        addRemoveNumBalls: 1
    }

    balls: Ball[] = [];
    blackHoles: Ball[] = [];

    // ------------------------------
    constructor(canvas: HTMLCanvasElement) {
        this.animate = this.animate.bind(this);

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
                if (this.userParams.spawnSelector == "ball") {
                    for (let i = 0; i < this.userParams.addRemoveNumBalls; i++) {
                        this.spawnBall(this.universeParams.centreBall);
                    }
                } else if (this.userParams.spawnSelector == "blackHole") {
                    for (let i = 0; i < this.userParams.addRemoveNumBalls; i++) {
                        this.spawnGravity(this.mousePos);
                    }
                }
            }
        }, 50);

        // ------------------------------
        // mouse click spawn balls
        this.canvas.addEventListener('mousedown', (e) => {
            const button = e.button;
            if (button === 2) this.mouseDown.left = true;
            if (button === 1) this.mouseDown.middle = true;
            // for this.userParams.addRemoveNumBalls.length
            if (button === 0) {
                if (this.userParams.spawnSelector == "ball") {
                    for (let i = 0; i < this.userParams.addRemoveNumBalls; i++) {
                        this.spawnBall(this.universeParams.centreBall);
                    }
                } else if (this.userParams.spawnSelector == "blackHole") {
                    for (let i = 0; i < this.userParams.addRemoveNumBalls; i++) {
                        this.spawnGravity(this.mousePos);
                    }
                }
            }

            // delete n balls if middle button
            if (button === 1) {
                if (this.userParams.spawnSelector == "ball") {
                    this.balls.splice(0, this.userParams.addRemoveNumBalls);
                } else if (this.userParams.spawnSelector == "blackHole") {
                    this.blackHoles.splice(0, this.userParams.addRemoveNumBalls);
                }
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
        if (this.balls.length == 0) return 0;

        let totalSpeed = 0;
        for (const ball of this.balls) {
            totalSpeed += ball.velocity.magnitude;
        }

        return (totalSpeed / this.balls.length).toFixed(3);
    }

    get getAverageEnergy() {
        if (this.balls.length == 0) return 0;

        let totalEnergy = 0;
        for (const ball of this.balls) {
            totalEnergy += ball.energy;
        }

        return (totalEnergy / this.balls.length).toFixed(3);
    }

    recenter(): void {
        this.universeParams.centreBall.x = this.canvas.width / 2;
        this.universeParams.centreBall.y = this.canvas.height / 2;
    }

    resize(): void {
        const { innerWidth, innerHeight } = window;
        this.canvas.width = innerWidth * 0.9;
        this.canvas.height = innerHeight * 0.8;

        this.recenter();
    }

    // check the mouse pos with setinterval
    spawnBall(fromVec: Vec2, colour: string = `hsl(${Math.random() * 360}, 100%, 50%)`, randOffset: boolean = true): void {
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
            colour
        ));
    }

    spawnGravity(fromVec: Vec2, randOffset: boolean = true): void {
        const mousePos = this.mousePos;

        // to avoid overlapping balls on spawn slight offset
        const offsets = {
            x: randOffset ? randFloat(0, 0.5) : 0,
            y: randOffset ? randFloat(0, 0.5) : 0
        }

        // const vel = mousePos.subtract(fromVec).multiply(0.075);
        this.blackHoles.push(new Ball(
            fromVec.x + offsets.x,
            fromVec.y + offsets.y,
            this.ballParams.radius,
            0,
            0,
            0,
            "hsl(0, 0%, 0%)"
        ));
    }

    // ------------------------------
    updateUserSettings(): void {
        const updateParams = () => {
            // Update universe parameters
            this.universeParams.mouseAttractor = (document.querySelector("#mouse-cog") as HTMLInputElement).checked;
            this.universeParams.ballsAttractor = (document.querySelector("#inter-ball-cog") as HTMLInputElement).checked;
            this.universeParams.gravity = parseFloat((document.querySelector('.gravity-slider-value') as HTMLInputElement).value);
            this.universeParams.interBallAttraction = parseFloat((document.querySelector('.inter-ball-gravity-value') as HTMLInputElement).value);
    
            // Update ball parameters
            this.ballParams.radius = parseInt((document.querySelector('.ball-radius-value') as HTMLInputElement).value);
            this.ballParams.elasticity = parseFloat((document.querySelector('.ball-elasticity-value') as HTMLInputElement).value);
    
            // Update user parameters
            this.userParams.spawnSelector = (document.querySelector('#spawn-ball') as HTMLInputElement).checked ? "ball" : "blackHole";
            this.userParams.addEnergySlider = parseInt((document.querySelector('.energy-slider-value') as HTMLInputElement).value);
            this.userParams.addRemoveNumBalls = parseInt((document.querySelector('.add-n-balls-slider-value') as HTMLInputElement).value);
    
            // Update physics interval
            this.physicsInterval = parseInt((document.querySelector('.time-slider-value') as HTMLInputElement).value);
    
            // Update innerHTML for display elements
            (document.querySelector('.num-balls') as HTMLDivElement).innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}; Average energy: ${this.getAverageEnergy}`;
            (document.querySelector('.ball-radius-label') as HTMLDivElement).innerHTML = `Ball radius (${this.ballParams.radius})`;
            (document.querySelector('.ball-elasticity-label') as HTMLDivElement).innerHTML = `Ball elasticity (${this.ballParams.elasticity})`;
            (document.querySelector('.energy-slider-label') as HTMLDivElement).innerHTML = `Add energy (${this.userParams.addEnergySlider})`;
            (document.querySelector('.add-n-balls-slider-label') as HTMLDivElement).innerHTML = `Add/delete n balls (${this.userParams.addRemoveNumBalls})`;
        };
    
        document.querySelectorAll("input").forEach(element => {
            element.addEventListener("change", updateParams);
            element.addEventListener("input", updateParams);
        });
    
        updateParams();
    }

    updateGameStats(): void {
        const numBallsElement = document.querySelector('.num-balls') as HTMLDivElement;
        numBallsElement.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}; Average energy: ${this.getAverageEnergy}`;
    }

    // ------------------------------
    animate(): void {
        requestAnimationFrame(this.animate);

        // clear the screen to draw again every frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw a marker centre screen to canvasDims
        Ball.draw(this.ctx, new Ball(this.universeParams.centreBall.x, this.universeParams.centreBall.y, this.ballParams.radius));

        // draw a red ring 2 times bigger around centreBall
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.arc(this.universeParams.centreBall.x, this.universeParams.centreBall.y, this.ballParams.radius * 2, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();

        // draw the ball
        for (const ball of this.balls) {
            Ball.draw(this.ctx, ball);
        }

        for (const cog of this.blackHoles) {
            Ball.draw(this.ctx, cog);
        }

        this.updateGameStats();
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

            // floor collision; avoid balls falling through floor
            if (ball.position.y + ball.radius > this.canvas.height) {
                // Adjust ball position to sit right on the floor
                ball.position.y = this.canvas.height - ball.radius;

                // Reflect the y-velocity and apply damping factor
                const dampingFactor = 0; // Adjust as needed for realism
                ball.velocity.y = -ball.velocity.y * ball.elasticity * dampingFactor;

                ball.yColliding = true;
            } else {
                ball.yColliding = false;
            }

            if (xWallsCollide || yWallsCollide) {
                const mag = ball.velocity.magnitude; //Convsere ball's velocity
                let dir = ball.velocity.toRadians; //Angle of ball in radians
                const angleNoiseRads = this.ballParams.angleNoise * Math.PI / 180; //Convert bounce noise from degrees to radians
                dir += randFloat(-angleNoiseRads, angleNoiseRads);
                ball.velocity = Vec2.fromAngle(dir).multiply(mag); // convert direction (normalised vector) and multiply by magnitude to get original vector
            }

            // ------------------------------
            // gravity down
            // avoids balls sinking into the floor
            const gravity_value = yWallsCollide ? 0 : this.universeParams.gravity;
            ball.applyForce(new Vec2(0, gravity_value));

            // calculate gravity constant
            const gravity_inter_ball_value = yWallsCollide ? 0 : this.universeParams.interBallAttraction * 10;

            // gravity to mouse pos
            if (this.universeParams.mouseAttractor) {
                ball.applyForce(this.mousePos.subtract(ball.position).normalise.multiply(gravity_inter_ball_value));
            }

            // black hole gravity
            for (const cog of this.blackHoles) {
                // gravity is stronger if the ball has more mass
                // inverse square law dimishes the effect
                const distance = ball.position.distance(cog.position);
                const gravity_force = (gravity_inter_ball_value * cog.mass) / (4 * Math.PI * distance * distance);
                ball.applyForce(cog.position.subtract(ball.position).normalise.multiply(gravity_force));
            }

            // ------------------------------
            // ball energy modifications
            // a tiny amount of energy is added constantly; think of it as heat
            // if ball energy is 0 then apply a random velocity
            if (ball.energy == 0) {
                ball.velocity = Vec2.fromAngle(randFloat(0, Math.PI * 2)).multiply(randFloat(0, 0.1));
                ball.addEnergy(randFloat(0, 0.1));
            }

            // add this.addEnergySlider to the balls energy
            if (this.userParams.addEnergySlider != 0) {
                ball.addEnergy(this.userParams.addEnergySlider / 50);
            }

            // ------------------------------
            // ball interactions
            for (let j = 0; j < this.balls.length; j++) {
                const ball2 = this.balls[j];
                if (ball != ball2) {
                    // collisions
                    Ball.calculateCollision(ball, ball2);
                    // inter ball gravity
                    if (this.universeParams.ballsAttractor) {
                        const distance = ball.position.distance(ball2.position);
                        const gravity_force = (gravity_inter_ball_value * ball2.mass) / (4 * Math.PI * distance * distance);
                        ball.applyForce(ball2.position.subtract(ball.position).normalise.multiply(gravity_force));
                        ball2.applyForce(ball.position.subtract(ball2.position).normalise.multiply(gravity_force));
                    }
                }
            }

            // check for collisions with black holes
            for (const cog of this.blackHoles) {
                // Ball.calculateCollision(ball, cog);
                // remove if collision; this.balls.splice(i, 1);
                // check if ball hits very centre of black hole
                if (ball.position.distance(cog.position) < ball.radius * 0.25) {
                    this.balls.splice(i, 1);
                }
            }
        }
    }
}