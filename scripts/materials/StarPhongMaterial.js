import * as THREE from "./../../node_modules/three/build/three.module";

import { ShaderPhongMaterial } from "./ShaderPhongMaterial";

export class StarPhongMaterial extends ShaderPhongMaterial{
    constructor( lavaTexture, cloudTexture ) {
        super();

        this.uniforms.texture1.value = cloudTexture;
        this.uniforms.texture2.value = lavaTexture;

        this.uniforms.isStar.value = true;
        this.uniforms.uvScale.value = new THREE.Vector2( 2.0, 1.0 );
    }

}