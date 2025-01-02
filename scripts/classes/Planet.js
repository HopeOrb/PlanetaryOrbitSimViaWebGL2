import * as THREE from './../../node_modules/three/build/three.module.js';

import { ShaderPhongMaterial } from '../materials/shaderPhongMaterial.js';
import { ShaderToonMaterial } from '../materials/ShaderToonMaterial.js';

export class Planet extends THREE.Mesh {
    
    constructor(color, texture, nightTexture = texture) {
        super();

        this.defaultMaterial = new THREE.MeshPhongMaterial( {color: color} ); // This is only for testing while development, will be removed in final
        this.phongMaterial = new ShaderPhongMaterial( {color: {value: color}, shininess: {value: 100.0}, dayTexture: {value: texture}, nightTexture: {value: nightTexture} } );    
        this.toonMaterial = new ShaderToonMaterial( {color: {value: color}} );

        this.geometry = new THREE.SphereGeometry();

        this.material = this.defaultMaterial;
    }

}