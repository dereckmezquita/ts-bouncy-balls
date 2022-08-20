/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst math_1 = __webpack_require__(/*! ./modules/math */ \"./src/ts/modules/math.ts\");\nconst ball_1 = __webpack_require__(/*! ./modules/ball */ \"./src/ts/modules/ball.ts\");\n//----------------------------------------[VARIABLES]----------------------------------------\nconst canvas = document.getElementById('canvas');\nconst ctx = canvas.getContext('2d');\nconst balls = [];\nconst physicsInterval = 10;\nconst tweenInterval = 15;\nconst bounceNoise = 5; // degrees\nconst energyNoise = 0.5; // float\nconst ballParams = {\n    radius: 5,\n    elasticity: 0.75\n};\nlet centreBall = new math_1.Vec2();\nlet mousePos = new math_1.Vec2(1, 1);\nlet mouseDown = false;\n//----------------------------------------[INITIALIZATIONS]----------------------------------------\nresize();\nrecenter();\nanimate();\nsetInterval(physicsUpdate, physicsInterval);\nsetInterval(() => {\n    if (mouseDown) {\n        spawnBall();\n    }\n}, 50);\n// setInterval(tween, tweenInterval);\n//----------------------------------------[LISTENERS]----------------------------------------\nwindow.addEventListener('resize', resize);\ndocument.body.addEventListener('contextmenu', e => {\n    e.preventDefault();\n});\n// get mouse position from canvas\ncanvas.addEventListener('mousemove', (e) => {\n    mousePos = new math_1.Vec2(e.offsetX, e.offsetY);\n});\ncanvas.addEventListener('mousedown', (e) => {\n    const butt = e.button;\n    if (butt === 2)\n        mouseDown = true;\n    // if(butt === 1) alert(\"Middle!\");\n    if (butt === 0)\n        spawnBall();\n});\ncanvas.addEventListener('mouseup', (e) => {\n    const butt = e.button;\n    if (butt === 2)\n        mouseDown = false;\n});\ncanvas.addEventListener('mouseout', (e) => {\n    const butt = e.button;\n    if (butt === 2)\n        mouseDown = false;\n});\n//----------------------------------------[FUNCTIONS]----------------------------------------\nfunction recenter() {\n    centreBall.x = canvas.width / 2;\n    centreBall.y = canvas.height / 2;\n}\nfunction resize() {\n    const { innerWidth, innerHeight } = window;\n    canvas.width = innerWidth * 0.9;\n    canvas.height = innerHeight * 0.9;\n    recenter();\n}\n// check the mouse pos with setinterval\nfunction spawnBall() {\n    const spawnPos = centreBall;\n    const vel = mousePos.subtract(spawnPos).multiply(0.03);\n    balls.push(new ball_1.Ball(spawnPos.x, spawnPos.y, ballParams.radius, vel.x, vel.y, ballParams.elasticity, `hsl(${Math.random() * 360}, 100%, 50%)`));\n}\nfunction drawBall(ctx, ball) {\n    ctx.beginPath();\n    ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);\n    ctx.fillStyle = ball.colour;\n    ctx.fill();\n}\nfunction animate() {\n    // only tweening physics calculations done here; approximations\n    requestAnimationFrame(animate);\n    // clear the screen to draw again every frame\n    ctx.clearRect(0, 0, canvas.width, canvas.height);\n    // draw a marker centre screen to canvasDims\n    drawBall(ctx, new ball_1.Ball(centreBall.x, centreBall.y, ballParams.radius));\n    // draw the ball\n    for (const ball of balls) {\n        drawBall(ctx, ball);\n    }\n    console.log(balls.length);\n}\n// function tween() {\n//     ball.drawPos = ball.drawPos.add(ball.velocity.multiply(tweenInterval / physicsInterval));\n// }\nfunction physicsUpdate() {\n    for (let i = 0; i < balls.length; i++) {\n        const ball = balls[i];\n        ball.position = ball.position.add(ball.velocity);\n        ball.drawPosition = ball.position;\n        // if the ball goes off canvas remove from array\n        if (ball.position.x > canvas.width || ball.position.x < 0 || ball.position.y > canvas.height || ball.position.y < 0) {\n            // balls.splice(i, 1);\n        }\n        // if the ball hits wall bounce\n        const xWallsCollide = (ball.position.x > canvas.width - ball.radius || ball.position.x < ball.radius);\n        const yWallsCollide = (ball.position.y > canvas.height - ball.radius || ball.position.y < ball.radius);\n        if (xWallsCollide) {\n            if (!ball.xColliding) { // Prevent ball wall collision event from firing multiple times IN A ROW (back to back).\n                ball.xColliding = true;\n                ball.velocity.x = -ball.velocity.x;\n                ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, energyNoise));\n            }\n        }\n        else {\n            ball.xColliding = false;\n        }\n        if (yWallsCollide) {\n            if (!ball.yColliding) {\n                ball.yColliding = true;\n                ball.velocity.y = -ball.velocity.y;\n                ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * randFloat(1, energyNoise));\n            }\n        }\n        else {\n            ball.yColliding = false;\n        }\n        if (xWallsCollide || yWallsCollide) {\n            const mag = ball.velocity.magnitude; //Convsere ball's velocity\n            let dir = ball.velocity.toAngle(); //Angle of ball in radians\n            const bounceNoiseRads = bounceNoise * Math.PI / 180; //Convert bounce noise from degrees to radians\n            dir += randFloat(-bounceNoiseRads, bounceNoiseRads);\n            ball.velocity = math_1.Vec2.fromAngle(dir).multiply(mag); // convert direction (normalised vector) and multiply by magnitude to get original vector\n        }\n        // avoids balls sinking into the floor\n        const gravity = yWallsCollide ? 0 : 0.1;\n        ball.applyForce(new math_1.Vec2(0, gravity));\n    }\n}\nfunction randFloat(min, max) {\n    return Math.random() * (max - min) + min;\n}\n\n\n//# sourceURL=webpack:///./src/ts/index.ts?");

/***/ }),

/***/ "./src/ts/modules/ball.ts":
/*!********************************!*\
  !*** ./src/ts/modules/ball.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ball = void 0;\nconst math_1 = __webpack_require__(/*! ./math */ \"./src/ts/modules/math.ts\");\nclass Ball {\n    // radius and velocity have to be passed\n    constructor(x = 0, y = 0, radius = 5, vX = 0, vY = 0, elasticity = 1, colour = '#ff0000') {\n        this.energy = 0;\n        this.elasticity = 1;\n        this.xColliding = false;\n        this.yColliding = false;\n        this.density = 0.01;\n        this.position = new math_1.Vec2(x, y);\n        this.radius = radius;\n        this.drawPosition = new math_1.Vec2(x, y);\n        this.velocity = new math_1.Vec2(vX, vY);\n        this.colour = colour;\n        if (elasticity > 1) {\n            this.elasticity = 1;\n        }\n        else if (elasticity < 0) {\n            this.elasticity = 0;\n        }\n        else {\n            this.elasticity = elasticity;\n        }\n        this.mass = (Math.PI * this.radius ** 2) * this.density;\n        this.energy = (this.mass / 2) * this.velocity.magnitude ** 2;\n    }\n    // takes a number to add energy to the ball\n    // we are adding to the normalised vector of the velocity\n    addEnergy(energy) {\n        this.energy += energy;\n        this.calculateVelocity();\n    }\n    removeEnergy(energy) {\n        const newEnergy = this.energy - energy;\n        if (newEnergy < 0) {\n            this.energy = 0;\n        }\n        else {\n            this.energy = newEnergy;\n        }\n        this.calculateVelocity();\n    }\n    // kinectic energy is calculated by m/2 * velocity ^ 2\n    // we are calculating the magnitude of the ball\n    // reminder magnitude is the lenght of a vector\n    // then we can apply (multiply) the magnitude to the velocity after it is normalised\n    calculateVelocity() {\n        // e = mc^2\n        // c = sqrt(e / m / 2)\n        const newMagnitude = Math.sqrt(this.energy / (this.mass / 2));\n        (Math.round(newMagnitude) == 0 ? this.velocity = new math_1.Vec2() : this.velocity = this.velocity.normalise().multiply(newMagnitude));\n    }\n    calculateEnergy() {\n        // e = (c^2) * m / 2\n        this.energy = (this.velocity.magnitude ** 2) * (this.mass / 2);\n    }\n    applyForce(force) {\n        this.velocity = this.velocity.add(force);\n        this.calculateEnergy();\n    }\n    // changes the direction without affecting the magnitude\n    // so no need to update energy etc\n    setDirection(direction) {\n        this.velocity = direction.multiply(this.velocity.magnitude);\n    }\n}\nexports.Ball = Ball;\n\n\n//# sourceURL=webpack:///./src/ts/modules/ball.ts?");

/***/ }),

/***/ "./src/ts/modules/math.ts":
/*!********************************!*\
  !*** ./src/ts/modules/math.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n// https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Vec2 = void 0;\nclass Vec2 {\n    constructor(x = 0, y = 0) {\n        this.x = x;\n        this.y = y;\n    }\n    add(v) {\n        return new Vec2(this.x + v.x, this.y + v.y);\n    }\n    subtract(v) {\n        return new Vec2(this.x - v.x, this.y - v.y);\n    }\n    multiply(scalar) {\n        return new Vec2(this.x * scalar, this.y * scalar);\n    }\n    divide(v) {\n        return new Vec2(this.x / v.x, this.y / v.y);\n    }\n    get magnitude() {\n        return Math.sqrt(this.x ** 2 + this.y ** 2);\n    }\n    // calculate magnitude\n    // magnitude = sqrt(x^2 + y^2)\n    normalise() {\n        if (this.magnitude > 0)\n            return new Vec2(this.x / this.magnitude, this.y / this.magnitude);\n        throw new Error(\"Cannot normalise a vector with magnitude 0\");\n    }\n    // dot product returns scalar\n    // scalar is a magnitude calculated from two vectors\n    dot(v) {\n        return this.x * v.x + this.y * v.y;\n    }\n    // pythagoras theorem to find distance between two points\n    distance(vec2) {\n        const lX = this.x - vec2.x;\n        const lY = this.y - vec2.y;\n        return Math.sqrt(lX ** 2 + lY ** 2);\n    }\n    // returns normalised vector\n    // values between 0 and 1\n    direction(v) {\n        return v.subtract(this).normalise();\n    }\n    // convert cartesian coordinates to radian angle\n    toAngle() {\n        return Math.atan2(this.y, this.x);\n    }\n    static fromAngle(radians) {\n        return new Vec2(Math.cos(radians), Math.sin(radians));\n    }\n}\nexports.Vec2 = Vec2;\n\n\n//# sourceURL=webpack:///./src/ts/modules/math.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ts/index.ts");
/******/ 	
/******/ })()
;