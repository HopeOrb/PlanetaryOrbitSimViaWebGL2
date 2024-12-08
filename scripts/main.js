//import './../style/style.css'; # Done from the html page. I remember that css shouşdn't be imported from script anyway.
import * as THREE from './../node_modules/three/build/three.module.js';
// importing orbital controls for the camera
import {GLTFLoader} from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons";

const main = () => {
	const theCanvas = document.getElementById("the_canvas"); // Use our already-existent canvas
	
	// Initialize Three.js
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({canvas: theCanvas});
	camera.position.set(4, 4, 8);
	camera.lookAt(0, 0, 0);
	// Add orbit controller
	const controls = new OrbitControls(camera,renderer.domElement);

	// Orbit controller configurations
	controls.panSpeed = 2;
	controls.rotateSpeed = 2;
	controls.zoomSpeed = 2;
	controls.maxDistance = 30;
	controls.minDistance = 5;
	// Set the size of the canvas for best visual experience
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	// Do not add as we're using an existing canvas and not creating a new one from the depths of Three.JS
//	document.body.appendChild(renderer.domElement);

	// // Variables to track mouse state
	// let isLMBPressed = false, isRMBPressed = false, isMMBPressed = false;
	// let lastMousePosition = { x: 0, y: 0 };
	//
	// // Mouse event handlers
	// window.addEventListener("mousedown", (event) => {
	// 	if (event.button === 0) isLMBPressed = true; // Left Mouse Button
	// 	if (event.button === 2) isRMBPressed = true; // Right Mouse Button
	//
	// });
	//
	// window.addEventListener("mouseup", (event) => {
	// 	if (event.button === 0) isLMBPressed = false;
	// 	if (event.button === 2) isRMBPressed = false;
	//
	// });
	//
	// window.addEventListener("mousemove", (event) => {
	// 	const deltaX = event.movementX;
	// 	const deltaY = event.movementY;
	//
	// 	if (isLMBPressed) {
	// 		// Translate camera (X and Y axes)
	// 		camera.position.x -= deltaX * 0.01;
	// 		camera.position.y += deltaY * 0.01;
	// 	} else if (isRMBPressed) {
	// 		// Rotate camera (change look direction)
	// 		camera.rotation.y -= deltaX * 0.01;
	// 		camera.rotation.x -= deltaY * 0.01;
	// 	}
	//
	// 	lastMousePosition.x = event.clientX;
	// 	lastMousePosition.y = event.clientY;
	// });
	// window.addEventListener("wheel", (event) => {
	// 	// Zoom in/out with scroll wheel
	// 	camera.position.z += event.deltaY * 0.01;
	// });
	//
	// // Prevent default context menu on right-click
	// window.addEventListener("contextmenu", (event) => event.preventDefault());
	
	const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshStandardMaterial({color: 0x000055});
	
	const centerCube = new THREE.Mesh( cubeGeometry, material );
	centerCube.position.set(0, 0, 0);
	scene.add(centerCube);
	
	const orbitCube = new THREE.Mesh( cubeGeometry, material );
	
	
	let t = 0;
	orbitCube.position.set(2*Math.cos(t), 0, 2*Math.sin(t));
	scene.add(orbitCube);
	
	
	
	{ // Look from up
//		camera.position.set(0, 12, 0);
//		camera.lookAt(0, 0, 0);
	}
	{ // Point light
		const plight = new THREE.PointLight( 0xffffff, 100, 0 );
		plight.position.set(-3, 3, 3);
		scene.add(plight);
	} { // Ambient light
		const alight = new THREE.AmbientLight(0xffffff, 10);
		scene.add(alight);
	}
	
	const animateStep = (timestamp) => {
		
		{ // Move the orbit cube
			const t = timestamp / 1000 * 3;
			const a = 4, b = 5;
			const focusDistance = (b**2 - a**2)**0.5;
			let x = a * Math.cos(t);
			let y = 0;
			let z = b * Math.sin(t);
			z = z - focusDistance; // Move the orbit so that one of its focuses align into the center cube that is also at (0, 0, 0)
			{
				const th = -60 * (Math.PI / 180); // Tilt the orbit around (0, 0, 0) by some degrees
				// Too me like hours to fix it!!! The second param should not be calcullated based on the
				// modified version of the first version!!!!!!
				const xNew =  x * Math.cos(th) + z * Math.sin(th);
				const zNew = -x * Math.sin(th) + z * Math.cos(th);
				x = xNew;
				z = zNew;
			}
			{
				const th = -15 * (Math.PI / 180); // Tilt the orbit around (0, 0, 0) by some degrees
				const xNew =  x * Math.cos(th) + y * Math.sin(th);
				const yNew = -x * Math.sin(th) + y * Math.cos(th);
				x = xNew;
				y = yNew;
			}
			orbitCube.position.set(x, y, z);
		}
		{ // Rotate the orbit cube
			const t = timestamp / 1000 * 2;
			orbitCube.rotation.y = t;
			orbitCube.rotation.x = -1.3*t;
		}
		{ // Rotate the center cube
			const t = timestamp / 1000;
			centerCube.rotation.y = t;
		}
		
		renderer.render(scene, camera);
	}
	
	const animate = (timestamp) => {
		animateStep(timestamp); // Call the actual animation frame
		requestAnimationFrame(animate); // Request to be called again
	}
	
	requestAnimationFrame(animate); // Request to be called again
}


main();