import * as THREE from "three";

import { toonVertex } from "./shaders/toon_shading";
import { toonFragment } from "./shaders/toon_shading";

import { outlineVertex } from "./shaders/toon_shading_outline";
import { outlineFragment } from "./shaders/toon_shading_outline";

export class ShaderToonMaterial extends THREE.ShaderMaterial {

    constructor() {
        super();

        this.vertexShader = toonVertex;
        this.fragmentShader = toonFragment;

        this.lights = true; // Pass the properties of three.js lights to our shaders

        this.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {
                'shininess': {value: 10.0},
                'texture1': {value: null},
                'isStar': {value: false},
                'isDisk': {value: false},
                'color': {value: new THREE.Color( 0x000000 )},
                'opacity': {value: 0.0}            
            }
        ]);
    }
}

// Black outline on the objects when in toon shading
export class ShaderToonOutline extends THREE.Mesh {
    constructor( mesh, strength = 0, thickness = 0.05) {
        super();

        this.geometry = mesh.geometry;
        this.material = new THREE.ShaderMaterial({
            vertexShader: outlineVertex,
            fragmentShader: outlineFragment,
            
            uniforms: {
                strength: {value: strength},
                thickness: {value: thickness}
            },

            side: THREE.BackSide
        });

    }

}