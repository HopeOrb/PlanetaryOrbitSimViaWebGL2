import { ShaderToonMaterial } from "./ShaderToonMaterial";

export class AsteroidToonMaterial extends ShaderToonMaterial {
    constructor( texture ) {
        super();

        this.uniforms.texture1.value = texture;
    }
}