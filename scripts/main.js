//import './../style/style.css'; # Done from the html page. I remember that css shouşdn't be imported from script anyway.
import * as THREE from './../node_modules/three/build/three.module.js';
// importing orbital controls for the camera
import {GLTFLoader} from './../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {BloomPass, EffectComposer, OrbitControls, OutputPass, RenderPass, ShaderPass, TransformControls, UnrealBloomPass} from "three/addons";
import Stats from './../node_modules/three/examples/jsm/libs/stats.module.js';

import { setupGUI } from './gui.js';

import { Star } from './classes/Star.js';
import { Planet } from './classes/Planet.js';
import { selectiveFragment, selectiveVertex } from './post_processing/selective_bloom.js';

const main = () => {
	const theCanvas = document.getElementById("the_canvas"); // Use our already-existent canvas

	// Initialize Three.js
	const scene = new THREE.Scene();
	//scene.add( new THREE.GridHelper( 15, 10, 0x888888, 0x444444 ) );

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

	// POST PROCESSING

	const bloomComposer = new EffectComposer( renderer );
	bloomComposer.renderToScreen = false;	// The output of this pass isn't displayed, it's sent to the next pass

	const renderScene = new RenderPass( scene, camera );	// The contents of our scene before post processing
	bloomComposer.addPass(renderScene);

	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.75, 0.1, 0.0 );
	bloomComposer.addPass(bloomPass);

	const finalComposer = new EffectComposer( renderer );

	finalComposer.addPass( renderScene );

	// Adds objects with bloom to the rest of the scene
	const mixPass = new ShaderPass(
		new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: {value: null},
				bloomTexture: {value: null}
			},
			vertexShader: selectiveVertex,
			fragmentShader: selectiveFragment,
			defines: {}
		}), 'baseTexture'
	);
	mixPass.needsSwap = true;
	finalComposer.addPass( mixPass );

	const outputPass = new OutputPass();	// For color space conversion and tone mapping
	finalComposer.addPass( outputPass );

	// The layer which will contain the objects that we'll apply the bloom effect
	const BLOOM_SCENE = 1;
	const bloomLayer = new THREE.Layers();
	bloomLayer.set(BLOOM_SCENE);

	const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
	const materials = {};

	// POST PROCESSING END

	const transformControls = new TransformControls(camera, renderer.domElement);
	transformControls.addEventListener('change', () => {
		renderer.render(scene, camera); // Sahneyi yeniden çizin
	});
	let isDragging = false; // Sürükleme durumu
	let isClickBlocked = false; // Tıklama engellemeyi kontrol eden durum

	transformControls.addEventListener('dragging-changed', (event) => {
		isDragging = event.value; // Sürükleme başlatıldığında `isDragging` true olacak
		if (!isDragging) {
			// Sürükleme tamamlandığında tıklamayı tekrar engellemeyi kaldır
			isClickBlocked = true;
			setTimeout(() => {
				isClickBlocked = false; // Tıklama engellemeyi kaldır
			}, 100); // Sürükleme tamamlandıktan sonra bir süre tıklama engellenir
		}
	});

	transformControls.addEventListener( 'mouseDown', () => controls.enabled = false );
	transformControls.addEventListener( 'mouseUp', () => controls.enabled = true );

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


	window.addEventListener('mousemove', (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	});


	const objectDataMap = new Map(); // Her obje için konum ve dönüş verilerini tutar.
	let userRotation = { x: 0, y: 0 };
	let userPosition = { x: 0, y: 0, z: 0 };



	let previousSelectedObject = null; // Önceki seçilen objeyi tutan değişken


	window.addEventListener('click', () => {
		console.log(isClickBlocked.valueOf());
		if (isClickBlocked) {
			return;
		}
		if (isDragging) {
			isClickBlocked = true;
			return; // Sürükleme işlemi devam ediyorsa tıklama işlemi yapma
		}

		if (event.target.closest('.lil-gui')) {
			return; // GUI'ye tıklanırsa işlem yapma
		}

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			selectedObject = intersects[0].object; // Yeni objeyi seç

			if (!(selectedObject instanceof Star || selectedObject instanceof Planet)) {
				selectedObject = null; // Hiçbir şey seçilmediyse
				console.log("heree");

				transformControls.detach();
				scene.remove(transformControls.getHelper());
				//return;
			}
			else if (selectedObject !== previousSelectedObject) {
				transformControls.detach();
				scene.remove(transformControls.getHelper());
				console.log("Object changed. Previous:", previousSelectedObject, "New:", selectedObject);

				transformControls.attach(selectedObject);
				scene.add(transformControls.getHelper());

				// Mevcut obje için veri varsa yükle, yoksa varsayılan oluştur
				const data = objectDataMap.get(selectedObject) || { userPosition: { x: 0, y: 0, z: 0 }, userRotation: { x: 0, y: 0 } };
				userPosition = data.userPosition;
				userRotation = data.userRotation;

				setupGUI(selectedObject);
			}

			previousSelectedObject = selectedObject; // Şu anki objeyi önceki objeye aktar

			console.log("Selected Object:", selectedObject);

		} else {
			console.log("Selected : Null");
			selectedObject = null; // Hiçbir şey seçilmediyse

			transformControls.detach();
			scene.remove(transformControls.getHelper());

			//updateAxisHelper(null);
			setupGUI(selectedObject);
		}
	});

	window.addEventListener("keydown", (event) => {
		switch (event.key) {
			case 'q':
				transformControls.setMode('rotate');
				break;
			case 'w':
				transformControls.setMode('translate');
				break;
			case 'e':
				transformControls.setMode('scale');
				break;
			default:
				console.log(event.key + " is pressed!")
				break;

		}
	});

	// Reset Camera
	window.addEventListener("keydown", (event) =>{
		switch (event.key) {
			case ',':
				controls.reset();
				camera.position.set(4, 4, 8);
				// camera.lookAt(0, 0, 0); // unnecessary
				camera.updateProjectionMatrix();
				// controls.update(); // need to update whenever OrbitControls or camera get updates
				break;
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

	const textureLoader = new THREE.TextureLoader();

	const earthDayTexture = textureLoader.load("/resources/textures/2k_earth_daymap.jpg");
	const earthNightTexture = textureLoader.load("/resources/textures/2k_earth_nightmap.jpg");

	const ceresTexture = textureLoader.load("/resources/textures/2k_ceres_fictional.jpg");

	const makemakeTexture = textureLoader.load("/resources/textures/2k_makemake_fictional.jpg");

	const centerObject = new Star(new THREE.Color(0xbb5500));	// We have to pass only color now, may change later
	centerObject.position.set(0, 0, 0);
	centerObject.layers.toggle(BLOOM_SCENE);	// To add our star to the bloom layer
	scene.add(centerObject);
	
	const orbitObject = new Planet(new THREE.Color(0x0077cc), earthDayTexture, earthNightTexture);	// If there are separate day/night textures
//	const orbitObject = new Planet(new THREE.Color(0x0077cc), ceresTexture);	// If there is only one texture
	orbitObject.geometry.scale(0.3, 0.3, 0.3);
	
	
	let t = 0;
	orbitObject.position.set(2*Math.cos(t), 0, 2*Math.sin(t));
	scene.add(orbitObject);
	
	{ // Point light
		const plight = new THREE.PointLight( 0xffffff, 25 );
		plight.position.set(0, 0, 0);
		scene.add(plight);
	} { // Ambient light
		const alight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(alight);
	}

	// Star background

	const stars = new Array();
	for ( let i=0; i<3000; i++ ) {
	    let x = THREE.MathUtils.randFloatSpread( 1000 );
	    let y = THREE.MathUtils.randFloatSpread( 1000 );
	    let z = THREE.MathUtils.randFloatSpread( 1000 );
	    // Nearby stars are not created
	    if (x*x + y*y + z*z > 60000) {
	        stars.push(x, y, z);
	    }
	}

	const bloomStars = new Array();
	for ( let i=0; i<500; i++) {
		let x = THREE.MathUtils.randFloatSpread( 1000 );
	    let y = THREE.MathUtils.randFloatSpread( 1000 );
	    let z = THREE.MathUtils.randFloatSpread( 1000 );
		if (x*x + y*y + z*z > 60000) {
	        bloomStars.push(x, y, z);
	    }
	}


	const starSprite = new THREE.TextureLoader().load('/resources/textures/star.png');
	starSprite.colorSpace = THREE.SRGBColorSpace;

	const starsMaterial = new THREE.PointsMaterial( { color: 0xffddff, map: starSprite, transparent: true, size: 1, sizeAttenuation: true} );

	const starsGeometry = new THREE.BufferGeometry();
	starsGeometry.setAttribute(
	    "position", new THREE.Float32BufferAttribute(stars, 3)
	);

	const spaceBackground = new THREE.Points( starsGeometry, starsMaterial );
	scene.add(spaceBackground);

	const bloomStarsGeometry = new THREE.BufferGeometry();
	bloomStarsGeometry.setAttribute(
		"position", new THREE.Float32BufferAttribute(bloomStars, 3)
	);

	const spaceBackgroundBloom = new THREE.Points( bloomStarsGeometry, starsMaterial );
	spaceBackgroundBloom.layers.toggle(BLOOM_SCENE);
	scene.add(spaceBackgroundBloom);

	// We will darken the objects which are "non-bloomed" before the first pass
	function nonBloomed(obj) {
		if (bloomLayer.test(obj.layers) === false) {
			materials[obj.uuid] = obj.material;
			obj.material = darkMaterial;
		}
	}

	// We restore the materials after the bloom pass
	function restoreMaterial(obj) {
		if (materials[obj.uuid]) {
			obj.material = materials[obj.uuid];
			delete materials[obj.uuid];
		}
	}

	// Possible Game Loop -> will reorganized according to Kepler's Laws
	const animateStep = (timestamp) => {

		{ // Move the orbit cube
			const t = timestamp / 1000;
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
			const t = timestamp / (1000 * 3);

			// Pozisyon ve rotasyonu uygula
			centerObject.position.set(centerData.userPosition.x, centerData.userPosition.y, centerData.userPosition.z);
			centerObject.rotation.y = t + centerData.userRotation.y;
			centerObject.rotation.x = centerData.userRotation.x;
		}
		// Reset camera
		camera.updateProjectionMatrix();
		controls.update();

		//userPosition = { x: 0, y: 0, z: 0 };
		centerObject.material.uniforms.time.value += 0.003;	// To move the lava texture on sun

		scene.traverse(nonBloomed);	// Darken the objects which are not bloomed

		bloomComposer.render();

		mixPass.material.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;	// Pass the output of first pass to the final pass

		scene.traverse(restoreMaterial);	// Restore the darkened objects

		finalComposer.render();
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
				orbitObject.material = orbitObject.defaultMaterial;
				break;
			case "2":
				orbitObject.material = orbitObject.phongMaterial;
				break;
			case "3":
				orbitObject.material = orbitObject.toonMaterial;
				break;
		}
	})

	// Update camera and renderer on window resize
	window.onresize = function () {

		const width = window.innerWidth;
		const height = window.innerHeight;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );

		bloomComposer.setSize( width, height );
		finalComposer.setSize( width, height );
	};
}


main();