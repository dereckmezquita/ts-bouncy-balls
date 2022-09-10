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

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst GameManager_1 = __webpack_require__(/*! ./modules/GameManager */ \"./src/ts/modules/GameManager.ts\");\nconst canvas = document.getElementById('canvas');\nconst game = new GameManager_1.GameManager(canvas);\n\n\n//# sourceURL=webpack:///./src/ts/index.ts?");

/***/ }),

/***/ "./src/ts/modules/Ball.ts":
/*!********************************!*\
  !*** ./src/ts/modules/Ball.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Ball = void 0;\nconst Vec2_1 = __webpack_require__(/*! ./Vec2 */ \"./src/ts/modules/Vec2.ts\");\nclass Ball {\n    // radius and velocity have to be passed\n    constructor(x = 0, y = 0, radius = 5, vX = 0, vY = 0, elasticity = 1, colour = '#ff0000') {\n        this.energy = 0;\n        this.elasticity = 1;\n        this.xColliding = false;\n        this.yColliding = false;\n        this.density = 0.01;\n        this.position = new Vec2_1.Vec2(x, y);\n        this.radius = radius;\n        this.drawPosition = new Vec2_1.Vec2(x, y);\n        this.velocity = new Vec2_1.Vec2(vX, vY);\n        this.colour = colour;\n        if (elasticity > 1) {\n            this.elasticity = 1;\n        }\n        else if (elasticity < 0) {\n            this.elasticity = 0;\n        }\n        else {\n            this.elasticity = elasticity;\n        }\n        this.mass = (Math.PI * this.radius ** 2) * this.density;\n        this.energy = (this.mass / 2) * this.velocity.magnitude ** 2;\n    }\n    // takes a number to add energy to the ball\n    // we are adding to the normalised vector of the velocity\n    addEnergy(energy) {\n        this.energy += energy;\n        this.calculateVelocity();\n    }\n    removeEnergy(energy) {\n        const newEnergy = this.energy - energy;\n        if (newEnergy < 0) {\n            this.energy = 0;\n        }\n        else {\n            this.energy = newEnergy;\n        }\n        this.calculateVelocity();\n    }\n    // kinectic energy is calculated by m/2 * velocity ^ 2\n    // we are calculating the magnitude of the ball\n    // reminder magnitude is the lenght of a vector\n    // then we can apply (multiply) the magnitude to the velocity after it is normalised\n    calculateVelocity() {\n        // e = mc^2\n        // c = sqrt(e / m / 2)\n        const newMagnitude = Math.sqrt(this.energy / (this.mass / 2));\n        (Math.round(newMagnitude) == 0 ? this.velocity = new Vec2_1.Vec2() : this.velocity = this.velocity.normalise().multiply(newMagnitude));\n    }\n    calculateEnergy() {\n        // e = (c^2) * m / 2\n        this.energy = (this.velocity.magnitude ** 2) * (this.mass / 2);\n    }\n    applyForce(force) {\n        this.velocity = this.velocity.add(force);\n        this.calculateEnergy();\n    }\n    // changes the direction without affecting the magnitude\n    // so no need to update energy etc\n    setDirection(direction) {\n        this.velocity = direction.multiply(this.velocity.magnitude);\n    }\n    // static checkBallCollision(ball2: Ball)\n    // ------------------------------\n    // helper methods\n    static draw(ctx, ball) {\n        ctx.beginPath();\n        ctx.arc(ball.drawPosition.x, ball.drawPosition.y, ball.radius, 0, Math.PI * 2);\n        ctx.fillStyle = ball.colour;\n        ctx.fill();\n    }\n}\nexports.Ball = Ball;\n\n\n//# sourceURL=webpack:///./src/ts/modules/Ball.ts?");

/***/ }),

/***/ "./src/ts/modules/GameManager.ts":
/*!***************************************!*\
  !*** ./src/ts/modules/GameManager.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GameManager = void 0;\nconst Vec2_1 = __webpack_require__(/*! ./Vec2 */ \"./src/ts/modules/Vec2.ts\");\nconst Ball_1 = __webpack_require__(/*! ./Ball */ \"./src/ts/modules/Ball.ts\");\nconst helpers_1 = __webpack_require__(/*! ./helpers */ \"./src/ts/modules/helpers.ts\");\nclass GameManager {\n    // ------------------------------\n    constructor(canvas) {\n        this.physicsInterval = 10;\n        this.mousePos = new Vec2_1.Vec2(1, 1);\n        this.centreBall = new Vec2_1.Vec2();\n        this.mouseDown = false;\n        this.ballParams = {\n            radius: 5,\n            elasticity: 0.75,\n            angleNoise: 5,\n            energyNoise: 0.3 // float\n        };\n        this.ballSliders = {\n            addEnergySlider: 0,\n            addNumBalls: 1\n        };\n        this.balls = [];\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n        // prevent menu when right click\n        document.body.addEventListener('contextmenu', e => {\n            e.preventDefault();\n        });\n        // ------------------------------\n        this.resize();\n        this.recenter();\n        window.addEventListener('resize', this.resize.bind(this));\n        // update current mouse position\n        this.canvas.addEventListener('mousemove', (e) => {\n            this.mousePos = new Vec2_1.Vec2(e.offsetX, e.offsetY);\n        });\n        // ------------------------------\n        // right click spawn balls\n        setInterval(() => {\n            if (this.mouseDown) {\n                for (let i = 0; i < this.ballSliders.addNumBalls; i++) {\n                    this.spawnBall(this.centreBall);\n                }\n            }\n        }, 50);\n        // ------------------------------\n        this.canvas.addEventListener('mousedown', (e) => {\n            const button = e.button;\n            if (button === 2)\n                this.mouseDown = true;\n            // for this.ballSliders.addNumBalls.length\n            if (button === 0) {\n                for (let i = 0; i < this.ballSliders.addNumBalls; i++) {\n                    this.spawnBall(this.centreBall);\n                }\n            }\n        });\n        this.canvas.addEventListener('mouseup', (e) => {\n            const button = e.button;\n            if (button === 2)\n                this.mouseDown = false;\n        });\n        // if mouse leaves canvas area\n        this.canvas.addEventListener('mouseout', (e) => {\n            const button = e.button;\n            if (button === 2)\n                this.mouseDown = false;\n        });\n        // ------------------------------\n        this.animate();\n        setInterval(this.physicsUpdate.bind(this), this.physicsInterval);\n        // ------------------------------\n        // print to html\n        const numBalls = document.querySelector('.num-balls');\n        numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}`;\n        // --------------\n        const addEnergySlider_label = document.querySelector('.energy-slider-label');\n        addEnergySlider_label.innerHTML = `Add energy (0):`;\n        // --------------\n        const addNumBalls = document.querySelector('.add-n-balls-slider-label');\n        addNumBalls.innerHTML = `Add/delete n balls (1):`;\n        // print to html every n\n        setInterval(() => {\n            // number of balls\n            numBalls.innerHTML = `Balls: ${this.balls.length}; Average speed: ${this.getAverageSpeed}`;\n            // add energy to all balls\n            addEnergySlider_label.innerHTML = `Add energy (${this.ballSliders.addEnergySlider}):`;\n            const addEnergySlider_value = document.querySelector('.energy-slider-value');\n            this.ballSliders.addEnergySlider = parseInt(addEnergySlider_value.value);\n            // number of balls per click\n            addNumBalls.innerHTML = `Add/delete n balls (${this.ballSliders.addNumBalls}):`;\n            const addNumBalls_value = document.querySelector('.add-n-balls-slider-value');\n            this.ballSliders.addNumBalls = parseInt(addNumBalls_value.value);\n        }, 250);\n    }\n    get getAverageSpeed() {\n        if (this.balls.length == 0)\n            return 0;\n        let totalSpeed = 0;\n        for (const ball of this.balls) {\n            totalSpeed += ball.velocity.magnitude;\n        }\n        return (totalSpeed / this.balls.length).toFixed(3);\n    }\n    recenter() {\n        this.centreBall.x = this.canvas.width / 2;\n        this.centreBall.y = this.canvas.height / 2;\n    }\n    resize() {\n        const { innerWidth, innerHeight } = window;\n        this.canvas.width = innerWidth * 0.9;\n        this.canvas.height = innerHeight * 0.9;\n        this.recenter();\n    }\n    // check the mouse pos with setinterval\n    spawnBall(fromVec) {\n        const mousePos = this.mousePos;\n        const vel = mousePos.subtract(fromVec).multiply(0.075);\n        this.balls.push(new Ball_1.Ball(fromVec.x, fromVec.y, this.ballParams.radius, vel.x, vel.y, this.ballParams.elasticity, `hsl(${Math.random() * 360}, 100%, 50%)`));\n    }\n    // ------------------------------\n    animate() {\n        requestAnimationFrame(this.animate.bind(this));\n        // clear the screen to draw again every frame\n        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n        // draw a marker centre screen to canvasDims\n        Ball_1.Ball.draw(this.ctx, new Ball_1.Ball(this.centreBall.x, this.centreBall.y, this.ballParams.radius));\n        // draw the ball\n        for (const ball of this.balls) {\n            Ball_1.Ball.draw(this.ctx, ball);\n        }\n    }\n    // ------------------------------\n    physicsUpdate() {\n        for (let i = 0; i < this.balls.length; i++) {\n            const ball = this.balls[i];\n            ball.position = ball.position.add(ball.velocity);\n            ball.drawPosition = ball.position;\n            // if the ball goes off canvas remove from array\n            if (ball.position.x > this.canvas.width || ball.position.x < 0 || ball.position.y > this.canvas.height || ball.position.y < 0) {\n                // balls.splice(i, 1);\n            }\n            // if the ball hits wall bounce\n            const xWallsCollide = (ball.position.x > this.canvas.width - ball.radius || ball.position.x < ball.radius);\n            const yWallsCollide = (ball.position.y > this.canvas.height - ball.radius || ball.position.y < ball.radius);\n            if (xWallsCollide) {\n                if (!ball.xColliding) { // Prevent ball wall collision event from firing multiple times IN A ROW (back to back).\n                    ball.xColliding = true;\n                    ball.velocity.x = -ball.velocity.x;\n                    ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * (0, helpers_1.randFloat)(1, this.ballParams.energyNoise));\n                }\n            }\n            else {\n                ball.xColliding = false;\n            }\n            if (yWallsCollide) {\n                if (!ball.yColliding) {\n                    ball.yColliding = true;\n                    ball.velocity.y = -ball.velocity.y;\n                    ball.removeEnergy((ball.energy * (1 - ball.elasticity)) * (0, helpers_1.randFloat)(1, this.ballParams.energyNoise));\n                }\n            }\n            else {\n                ball.yColliding = false;\n            }\n            if (xWallsCollide || yWallsCollide) {\n                const mag = ball.velocity.magnitude; //Convsere ball's velocity\n                let dir = ball.velocity.toAngle(); //Angle of ball in radians\n                const angleNoiseRads = this.ballParams.angleNoise * Math.PI / 180; //Convert bounce noise from degrees to radians\n                dir += (0, helpers_1.randFloat)(-angleNoiseRads, angleNoiseRads);\n                ball.velocity = Vec2_1.Vec2.fromAngle(dir).multiply(mag); // convert direction (normalised vector) and multiply by magnitude to get original vector\n            }\n            // avoids balls sinking into the floor\n            const gravity = yWallsCollide ? 0 : 0.1;\n            ball.applyForce(new Vec2_1.Vec2(0, gravity));\n            // add this.addEnergySlider to the balls energy\n            if (this.ballSliders.addEnergySlider > 0) {\n                ball.addEnergy(this.ballSliders.addEnergySlider / 50);\n            }\n        }\n    }\n}\nexports.GameManager = GameManager;\n\n\n//# sourceURL=webpack:///./src/ts/modules/GameManager.ts?");

/***/ }),

/***/ "./src/ts/modules/Vec2.ts":
/*!********************************!*\
  !*** ./src/ts/modules/Vec2.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n// https://docs.godotengine.org/en/stable/tutorials/math/vector_math.html\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Vec2 = void 0;\nclass Vec2 {\n    constructor(x = 0, y = 0) {\n        this.x = x;\n        this.y = y;\n    }\n    add(v) {\n        return new Vec2(this.x + v.x, this.y + v.y);\n    }\n    subtract(v) {\n        return new Vec2(this.x - v.x, this.y - v.y);\n    }\n    multiply(scalar) {\n        return new Vec2(this.x * scalar, this.y * scalar);\n    }\n    divide(v) {\n        return new Vec2(this.x / v.x, this.y / v.y);\n    }\n    get magnitude() {\n        return Math.sqrt(this.x ** 2 + this.y ** 2);\n    }\n    // calculate magnitude\n    // magnitude = sqrt(x^2 + y^2)\n    normalise() {\n        if (this.magnitude > 0)\n            return new Vec2(this.x / this.magnitude, this.y / this.magnitude);\n        throw new Error(\"Cannot normalise a vector with magnitude 0\");\n    }\n    // dot product returns scalar\n    // scalar is a magnitude calculated from two vectors\n    dot(v) {\n        return this.x * v.x + this.y * v.y;\n    }\n    // pythagoras theorem to find distance between two points\n    distance(vec2) {\n        const lX = this.x - vec2.x;\n        const lY = this.y - vec2.y;\n        return Math.sqrt(lX ** 2 + lY ** 2);\n    }\n    // returns normalised vector\n    // values between 0 and 1\n    direction(v) {\n        return v.subtract(this).normalise();\n    }\n    // convert cartesian coordinates to radian angle\n    toAngle() {\n        return Math.atan2(this.y, this.x);\n    }\n    static fromAngle(radians) {\n        return new Vec2(Math.cos(radians), Math.sin(radians));\n    }\n}\nexports.Vec2 = Vec2;\n\n\n//# sourceURL=webpack:///./src/ts/modules/Vec2.ts?");

/***/ }),

/***/ "./src/ts/modules/helpers.ts":
/*!***********************************!*\
  !*** ./src/ts/modules/helpers.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.randFloat = void 0;\nfunction randFloat(min, max) {\n    return Math.random() * (max - min) + min;\n}\nexports.randFloat = randFloat;\n\n\n//# sourceURL=webpack:///./src/ts/modules/helpers.ts?");

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