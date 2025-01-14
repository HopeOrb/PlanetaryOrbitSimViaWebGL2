import { ShaderToonMaterial } from "./ShaderToonMaterial";

export class DiskToonMaterial extends ShaderToonMaterial {
    constructor( ringTexture ) {
        super();

        this.uniforms.isDisk.value = true;
        this.uniforms.texture1.value = ringTexture;
    }
}
