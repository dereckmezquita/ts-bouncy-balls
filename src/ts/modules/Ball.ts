
import { Vec2 } from "./Vec2";

export class Ball {
    energy: number = 0;
    elasticity: number = 1;
    xColliding: boolean = false;
    yColliding: boolean = false;
    position; drawPosition; velocity; mass; colour; radius;

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
        this.energy += energy;
        this.calculateVelocity();
    }

    removeEnergy(energy: number): void {
        const newEnergy = this.energy - energy;

        if (newEnergy < 0) {
            this.energy = 0;
        } else {
            this.energy = newEnergy;
        }

        this.calculateVelocity();
    }

    // kinectic energy is calculated by m/2 * velocity ^ 2
    // we are calculating the magnitude of the ball
    // reminder magnitude is the lenght of a vector
    // then we can apply (multiply) the magnitude to the velocity after it is normalised
    calculateVelocity(): void {
        // e = mc^2
        // c = sqrt(e / m / 2)
        const newMagnitude = Math.sqrt(this.energy / (this.mass / 2));

        (Math.round(newMagnitude) == 0 ? this.velocity = new Vec2() : this.velocity = this.velocity.normalise().multiply(newMagnitude));
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

            ctx.drawImage(sprite_image, ball.drawPosition.x - ball.radius, ball.drawPosition.y - ball.radius, ball.radius * 2, ball.radius * 2);
        } else {
            ctx.beginPath();
            ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.colour;
            ctx.fill();
        }
    }

    // ball ball collision
    colliding(ball2: Ball): boolean {
        const distance = this.position.subtract(ball2.position).magnitude;

        if (distance <= this.radius + ball2.radius) return true;
        return false;
    }
}
