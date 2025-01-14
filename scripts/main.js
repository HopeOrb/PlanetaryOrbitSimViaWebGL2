import {GameManager} from "./managers/GameManager.js";

const main = () => {
	const theCanvas = document.getElementById("the_canvas");
	// Init GameManager
	const gm = new GameManager(theCanvas);
	// Init Game
	gm.init();
	// Start Simulation
	gm.update();
}

main();