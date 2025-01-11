//import './../style/style.css'; # Done from the html page. I remember that css shouldn't be imported from script anyway.
import * as THREE from './../../node_modules/three/build/three.module.js';
// importing orbital controls for the camera
import {GLTFLoader} from 'three/addons';
import {
    BloomPass,
    EffectComposer,
    OrbitControls,
    OutputPass,
    RenderPass,
    ShaderPass,
    TransformControls,
    UnrealBloomPass
} from "three/addons";
import Stats from './../../node_modules/three/examples/jsm/libs/stats.module.js';

import {setupGUI} from './../gui.js';

import {Star} from './../classes/Star.js';
import {Planet} from './../classes/Planet.js';
import {selectiveFragment, selectiveVertex} from './../post_processing/selective_bloom.js';
import {ShaderToonOutline} from './../materials/ShaderToonMaterial.js';
import {CameraManager} from "./CameraManager.js";
import { ShaderManager } from './ShaderManager.js';
import { PhysicsManager } from './PhysicsManager.js';
import {DebugManager} from "./DebugManager.js";

export class GameManager {
    // fields
    canvas;
    scene;
    camManager;
    debugManager;
    renderer;
    transformControls;
    stats;
    objects;
    helpMenu;
    raycaster;
    mouse;

    previousSelectedObject;
    selectedObject;

    centerObject
    orbitObject;

    isDragging;
    isClickBlocked;

    objectDataMap;
    userRotation;
    userPosition;

    // shading and postprocessing
    inPhongShading;
    inToonShading;
    bloomComposer;
    finalComposer;
    renderScene;
    bloomPass;
    mixPass;
    outputPass;
    BLOOM_SCENE;
    bloomLayer;
    darkMaterial;
    materials;

    // texture loader
    textureLoader;
    earthDayTexture;
    earthNightTexture;
    ceresTexture;
    makemakeTexture;
    starSprite;

    // light
    alight;

    // Background
    background_stars;
    background_bloom;
    starsMaterial;
    starsGeometry;
    spaceBackground;
    bloomStarsGeometry;
    spaceBackgroundBloom;

    inEditMode;
    inSimulationMode;
    inPlacementMode;

    grid;

    wireframePlanet;

    shaderManager;
    physicsManager;

    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camManager = null;
        this.debugManager = null;
        this.renderer = null;
        this.transformControls = null;
        this.stats = null;
        this.objects = {}; // Object registry
        this.helpMenu = null;
        this.raycaster = null;
        this.mouse = null;
        this.selectedObject = null;
        this.previousSelectedObject = null;
        this.isDragging = false; // Sürükleme durumu
        this.isClickBlocked = false; // Tıklama engellemeyi kontrol eden durum

        this.objectDataMap = new Map(); // Her obje için konum ve dönüş verilerini tutar.
        this.userRotation = {x: 0, y: 0};
        this.userPosition = {x: 0, y: 0, z: 0};

        //this.inPhongShading = true;   // Comment this out for now because our scene starts in three's own shading system, will uncomment later
    }

    // Will initialize the Scene / Game
    init() {
        // Initialize the scene manager
        this.scene = new THREE.Scene();
        this.initRenderer();

        // Initialize CameraManager for Camera and OrbitControl
        this.initCameraManager();

        // Initialize TransformControls
        this.initTransformControls();

        // Init mouse pos
        this.initMouse();

        // Init RayCaster
        this.initRayCaster();

        // Init TextureLoader
        this.initTextureLoader();

        // Init PostProcessing
        this.initPostProcessing();

        // Add performance stats
        this.initStats();

        // Initialize the help menu
        this.initHelpMenu();

        // Init Scene
        this.initScene();

        // Initialize DebugManager
        this.initDebugManager();

        // Add EventListeners
        this.addEventListeners();

        this.initGrid();

        this.initMode();

        this.initWireframePlanet();

        this.initShaderManager();

        this.initPhysicsManager();
    }

    // Initialize the Game Loop
    update() {

        const updateLoop = (timestamp) => {
            this.gameLoop(timestamp); // Call the actual animation frame
            this.stats.update(); // Needs to be updated in order to show the FPS count
            requestAnimationFrame(updateLoop); // Request to be called again
        }
        requestAnimationFrame(updateLoop);
        window.onresize = this.resize;
    }

    animate(timestamp) {
        if (this.inSimulationMode) {
            this.physicsManager.updateObjects();
        }

        // Reset camera
        this.camManager.camera.updateProjectionMatrix();
        this.camManager.orbitControls.update();

        //userPosition = { x: 0, y: 0, z: 0 };
        if (this.inPhongShading) this.centerObject.material.uniforms.time.value += 0.005;	// Toon shading doesn't have a time uniform
        if (this.inToonShading) this.centerObject.material.opacity = 0.5 + (Math.sin(timestamp / 500) / 7);	// So the bloom effect in toon shading oscillates

        this.scene.remove(this.transformControls.getHelper());	// Remove before the bloom pass so it doesn't get included
        //this.scene.traverse(this.nonBloomed);	// Darken the objects which are not bloomed
        this.scene.traverse((child) => {
            // Arrow function ensures `this` refers to the class instance
            this.nonBloomed(child);
        });
        this.renderer.setClearColor(0x000000);	// Set the background to black before bloom

        this.bloomComposer.render();

        this.mixPass.material.uniforms.bloomTexture.value = this.bloomComposer.readBuffer.texture;	// Pass the output of first pass to the final pass

        //this.scene.traverse(this.restoreMaterial);	// Restore the darkened objects
        this.scene.traverse((child) => {
            // Arrow function ensures `this` refers to the class instance
            this.restoreMaterial(child);
            // to update world-matrix
            child.updateWorldMatrix();
        });
        this.scene.add(this.transformControls.getHelper());	// Restore transformControls
        this.renderer.setClearColor(this.backgroundColor);	// Restore background

        // to update world-matrix for camera
        this.camManager.updateCameraView();
        this.finalComposer.render();

    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        // Set the size of the canvas for best visual experience
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    initCameraManager() {
        if (this.renderer == null) this.initRenderer();
        this.camManager = new CameraManager(this.renderer);
        this.camManager.init();
    }


    initTransformControls() {
        this.transformControls = new TransformControls(this.camManager.camera, this.renderer.domElement);
    }

    initRayCaster() {
        // TRYING RAYCASTER
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 0.1;
        this.raycaster.far = 1000;
        this.raycaster.layers.set(2);   // Raycasting layer

    }

    initMouse() {
        this.mouse = new THREE.Vector2();
    }

    initStats() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    initHelpMenu() {
        this.helpMenu = document.getElementById("helpMenu");
    }

    addEventListeners() {
        // HelpMenu Event Listener
        this.addHelpMenuEventListeners();

        // OrbitControls Event Listener
        this.camManager.addEventListeners();

        // DebugManager Event Listener
        this.debugManager.addDebugEventListeners();

        // TransformControls Event Listener
        this.addTransformControlEventListeners();

        // Raycasting Event Listener
        this.addRayCastingEventListeners();

        //this.addTestShadersEventListeners();

        this.addSwitchModeEventListeners();

        this.addPlacementEventListeners();

    }

    addTransformControlEventListeners() {
        this.transformControls.addEventListener('dragging-changed', (event) => {
            console.log("in dragging-changed");
            this.isDragging = event.value; // Sürükleme başlatıldığında isDragging true olacak
            if (!this.isDragging) {
                // Sürükleme tamamlandığında tıklamayı tekrar engellemeyi kaldır
                this.isClickBlocked = true;
                setTimeout(() => {
                    this.isClickBlocked = false; // Tıklama engellemeyi kaldır
                }, 1000); // Sürükleme tamamlandıktan sonra bir süre tıklama engellenir
            }
        });

        this.transformControls.addEventListener('mouseDown', () => this.camManager.disableOrbitControls());
        this.transformControls.addEventListener('mouseUp', () => this.camManager.enableOrbitControls());
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case 'q':
                    this.transformControls.setMode('rotate');
                    break;
                case 'w':
                    this.transformControls.setMode('translate');
                    break;
                case 'e':
                    this.transformControls.setMode('scale');
                    break;
                default:
                    console.log(event.key + " is pressed!")
                    break;

            }
        });
    }

    addHelpMenuEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'h') {
                // Toggle help menu visibility
                if (this.helpMenu.style.display === 'none') {
                    this.helpMenu.style.display = 'block';
                } else {
                    this.helpMenu.style.display = 'none';
                }
            }
        });
    }

    addRayCastingEventListeners() {
        window.addEventListener('pointermove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('click', () => {
            console.log(this.isClickBlocked.valueOf());
            // ensure camera view - world view matrices are synch before raycasting
            this.camManager.updateCameraView();


            if (this.isDragging) {
                this.isClickBlocked = true;
                return; // Sürükleme işlemi devam ediyorsa tıklama işlemi yapma
            }
            if (this.isClickBlocked) {
                return;
            }


            if (event.target.closest('.lil-gui')) {
                return; // GUI'ye tıklanırsa işlem yapma
            }

            this.raycaster.setFromCamera(this.mouse, this.camManager.camera);
            
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);
            if (intersects.length > 0) {
                this.selectedObject = intersects[0].object; // Yeni objeyi seç


                if (!(this.selectedObject instanceof Star || this.selectedObject instanceof Planet)) {
                    this.selectedObject = null; // Hiçbir şey seçilmediyse
                    console.log("heree");

                    this.transformControls.detach();
                    this.scene.remove(this.transformControls.getHelper());
                    //return;
                } else if (this.selectedObject !== this.previousSelectedObject) {
                    this.transformControls.detach();
                    this.scene.remove(this.transformControls.getHelper());
                    console.log("Object changed. Previous:", this.previousSelectedObject, "New:", this.selectedObject);

                    this.transformControls.attach(this.selectedObject);
                    this.scene.add(this.transformControls.getHelper());

                    // Mevcut obje için veri varsa yükle, yoksa varsayılan oluştur
                    const data = this.objectDataMap.get(this.selectedObject) || {
                        userPosition: {x: 0, y: 0, z: 0},
                        userRotation: {x: 0, y: 0}
                    };
                    this.userPosition = data.userPosition;
                    this.userRotation = data.userRotation;

                    setupGUI(this.selectedObject);
                }

                this.previousSelectedObject = this.selectedObject; // Şu anki objeyi önceki objeye aktar

                // Debug
                if(this.debugManager.isDebugMode) this.debugManager.debugRaycaster();

                console.log("Selected Object:", this.selectedObject);

            } else {
                console.log("Selected : Null");
                this.selectedObject = null; // Hiçbir şey seçilmediyse

                this.transformControls.detach();
                this.scene.remove(this.transformControls.getHelper());

                //updateAxisHelper(null);
                setupGUI(this.selectedObject);
            }
        });

        window.addEventListener( 'mousemove', () => {
            this.raycaster.setFromCamera(this.mouse, this.camManager.camera);

            let intersectingPosition = new THREE.Vector3();
            const intersects = this.raycaster.ray.intersectPlane( new THREE.Plane( new THREE.Vector3( 0, 1, 0 ) ), intersectingPosition );

            if ( intersects && this.inPlacementMode ) {
                this.wireframePlanet.position.copy( intersectingPosition );
            }
        } )
    }

    initPostProcessing() {
        // POST PROCESSING
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;	// The output of this pass isn't displayed, it's sent to the next pass

        this.renderScene = new RenderPass(this.scene, this.camManager.camera);	// The contents of our scene before post processing
        this.bloomComposer.addPass(this.renderScene);

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.1, 0.0);
        this.bloomComposer.addPass(this.bloomPass);

        this.finalComposer = new EffectComposer(this.renderer);

        this.finalComposer.addPass(this.renderScene);

        // Adds objects with bloom to the rest of the scene
        this.mixPass = new ShaderPass(
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
        this.mixPass.needsSwap = true;
        this.finalComposer.addPass(this.mixPass);

        this.outputPass = new OutputPass();	// For color space conversion and tone mapping
        this.finalComposer.addPass(this.outputPass);

        // The layer which will contain the objects that we'll apply the bloom effect
        this.BLOOM_SCENE = 1;
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.BLOOM_SCENE);

        this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        this.materials = {};

        // POST PROCESSING END

        this.resize();
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camManager.resize(width, height);

        this.bloomComposer.setSize(width, height);
        this.finalComposer.setSize(width, height);
    }

    addTestShadersEventListeners() {
        const self = this; // Need to differ instance referencing between this => document and this => class object
        // To see the difference between shaders (only for testing)
        document.addEventListener('keydown', function (event) {
            switch (event.key) {
                case "1":
                    self.inPhongShading = false;
                    self.inToonShading = false;

                    self.backgroundColor = 0x000000;

                    self.centerObject.switchToPhong();
                    self.orbitObject.switchToTest();
                    break;
                case "2":
                    if (self.inPhongShading) break; // Without this the game slows down when we hold the key
                    self.inPhongShading = true;
                    self.inToonShading = false;

                    self.backgroundColor = 0x000000;

                    self.centerObject.switchToPhong();
                    self.orbitObject.switchToPhong();
                    break;
                case "3":
                    if (self.inToonShading) break;  // Without this the game slows down when we hold the key
                    self.inPhongShading = false;
                    self.inToonShading = true;

                    //backgroundColor = 0x06000e;
                    self.backgroundColor = 0x010005;

                    self.centerObject.switchToToon();
                    self.orbitObject.switchToToon();
                    break;
            }
        });
    }

    initTextureLoader() {
        this.textureLoader = new THREE.TextureLoader();
        this.earthDayTexture = this.textureLoader.load("/resources/textures/2k_earth_daymap.jpg");
        this.earthNightTexture = this.textureLoader.load("/resources/textures/2k_earth_nightmap.jpg");
        this.ceresTexture = this.textureLoader.load("/resources/textures/2k_ceres_fictional.jpg");
        this.makemakeTexture = this.textureLoader.load("/resources/textures/2k_makemake_fictional.jpg");
        // Background stars
        this.starSprite = new THREE.TextureLoader().load('/resources/textures/star.png');
        //this.starSprite.colorSpace = THREE.SRGBColorSpace;    // I don't think we have to define its color space, because it's completely white
    }

    initScene() {
        // Init star
        this.centerObject = new Star();
        this.centerObject.position.set(0, 0, 0);
        this.centerObject.layers.toggle(this.BLOOM_SCENE);	// To add our star to the bloom layer
        this.scene.add(this.centerObject);
        // Init planets
        this.orbitObject = new Planet(new THREE.Color(0x0077cc), this.earthDayTexture, this.earthNightTexture);	// If there are separate day/night textures
        let t = 0;
        //this.orbitObject.position.set(2 * Math.cos(t), 0, 2 * Math.sin(t));
        this.orbitObject.position.set( 10, 0, 10 );
        this.scene.add(this.orbitObject);

        // Add Light
        this.addAmbientLight();

        // Add Background Objects
        this.addBackgroundObjects();

    }

    addStarToScene() {
        /** TODO
         * Generate new star with given positions and textures
         * Add the Star to the scene
         */
    }

    addPlanetToScene( position ) {
        // TODO: Give random textures each time
        
        const planet = new Planet( 0xffffff, this.makemakeTexture );
        planet.position.copy( position );

        if (this.shaderManager.inPhongShading) planet.switchToPhong();
        if (this.shaderManager.inToonShading) planet.switchToToon();

        this.scene.add( planet );
    }

    addAmbientLight() {
        this.alight = new THREE.AmbientLight(0xffffff, 0.25);
        this.scene.add(this.alight);
    }


    addBackgroundObjects() {
        // Star background
        this.background_stars = [];
        for (let i = 0; i < 3000; i++) {
            let x = THREE.MathUtils.randFloatSpread(1000);
            let y = THREE.MathUtils.randFloatSpread(1000);
            let z = THREE.MathUtils.randFloatSpread(1000);
            // Nearby stars are not created
            if (x * x + y * y + z * z > 60000) {
                this.background_stars.push(x, y, z);
            }
        }

        this.background_bloom = [];
        for (let i = 0; i < 500; i++) {
            let x = THREE.MathUtils.randFloatSpread(1000);
            let y = THREE.MathUtils.randFloatSpread(1000);
            let z = THREE.MathUtils.randFloatSpread(1000);
            if (x * x + y * y + z * z > 60000) {
                this.background_bloom.push(x, y, z);
            }
        }

        this.starsMaterial = new THREE.PointsMaterial({
            color: 0xffddff,
            map: this.starSprite,
            transparent: true,
            size: 1,
            sizeAttenuation: true
        });

        this.starsGeometry = new THREE.BufferGeometry();
        this.starsGeometry.setAttribute(
            "position", new THREE.Float32BufferAttribute(this.background_stars, 3)
        );

        this.spaceBackground = new THREE.Points(this.starsGeometry, this.starsMaterial);
        this.scene.add(this.spaceBackground);

        this.bloomStarsGeometry = new THREE.BufferGeometry();
        this.bloomStarsGeometry.setAttribute(
            "position", new THREE.Float32BufferAttribute(this.background_bloom, 3)
        );

        this.spaceBackgroundBloom = new THREE.Points(this.bloomStarsGeometry, this.starsMaterial);
        this.spaceBackgroundBloom.layers.toggle(this.BLOOM_SCENE);
        this.scene.add(this.spaceBackgroundBloom);


    }

    // We will darken the objects which are "non-bloomed" before the first pass
    nonBloomed(obj) {
        if (this.bloomLayer.test(obj.layers) === false) {
            this.materials[obj.uuid] = obj.material;
            obj.material = this.darkMaterial;
        }
    }

    // We restore the materials after the bloom pass
    restoreMaterial(obj) {
        if (this.materials[obj.uuid]) {
            obj.material = this.materials[obj.uuid];
            delete this.materials[obj.uuid];
        }
    }

    // TODO: Move everything below to their corresponding places before merging with test

    // Switch to edit mode
    editMode() {
        this.inEditMode = true;
        this.inSimulationMode = false;

        this.scene.add( this.grid );
    }

    // Switch to simulation mode
    simulationMode() {
        this.inEditMode = false;
        this.inSimulationMode = true;

        // Remove transformControls from the scene if it exists
        this.transformControls.detach();
        this.scene.remove(this.transformControls.getHelper());

        this.scene.remove( this.grid );
    }

    addSwitchModeEventListeners() {
        document.addEventListener( 'keydown', (event) => {
            switch (event.key) {
                case ' ':
                    if (this.inEditMode) {
                        this.simulationMode();
                    }
                    else {
                        this.editMode();
                    }
                    break;
                case 'p':
                    if (this.inEditMode) {
                        if (this.inPlacementMode) {
                            this.inPlacementMode = false;
                            this.scene.remove( this.wireframePlanet );
                        }
                        else {
                            this.inPlacementMode = true;
                            this.scene.add( this.wireframePlanet );
                        }
                    }
                    
            }
        } );
    }

    initGrid() {
        this.grid = new THREE.GridHelper( 100, 50, 0x888888, 0x444444 );
    }

    // Our scene will start in edit mode
    initMode() {
        this.editMode();
    }

    initWireframePlanet() {
        let wireframe = new THREE.WireframeGeometry( new THREE.SphereGeometry( 0.3, 10, 6 ) );

        this.wireframePlanet = new THREE.LineSegments( wireframe );
    }

    addPlacementEventListeners() {
        document.addEventListener( 'click', () => {
            if (this.inPlacementMode) {
                this.inPlacementMode = false;
                this.addPlanetToScene( this.wireframePlanet.position );
                this.scene.remove( this.wireframePlanet );
            }
        } )
    }

    initShaderManager() {
        this.shaderManager = new ShaderManager( this.scene );
    }

    initPhysicsManager() {
        this.physicsManager = new PhysicsManager( this.scene );
    }
    
    initDebugManager() {
        this.debugManager = new DebugManager(this.renderer, this.scene);
        this.debugManager.initRaycaster(this.raycaster);
    }
}