import * as THREE from './../../node_modules/three/build/three.module.js';

import { ShaderPhongMaterial } from '../materials/ShaderPhongMaterial.js';
import { ShaderToonMaterial } from '../materials/ShaderToonMaterial.js';

import { ShaderToonOutline } from '../materials/ShaderToonMaterial.js';
import {GameObject} from "./GameObject.js";

export class Planet extends GameObject {
    
    constructor(color, texture, texture2 = texture) {
        super();

        this.dayTexture = texture;
        this.nightTexture = texture2;

        this.color = color; // Probably won't need in delivery as it's only used in test shading

        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;

        this.outlineThickness = 0.05;

        this.isPhong = false;
        this.isToon = false;

        this.scaling( 0.3, 0.3, 0.3 );

        this.mass = 1000;   // TODO: We'll be able to change this in application
        this.velocity = new THREE.Vector3( 0, 2, -5 );  // TODO: We'll be able to change this in application

        this.switchToTest();    // Will start in Phong shading in delivery
    }

    // Shading only for test!!! Will be removed in delivery!!!
    switchToTest() {
        this.reset();

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshPhongMaterial( {color: this.color} );
    }

    switchToPhong() {
        this.reset();

        this.isPhong = true;

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new ShaderPhongMaterial( {color: {value: this.color}, shininess: {value: 1.0}, dayTexture: {value: this.dayTexture}, nightTexture: {value: this.nightTexture}} );
    }

    switchToToon() {
        this.reset();

        this.isToon = true;

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new ShaderToonMaterial( {color: {value: this.color}, dayTexture: {value: this.dayTexture}, nightTexture: {value: this.nightTexture}} );

        const outline = new ShaderToonOutline( this, 0, this.outlineThickness );
        this.attach( outline );
        outline.position.set( 0, 0, 0 );
        outline.scale.set( 1, 1, 1 );
    }

    // For some reason it doesn't work when we call it scale
    scaling(x, y, z) {
        this.outlineThickness *= x / this.sizeX;

        this.sizeX = x;
        this.sizeY = y;
        this.sizeZ = z;

        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);

        if (this.isToon) this.children.at(2).material.uniforms.thickness = this.outline;
    }

    reset() {
        this.clear();
        this.isPhong = false;
        this.isToon = false;
    }

}