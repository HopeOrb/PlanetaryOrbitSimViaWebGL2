import * as THREE from "./../../node_modules/three/build/three.module";

import { toonVertex } from "./shaders/toon_shading";
import { toonFragment } from "./shaders/toon_shading";

export class ShaderToonMaterial extends THREE.ShaderMaterial {

    constructor ( parameters ) {
        super();

        this.vertexShader = toonVertex;
        this.fragmentShader = toonFragment;

        this.lights = true; // Pass the properties of three.js lights to our shaders

        this.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            parameters
        ]);
    }
}