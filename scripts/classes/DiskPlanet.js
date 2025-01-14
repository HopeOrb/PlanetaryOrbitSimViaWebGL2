import * as THREE from "three";

import { Planet } from "./Planet";
import { DiskPhongMaterial } from "../materials/DiskPhongMaterial";
import { DiskToonMaterial } from "../materials/DiskToonMaterial";
import { PlanetPhongMaterial } from "../materials/PlanetPhongMaterial";
import { PlanetToonMaterial } from "../materials/PlanetToonMaterial";
import { ShaderToonOutline } from "../materials/ShaderToonMaterial";

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
        this.ringTexture = textureLoader.load( '/resources/textures/disk/rings.jpg' );
        this.ringTexture.wrapT = THREE.RepeatWrapping;
        this.ringTexture.rotation = 90;
        
        this.disk = new THREE.Mesh( new THREE.TorusGeometry( this.radius, this.tube, this.radialSegments, this.tubularSegments ), new DiskPhongMaterial( this.ringTexture ) );
        
        this.disk.rotateX( Math.PI / 2 );
        this.attach( this.disk );

        this.switchToPhong();
    }

    switchToPhong() {
        this.reset();

        this.isPhong = true;

        this.geometry = new THREE.SphereGeometry();
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new PlanetPhongMaterial( this.dayTexture, this.nightTexture );

        this.disk.material = new DiskPhongMaterial( this.ringTexture );
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

        this.disk.material = new DiskToonMaterial( this.ringTexture )
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