import { ShaderPhongMaterial } from "./ShaderPhongMaterial";

export class DiskPhongMaterial extends ShaderPhongMaterial {
    constructor( ringTexture ) {
        super();

        this.uniforms.texture1.value = ringTexture;
        this.uniforms.isDisk.value = true;
    }
}