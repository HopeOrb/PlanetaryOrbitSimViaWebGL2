import * as THREE from "three";
import { GameObject } from "../classes/GameObject";
import {keyMap} from "./KeyManager.js";
import { Asteroid } from "../classes/Asteroid.js";

export class ShaderManager{

    scene;

    inPhongShading;
    inToonShading;
    backgroundColor;

    constructor( scene ) {
        this.scene = scene;

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener( 'keydown', (event) => {
            switch (event.key) {
                case keyMap.phongShaderButton:
                    if (this.inPhongShading) break;
                    this.switchToPhong();
                    break;
                case keyMap.toonShaderButton:
                    if (this.inToonShading) break;
                    this.switchToToon();
                    break;
            }
        } )
    }

    switchToPhong() {
        this.scene.traverse( (obj) => {
            if ( (obj instanceof GameObject ) || ( obj instanceof Asteroid )) {
                obj.switchToPhong();
            }
        } );
        this.backgroundColor = new THREE.Color(0x000000);
        this.scene.background = this.backgroundColor;

        this.inPhongShading = true;
        this.inToonShading = false;
    }

    switchToToon() {
        this.scene.traverse( (obj) => {
            if (( obj instanceof GameObject ) || ( obj instanceof Asteroid )) {
                obj.switchToToon();
            }
        } );
        this.backgroundColor = new THREE.Color(0x040208);
        this.scene.background = this.backgroundColor;

        this.inPhongShading = false;
        this.inToonShading = true;
    }

    update( obj, timestamp ) {
        if (this.inPhongShading) obj.material.uniforms.time.value += 0.005;	// For moving the lava texture
        //if (this.inToonShading) obj.material.uniforms.opacity.value = 0.5 + (Math.sin(timestamp / 500) / 7);	// So the bloom effect in toon shading oscillates
    }
}