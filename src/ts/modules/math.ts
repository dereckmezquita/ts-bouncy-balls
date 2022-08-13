
// https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html

class Vec2 {
    x; y;

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

    multiply(v: Vec2): Vec2 {
        return new Vec2(this.x * v.x, this.y * v.y);
    }

    divide(v: Vec2): Vec2 {
        return new Vec2(this.x / v.x, this.y / v.y)
    }

    get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // calculate magnitude
    // magnitude = sqrt(x^2 + y^2)
    normalise(): Vec2 {
        if (this.magnitude > 0) return new Vec2(this.x / this.magnitude, this.y / this.magnitude);

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
        return v.subtract(this).normalise();
    }
}
