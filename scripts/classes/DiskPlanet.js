import * as THREE from "three";

import { Planet } from "./Planet";
import { DiskPhongMaterial } from "../materials/DiskPhongMaterial";

export class DiskPlanet extends Planet {
    
    radius = 0.5;
    tube = 0.15;
    radialSegments = 2;
    tubularSegments = 50;
    
    disk;
    
    constructor( color, dayTexture, nightTexture = dayTexture ) {
        super( color, dayTexture, nightTexture = dayTexture );

        this.radius = this.sizeX * 2.25;
        this.tube = this.radius * 0.5;

        const textureLoader = new THREE.TextureLoader();
        const ringTexture = textureLoader.load( '/resources/textures/disk/rings.jpg' );
        ringTexture.wrapT = THREE.RepeatWrapping;
        ringTexture.rotation = 90;
        
        this.disk = new THREE.Mesh( new THREE.TorusGeometry( this.radius, this.tube, this.radialSegments, this.tubularSegments ), new DiskPhongMaterial( ringTexture ) );
        
        this.disk.rotateX( Math.PI / 2 );
        this.attach( this.disk );
    }

    reset() {
        this.clear();
        this.isPhong = false;
        this.isToon = false;

        if (this.disk) {
            this.attach( this.disk );
            this.disk.position.set( 0, 0, 0 );
            this.disk.rotation.set( Math.PI / 2, 0, 0 );
        }
    }
}