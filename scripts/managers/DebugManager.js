import * as THREE from "three";
import {DebuggingObject} from "../classes/DebuggingObject.js";

export class DebugManager {
    scene;
    renderer;

    raycaster;
    isDebugMode;

    debuggingObjects;

    constructor(renderer,scene) {
        this.renderer = renderer;
        this.scene = scene;
        this.isDebugMode = false;
        this.debuggingObjects = new THREE.Group();
    }
    addDebugEventListeners(){
        window.addEventListener("keypress", (event) =>{
            switch (event.key) {
                case 'ş':
                    this.isDebugMode = !this.isDebugMode;
                    // reset debugging objects
                    this.clearDebuggingObjects();
                    console.log("DEBUGGING MODE: ", this.isDebugMode ? "ON" : "OFF" );
                    break;
            }
        });
    }

    clearDebuggingObjects() {
        console.log(this.debuggingObjects);
        this.scene.remove(this.debuggingObjects);
        this.debuggingObjects.clear();
    }
    initRaycaster(raycaster){
        this.raycaster = raycaster;
    }
    debugRaycaster(object){
        // Raycasting visualize debugging
        const rayLineGeometry = new THREE.BufferGeometry().setFromPoints([
            this.raycaster.ray.origin,
            this.raycaster.ray.origin.clone().add(this.raycaster.ray.direction.multiplyScalar(30)) // Extend ray
        ]);
        const rayLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const rayLine = new THREE.Line(rayLineGeometry, rayLineMaterial);
        this.debuggingObjects.add(rayLine);
        this.addDebuggingObjectsToScene();
    }
    addDebuggingObjectsToScene(){
        this.scene.add(this.debuggingObjects);
    }
}