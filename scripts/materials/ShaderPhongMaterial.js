import * as THREE from "./../../node_modules/three/build/three.module";

import { phongVertex } from "./shaders/phong_shading";
import { phongFragment } from "./shaders/phong_shading";

export class ShaderPhongMaterial extends THREE.ShaderMaterial {

    constructor ( parameters ) {
        super();

        this.vertexShader = phongVertex;
        this.fragmentShader = phongFragment;

        this.lights = true; // Pass the properties of three.js lights to our shaders

        this.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            parameters
        ]);

        this.uniforms.shininess.value = 50.0;   // Low values: 10-50, high values: 100-200
        this.needsUpdate = true;
    }
}