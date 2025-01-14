import * as THREE from 'three';

import { ShaderToonOutline } from '../materials/ShaderToonMaterial.js';
import { GameObject } from "./GameObject.js";
import { StarPhongMaterial } from '../materials/StarPhongMaterial.js';
import { StarToonMaterial } from '../materials/StarToonMaterial.js';

// TODO: Will make the stars bigger
export class Star extends GameObject {

    color;
    
    constructor() {
        super();

        this.boundingBox = new THREE.Box3();

        this.light = new THREE.PointLight( 0xffffff, 50 );
        this.light.decay = 0.5; // TODO: Will adjust based on how close the planets get to the star in the Kepler formula

        let textureLoader = new THREE.TextureLoader();
        this.lavaTexture = textureLoader.load( '/resources/textures/lava/lavatile.jpg' );
        this.cloudTexture = textureLoader.load( '/resources/textures/lava/cloud.png' );
        this.lavaTexture.colorSpace = THREE.SRGBColorSpace;
        this.cloudTexture.wrapS = this.cloudTexture.wrapT = THREE.RepeatWrapping;
        this.lavaTexture.wrapS = this.lavaTexture.wrapT = THREE.RepeatWrapping;

        this.mass = 360000;
        this.velocity = new THREE.Vector3( 0, 0, 0 );

        this.switchToPhong();
    }

    switchToPhong() {
        this.reset()

        this.geometry = new THREE.SphereGeometry();
        this.material = new StarPhongMaterial( this.lavaTexture, this.cloudTexture );

    }

    switchToToon() {
        this.reset();

        this.geometry = new THREE.SphereGeometry();
        this.material = new StarToonMaterial( new THREE.Color( 0xfcd900 ), 1 );

        const sphere1 = new THREE.SphereGeometry( 1.25 );
        const material1 = new StarToonMaterial( new THREE.Color( 0xfc9100 ), 0.9 );
        material1.side = THREE.BackSide;
        const middleLayer = new THREE.Mesh( sphere1, material1 );

        this.attach( middleLayer );

        middleLayer.position.set( 0, 0, 0 );
        middleLayer.scale.set( 1, 1, 1 );

        const sphere2 = new THREE.SphereGeometry( 1.40 );
        const material2 = new StarToonMaterial( new THREE.Color( 0xfc2e00 ), 0.8 );
        const outerLayer = new THREE.Mesh( sphere2, material2 );

        this.attach( outerLayer );

        outerLayer.position.set( 0, 0, 0 );
        outerLayer.scale.set( 1, 1, 1 );
        outerLayer.layers.toggle( 1 );

        const outline = new ShaderToonOutline( this );
        this.attach( outline );

        outline.position.set( 0, 0, 0 );
        outline.scale.set( 1, 1, 1 );

    }


    reset() {
        this.clear();

        this.attach( this.light );
        this.light.position.set( 0, 0, 0 );

        this.geometry = null;
        this.material = null;

        this.boundingBox = new THREE.Box3();
    }

    updateBoundingBox() {

        this.boundingBox.setFromCenterAndSize(this.position ,new THREE.Vector3(this.sizeX, this.sizeY, this.sizeZ) );
        if (this.geometry) {
            this.geometry.computeBoundingBox();
            this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.matrixWorld);
        }
    }

}