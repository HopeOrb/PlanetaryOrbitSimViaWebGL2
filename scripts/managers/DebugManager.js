import * as THREE from "three";

export class DebugManager {
    scene;
    renderer;
    debugMode;

    constructor(renderer,scene) {
        this.renderer = renderer;
        this.scene = scene;
        this.debugMode = false;
    }
    addDebugEventListeners(){
        window.addEventListener("keydown", (event) =>{
            switch (event.key) {
                case 'ş':
                    this.debugMode = !this.debugMode;
            }
        });
    }
    debugRaycaster(){

    }
}