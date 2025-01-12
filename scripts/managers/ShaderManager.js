import * as THREE from "three";
import { GameObject } from "../classes/GameObject";

export class ShaderManager{

    scene;

    inPhongShading;
    inToonShading;

    constructor( scene ) {
        this.scene = scene;

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener( 'keydown', (event) => {
            switch (event.key) {
                case '1':
                    this.switchToPhong();
                    break;
                case '2':
                    this.switchToToon();
                    break;
            }
        } )
    }

    switchToPhong() {
        this.scene.traverse( (obj) => {
            if (obj instanceof GameObject) {
                obj.switchToPhong();
            }
        } );

        this.scene.background = 0x000000;

        this.inPhongShading = true;
        this.inToonShading = false;
    }

    switchToToon() {
        this.scene.traverse( (obj) => {
            if (obj instanceof GameObject) {
                obj.switchToToon();
            }
        } );

        this.scene.background = new THREE.Color(0x030207);

        this.inPhongShading = false;
        this.inToonShading = true;
    }
}