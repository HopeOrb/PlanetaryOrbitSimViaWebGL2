//import './../style/style.css'; # Done from the html page. I remember that css shouşdn't be imported from script anyway.
import * as THREE from './../node_modules/three/build/three.module.js';
// importing orbital controls for the camera
import {GLTFLoader} from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls, TransformControls} from "three/addons";
import Stats from './../node_modules/three/examples/jsm/libs/stats.module.js';

import { setupGUI } from './gui.js';

import { Star } from './classes/Star.js';
import { Planet } from './classes/Planet.js';

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

	// HELPMENU
	const helpMenu = document.getElementById("helpMenu");

	window.addEventListener('keydown', (event) => {
		if (event.key === 'h') {
			// Toggle help menu visibility
			if (helpMenu.style.display === 'none') {
				helpMenu.style.display = 'block';
			} else {
				helpMenu.style.display = 'none';
			}
		}
	});
	//


	// TRYING RAYCASTER
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	let selectedObject = null;

	function createThickAxes(size = 1, thickness = 0.05) {
		const group = new THREE.Group();

		// X Axis (Red)
		const xGeometry = new THREE.CylinderGeometry(thickness, thickness, size, 32);
		const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const xAxis = new THREE.Mesh(xGeometry, xMaterial);
		xAxis.rotation.z = -Math.PI / 2; // Yatay hale getirin
		xAxis.position.x = size / 2;
		group.add(xAxis);

		// Y Axis (Green)
		const yGeometry = new THREE.CylinderGeometry(thickness, thickness, size, 32);
		const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const yAxis = new THREE.Mesh(yGeometry, yMaterial);
		yAxis.position.y = size / 2;
		group.add(yAxis);

		// Z Axis (Blue)
		const zGeometry = new THREE.CylinderGeometry(thickness, thickness, size, 32);
		const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
		const zAxis = new THREE.Mesh(zGeometry, zMaterial);
		zAxis.rotation.x = Math.PI / 2; // Dikeyden yataya çevir
		zAxis.position.z = size / 2;
		group.add(zAxis);

		return group;
	}



	let axisHelper = null;

	function updateAxisHelper(selectedObject) {
		if (axisHelper && axisHelper.parent) {
			axisHelper.parent.remove(axisHelper);
			//scene.remove(axisHelper); // Önceki eksenleri kaldır
		}
		if (selectedObject) {
			axisHelper = createThickAxes(5, 0.1);
			selectedObject.add(axisHelper); // Seçilen objeye ekle
		}
	}


	window.addEventListener('mousemove', (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	});



	const objectDataMap = new Map(); // Her obje için konum ve dönüş verilerini tutar.
	let userRotation = { x: 0, y: 0 };
	let userPosition = { x: 0, y: 0, z: 0 };

	window.addEventListener('click', () => {

		if (event.target.closest('.lil-gui')) {
			return; // GUI'ye tıklanırsa işlem yapma
		}

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			selectedObject = intersects[0].object; // Yeni objeyi seç

			// Mevcut obje için veri varsa yükle, yoksa varsayılan oluştur
			const data = objectDataMap.get(selectedObject) || { userPosition: { x: 0, y: 0, z: 0 }, userRotation: { x: 0, y: 0 } };
			userPosition = data.userPosition;
			userRotation = data.userRotation;
			updateAxisHelper(selectedObject);

			setupGUI(selectedObject);

			console.log("Selected Object:", selectedObject);
		} else {
			console.log("Selected : Null");
			selectedObject = null; // Hiçbir şey seçilmediyse
			updateAxisHelper(null);
			setupGUI(selectedObject);
		}
	});

// Kullanıcı bir hareket veya dönüş yaptığında veriyi güncelle
	window.addEventListener('keydown', (event) => {
		if (selectedObject) {
			const step = 0.1;
			switch (event.key) {
				case 'ArrowUp': userPosition.y += step; break;
				case 'ArrowDown': userPosition.y -= step; break;
				case 'ArrowLeft': userPosition.x -= step; break;
				case 'ArrowRight': userPosition.x += step; break;
				case 'w': userPosition.z -= step; break;
				case 's': userPosition.z += step; break;
			}

			const angle = Math.PI / 18;
			switch (event.key) {
				case 'q': userRotation.y += angle; break;
				case 'e': userRotation.y -= angle; break;
				case 'a': userRotation.x += angle; break;
				case 'd': userRotation.x -= angle; break;
			}

			// Güncel bilgiyi haritaya yaz
			objectDataMap.set(selectedObject, { userPosition: { ...userPosition }, userRotation: { ...userRotation } });
		}
	});





	// RAYCASTER

	// Set the size of the canvas for best visual experience
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Do not add as we're using an existing canvas and not creating a new one from the depths of Three.JS
//	document.body.appendChild(renderer.domElement);

	// For seeing FPS
	const stats = new Stats();
	document.body.appendChild( stats.dom );

	const centerObject = new Star(new THREE.Color(0xbb5500));	// We have to pass only color now, may change later
	centerObject.position.set(0, 0, 0);
	scene.add(centerObject);
	
	const orbitObject = new Planet(new THREE.Color(0x0077cc));	// Same as above
	
	
	let t = 0;
	orbitObject.position.set(2*Math.cos(t), 0, 2*Math.sin(t));
	scene.add(orbitObject);
	
	{ // Point light
		const plight = new THREE.PointLight( 0xffffff, 50 );
		plight.position.set(0, 5, 0);
		scene.add(plight);
	} { // Ambient light
		const alight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(alight);
	}

	// Possible Game Loop -> will reorganized according to Kepler's Laws
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
			const orbitData = objectDataMap.get(orbitObject) || { userPosition: { x: 0, y: 0, z: 0 }, userRotation: { x: 0, y: 0 } };
			x += orbitData.userPosition.x;
			y += orbitData.userPosition.y;
			z += orbitData.userPosition.z;

			orbitObject.position.set(x, y, z);

			// OrbitCube için kullanıcı rotasyonunu uygula
			const tRotation = timestamp / 1000 * 2;
			orbitObject.rotation.y = tRotation + orbitData.userRotation.y;
			orbitObject.rotation.x = -1.3 * tRotation + orbitData.userRotation.x;
			}

		{ // Rotate the center cube
			const centerData = objectDataMap.get(centerObject) || { userPosition: { x: 0, y: 0, z: 0 }, userRotation: { x: 0, y: 0 } };
			const t = timestamp / 1000;

			// Pozisyon ve rotasyonu uygula
			centerObject.position.set(centerData.userPosition.x, centerData.userPosition.y, centerData.userPosition.z);
			centerObject.rotation.y = t + centerData.userRotation.y;
			centerObject.rotation.x = centerData.userRotation.x;
		}
		//userPosition = { x: 0, y: 0, z: 0 };
		renderer.render(scene, camera);
	}

	const animate = (timestamp) => {
		animateStep(timestamp); // Call the actual animation frame
		stats.update(); // Needs to be updated in order to show the FPS count
		requestAnimationFrame(animate); // Request to be called again
	}

	requestAnimationFrame(animate); // Request to be called again

	// To see the difference between shaders (only for testing)
	document.addEventListener('keydown', function(event) {
		switch (event.key) {
			case "1":
				centerObject.material = centerObject.defaultMaterial;
				orbitObject.material = orbitObject.defaultMaterial;
				break;
			case "2":
				centerObject.material = centerObject.phongMaterial;
				orbitObject.material = orbitObject.phongMaterial;
				break;
			case "3":
				centerObject.material = centerObject.toonMaterial;
				orbitObject.material = orbitObject.toonMaterial;
				break;
		}
	})
}


main();