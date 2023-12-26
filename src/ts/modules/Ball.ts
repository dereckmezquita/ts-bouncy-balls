import { Vec2 } from "./Vec2";

export class Ball {
    energy: number = 0;
    elasticity: number = 1;
    xColliding: boolean = false;
    yColliding: boolean = false;
    position: Vec2;
    drawPosition: Vec2;
    velocity: Vec2;
    mass: number;
    colour: string;
    radius: number;

    density: number = 0.01;

    // radius and velocity have to be passed
    constructor(
        x: number = 0,
        y: number = 0,
        radius: number = 5,
        vX: number = 0,
        vY: number = 0,
        elasticity: number = 0.75,
        colour: string = '#ff0000'
    ) {
        this.position = new Vec2(x, y);
        this.radius = radius;
        this.drawPosition = new Vec2(x, y);
        this.velocity = new Vec2(vX, vY);
        this.colour = colour;

        if (elasticity > 1) {
            this.elasticity = 1;
        } else if (elasticity < 0) {
            this.elasticity = 0;
        } else {
            this.elasticity = elasticity;
        }

        this.mass = (Math.PI * this.radius ** 2) * this.density;
        this.energy = (this.mass / 2) * this.velocity.magnitude ** 2;
    }

    // takes a number to add energy to the ball
    // we are adding to the normalised vector of the velocity
    addEnergy(energy: number): void {
        if (energy !== 0) {
            this.energy += energy;
            this.calculateVelocity();
        }
    }

    removeEnergy(energy: number): void {
        if (energy !== 0) {
            const newEnergy = this.energy - energy;

            if (newEnergy < 0) {
                this.energy = 0;
            } else {
                this.energy = newEnergy;
            }

            this.calculateVelocity();
        }
    }

    // kinectic energy is calculated: ke = 1/2 * m * v^2
    // we are calculating the magnitude of the ball
    // reminder magnitude is the lenght of a vector
    // then we can apply (multiply) the magnitude to the velocity after it is normalised
    calculateVelocity(): void {
        const newMagnitude = Math.sqrt(2 * this.energy / this.mass);

        Math.round(newMagnitude) == 0 ?
            this.velocity = new Vec2() :
            this.velocity = this.velocity.normalise.multiply(newMagnitude);
    }

    calculateEnergy(): void {
        // e = (c^2) * m / 2
        this.energy = (this.velocity.magnitude ** 2) * (this.mass / 2);
    }

    applyForce(force: Vec2): void {
        this.velocity = this.velocity.add(force);
        this.calculateEnergy();
    }

    // changes the direction without affecting the magnitude
    // so no need to update energy etc
    setDirection(direction: Vec2): void {
        this.velocity = direction.multiply(this.velocity.magnitude);
    }

    // ------------------------------
    // helper methods
    static draw(ctx: CanvasRenderingContext2D, ball: Ball, sprite_path?: string): void {
        if (sprite_path) {
            const sprite_image = new Image();
            sprite_image.src = sprite_path;

            ctx.drawImage(
                sprite_image,
                ball.drawPosition.x - ball.radius,
                ball.drawPosition.y - ball.radius,
                ball.radius * 2, ball.radius * 2
            );
        } else {
            ctx.beginPath();
            ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.colour;
            ctx.fill();
        }
    }

    // ball ball collision
    static isColliding(ball: Ball, ball2: Ball): boolean {
        const distance = ball.position.subtract(ball2.position).magnitude;

        if (distance <= ball.radius + ball2.radius) return true;
        return false;
    }

    static calculateCollision(ball: Ball, ball2: Ball): void {
        if (Ball.isColliding(ball, ball2)) {
            // if balls collide then bounce
            const normal = ball.position.subtract(ball2.position).normalise;
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