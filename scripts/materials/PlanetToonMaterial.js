import { ShaderToonMaterial } from "./ShaderToonMaterial";

export class PlanetToonMaterial extends ShaderToonMaterial {
    constructor( dayTexture, nightTexture ) {
        texture1.value = dayTexture;
        texture2.value = nightTexture;
    }

}