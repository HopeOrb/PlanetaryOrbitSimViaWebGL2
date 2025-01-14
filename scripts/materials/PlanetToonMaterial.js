import { ShaderToonMaterial } from "./ShaderToonMaterial";

// TODO: Doesn't switch to this, fix
export class PlanetToonMaterial extends ShaderToonMaterial {
    constructor( dayTexture ) {
        super();
        
        this.uniforms.texture1.value = dayTexture;
    }

}