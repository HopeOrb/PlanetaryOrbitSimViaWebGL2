import * as THREE from 'three';

import { ShaderToonOutline } from '../materials/ShaderToonMaterial.js';
import { GameObject } from "./GameObject.js";
import { PlanetPhongMaterial } from '../materials/PlanetPhongMaterial.js';
import { PlanetToonMaterial } from '../materials/PlanetToonMaterial.js';

export class Planet extends GameObject {

    trail;
    trailPoints;
    
    constructor(color, dayTexture, nightTexture = dayTexture) {
        super();

        this.dayTexture = dayTexture;
        this.nightTexture = nightTexture;

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

        this.trailPoints = [];
        this.trail = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( this.trailPoints ),
            new THREE.LineBasicMaterial( {color: 0x555555} )
        );

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
        //this.material = new ShaderPhongMaterial( {color: {value: this.color}, shininess: {value: 1.0}, dayTexture: {value: this.dayTexture}, nightTexture: {value: this.nightTexture}} );
        this.material = new PlanetPhongMaterial( this.dayTexture, this.nightTexture );
    }

    switchToToon() {
        this.reset();

        this.isToon = true;

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new PlanetToonMaterial( this.dayTexture );

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

        // I guess we won't need this
        //if (this.isToon) this.children.at(2).material.uniforms.thickness = this.outlineThickness;
    }

    reset() {
        this.clear();
        this.isPhong = false;
        this.isToon = false;
    }

    updateTrail( new_point ) {
        if ( !( this.trailPoints.includes( new_point ) ) ) {
            this.trailPoints.push( new_point );
        }

        this.trail.geometry.dispose();  // Free the GPU related resources
        this.trail.geometry = new THREE.BufferGeometry().setFromPoints( this.trailPoints ); 
    }

    resetTrail() {
        this.trailPoints = [];
        this.trail.geometry.dispose();
    }

}