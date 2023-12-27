export default function updateUserSettings(this: any) {
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