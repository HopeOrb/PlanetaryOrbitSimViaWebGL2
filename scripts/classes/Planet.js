import * as THREE from './../../node_modules/three/build/three.module.js';

import { ShaderPhongMaterial } from '../materials/ShaderPhongMaterial.js';
import { ShaderToonMaterial } from '../materials/ShaderToonMaterial.js';

export class Planet extends THREE.Mesh {
    
    constructor(color, texture, texture2 = texture) {
        super();

        this.dayTexture = texture;
        this.nightTexture = texture2;

        this.color = color; // Probably won't need in delivery as it's only used in test shading

        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;

        this.switchToTest();    // Will start in Phong shading in delivery
    }

    // Shading only for test!!! Will be removed in delivery!!!
    switchToTest() {
        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshPhongMaterial( {color: this.color} );
    }

    switchToPhong() {
        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new ShaderPhongMaterial( {color: {value: this.color}, shininess: {value: 1.0}, dayTexture: {value: this.dayTexture}, nightTexture: {value: this.nightTexture}} );
    }

    switchToToon() {
        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new ShaderToonMaterial( {color: {value: this.color}, dayTexture: {value: this.dayTexture}, nightTexture: {value: this.nightTexture}} );
    }

    // For some reason it doesn't work when we call it scale
    scaling(x, y, z) {
        this.sizeX = x;
        this.sizeY = y;
        this.sizeZ = z;

        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
    }

}