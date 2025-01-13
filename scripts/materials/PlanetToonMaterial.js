import { ShaderToonMaterial } from "./ShaderToonMaterial";

// TODO: Doesn't switch to this, fix
export class PlanetToonMaterial extends ShaderToonMaterial {
    constructor( dayTexture, nightTexture ) {
        super();
        
        this.uniforms.texture1.value = dayTexture;
        this.uniforms.texture2.value = nightTexture;
    }

}