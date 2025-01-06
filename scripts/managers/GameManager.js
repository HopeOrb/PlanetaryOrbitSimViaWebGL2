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

export class GameManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camManager = null;
        this.camera = null;
        this.renderer = null;
        this.orbitControls = null;
        this.stats = null;
        this.objects = {}; // Object registry
        this.helpMenu = null;
        this.rayCaster = null;
        this.mouse = null;

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

        // Init RayCaster
        this.initRayCaster();

        // Init mouse pos
        this.initMouse();

        // Add performance stats
        this.initStats();

        // Initialize the help menu
        this.initHelpMenu();

        // Add EventListeners
        this.addEventListeners();

        // Start game loop
        //this.update();
    }

    // Initialize the Game Loop
    update() {

    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    }

    initCameraManager() {
        if(this.renderer == null) this.initRenderer();
        this.camManager = new CameraManager(this.renderer);
        this.camManager.init();
    }




    initTransformControls() {

    }

    initRayCaster() {

    }

    initMouse() {

    }

    initStats() {

    }

    initHelpMenu() {

    }

    addEventListeners() {

    }
}