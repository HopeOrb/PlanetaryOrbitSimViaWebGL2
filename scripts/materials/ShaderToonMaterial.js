import * as THREE from "./../../node_modules/three/build/three.module";

import { toonVertex } from "./shaders/toon_shading";
import { toonFragment } from "./shaders/toon_shading";

import { outlineVertex } from "./shaders/toon_shading_outline";
import { outlineFragment } from "./shaders/toon_shading_outline";

// TODO: MASSIVE!!!!!! FPS drop when in toon shading, learn why
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
                'texture2': {value: null}
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