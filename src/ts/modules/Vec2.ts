
// https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html

export class Vec2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    multiply(scalar: number): Vec2 {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vec2 {
        return new Vec2(this.x / scalar, this.y / scalar)
    }

    get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // calculate magnitude
    // magnitude = sqrt(x^2 + y^2)
    get normalise(): Vec2 {
        const mag: number = this.magnitude;

        if (mag > 0) {
            return new Vec2(this.x / mag, this.y / mag);
        }

        throw new Error("Cannot normalise a vector with magnitude 0");
    }

    // dot product returns scalar
    // scalar is a magnitude calculated from two vectors
    dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    // pythagoras theorem to find distance between two points
    distance(vec2: Vec2): number {
        const lX = this.x - vec2.x;
        const lY = this.y - vec2.y;

        return Math.sqrt(lX ** 2 + lY ** 2);
    }

    // returns normalised vector
    // values between 0 and 1
    direction(v: Vec2): Vec2 {
        return v.subtract(this).normalise;
    }

    // convert cartesian coordinates to radian angle
    get toRadians(): number {
        return Math.atan2(this.y, this.x);
    }

    static fromAngle(radians: number): Vec2 {
        return new Vec2(Math.cos(radians), Math.sin(radians));
    }
}
