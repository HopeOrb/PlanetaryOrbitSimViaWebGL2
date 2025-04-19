import * as THREE from 'three';
import { AsteroidPhongMaterial } from '../materials/AsteroidPhongMaterial';
import { AsteroidToonMaterial } from '../materials/AsteroidToonMaterial';
import { ShaderToonOutline } from '../materials/ShaderToonMaterial';

export class Asteroid extends THREE.Object3D {

    constructor() {
        super();

        this.velocity = new THREE.Vector3( Math.random() / 30000, Math.random() / 30000, Math.random() / 30000 );
        this.mass = Math.random() * 50;

        this.outline;

        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load( 'resources/models/asteroid/textures/Meteorite_Shader_Proxy_baseColor.png' );
    }

    switchToPhong() {
        this.remove( this.outline );
    }
    
    switchToToon() {
        this.outline = new ShaderToonOutline(this.children[0].children[0].children[0].children[0].children[0].children[0]);
        this.attach( this.outline );

        this.outline.position.set( 0, 0, 0 );
        this.outline.scale.set( 1, 1, 1 );
    }
}