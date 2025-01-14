import { ShaderToonMaterial } from "./ShaderToonMaterial";

export class PlanetToonMaterial extends ShaderToonMaterial {
    constructor( dayTexture ) {
        super();
        
        this.uniforms.texture1.value = dayTexture;
    }

}