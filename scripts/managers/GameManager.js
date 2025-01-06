//import './../style/style.css'; # Done from the html page. I remember that css shouldn't be imported from script anyway.
import * as THREE from './../../node_modules/three/build/three.module.js';
// importing orbital controls for the camera
import {GLTFLoader} from 'three/addons';
import {BloomPass, EffectComposer, OrbitControls, OutputPass, RenderPass, ShaderPass, TransformControls, UnrealBloomPass} from "three/addons";
import Stats from './../../node_modules/three/examples/jsm/libs/stats.module.js';

import { setupGUI } from './../gui.js';

import { Star } from './../classes/Star.js';
import { Planet } from './../classes/Planet.js';
import { selectiveFragment, selectiveVertex } from './../post_processing/selective_bloom.js';
import { ShaderToonOutline } from './../materials/ShaderToonMaterial.js';

export class GameManager {
    constructor() {

    }


}