import { ShaderToonMaterial } from "./ShaderToonMaterial";

export class StarToonMaterial extends ShaderToonMaterial {
    constructor( color, opacity ) {
        super();

        this.uniforms.isStar.value = true;

        this.uniforms.color.value = color;
        this.uniforms.opacity.value = opacity;
        
        this.transparent = true;
    }
}