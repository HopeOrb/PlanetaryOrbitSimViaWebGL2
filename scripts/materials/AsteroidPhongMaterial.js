import { ShaderPhongMaterial } from "./ShaderPhongMaterial";

export class AsteroidPhongMaterial extends ShaderPhongMaterial {
    constructor( texture ) {
        super();

        this.uniforms.isAsteroid.value = true;

        this.uniforms.texture1.value = texture;
        this.uniforms.texture2.value = texture;
    }
}