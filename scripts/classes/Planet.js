import * as THREE from 'three';

import { ShaderToonOutline } from '../materials/ShaderToonMaterial.js';
import { GameObject } from "./GameObject.js";
import { PlanetPhongMaterial } from '../materials/PlanetPhongMaterial.js';
import { PlanetToonMaterial } from '../materials/PlanetToonMaterial.js';
import {Vector3} from "three";

export class Planet extends GameObject {

    trail;
    trailPoints;
    
    constructor(color, dayTexture, nightTexture = dayTexture) {
        super();
        this.planetProps = Planet.randomizeProperties();

        this.boundingBox = new THREE.Box3();

        this.dayTexture = dayTexture;
        this.nightTexture = nightTexture;

        this.color = color; // Probably won't need in delivery as it's only used in test shading

        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;

        this.outlineThickness = 0.05;

        this.isPhong = false;
        this.isToon = false;

        this.scaling( this.planetProps.scale, this.planetProps.scale, this.planetProps.scale );

        this.mass = this.planetProps.mass;
        this.velocity = this.planetProps.velocity;

        this.trailPoints = [];
        this.trail = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints( this.trailPoints ),
            new THREE.LineBasicMaterial( {color: 0x555555} )
        );

        this.switchToPhong();
    }

    switchToPhong() {
        this.reset();

        this.isPhong = true;

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new PlanetPhongMaterial( this.dayTexture, this.nightTexture );

        //this.updateBoundingBox();

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

        //this.updateBoundingBox();

    }

    // For some reason it doesn't work when we call it scale
    scaling(x, y, z) {
        this.outlineThickness *= x / this.sizeX;

        this.sizeX = x;
        this.sizeY = y;
        this.sizeZ = z;

        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.updateBoundingBox();


        // I guess we won't need this
        //if (this.isToon) this.children.at(2).material.uniforms.thickness = this.outlineThickness;
    }

    reset() {
        this.clear();
        this.isPhong = false;
        this.isToon = false;
        this.boundingBox = new THREE.Box3();
    }

    updateBoundingBox() {
        // console.log("updateBoundingBox start *Planet*");
        // console.log("geometry: ",this.geometry);
        // console.log("boundingBox: ",this.boundingBox);

        this.boundingBox.setFromCenterAndSize(this.position ,new Vector3(this.sizeX, this.sizeY, this.sizeZ) );
        if (this.geometry) {
            this.geometry.computeBoundingBox();
            this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld);
        }
    }

    updateTrail( new_point ) {
        if ( !( this.trailPoints.includes( new_point ) ) ) {
            this.trailPoints.push( new_point );
        }

        this.trail.geometry.dispose();  // Free the GPU related resources
        this.trail.geometry = new THREE.BufferGeometry().setFromPoints( this.trailPoints ); 
    }
    static randomizeProperties() {
        const getRandomSign = () => (Math.random() < 0.5 ? -1 : 1);
        const properties = {
            scale: Math.random() * (0.6 - 0.2) + 0.2,
            mass: Math.random() * (10000 - 500) + 500,
            velocity: new THREE.Vector3(
                (Math.random() * (5 - 1) + 1) * getRandomSign(),
                (Math.random() * (5 - 1) + 1) * getRandomSign(),
                (Math.random() * (5 - 1) + 1) * getRandomSign()
            ),
        };
        return properties;
    }

    resetTrail() {
        this.trailPoints = [];
        this.trail.geometry.dispose();
    }

}