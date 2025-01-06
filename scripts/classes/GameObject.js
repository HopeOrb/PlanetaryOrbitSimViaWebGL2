import * as THREE from './../../node_modules/three/build/three.module.js';

import { StarMaterial } from '../materials/StarMaterial.js';

import { ShaderToonOutline } from '../materials/ShaderToonMaterial.js';

export class GameObject extends THREE.Mesh {

    constructor(color) {
        super();
        this.light = new THREE.PointLight( 0xffffff, 25 );
        this.switchToPhong();
    }

    switchToPhong() {
    }

    switchToToon() {
    }

    reset() {
    }
}