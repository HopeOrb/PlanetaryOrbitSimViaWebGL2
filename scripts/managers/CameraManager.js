import * as THREE from "three";
import {OrbitControls} from "three/addons";

export class CameraManager {
    constructor(renderer) {
        this.fov = 75;
        this.zFar = 1000;
        this.zNear = 0.1;
        this.aspect = window.innerWidth / window.innerHeight;

        this.renderer = renderer;
        this.camera = null;
        this.orbitControls = null;
    }

    init() {
        // Init Camera
        this.camera = new THREE.PerspectiveCamera(this.fov,this.aspect,this.zNear, this.zFar);
        this.setCamPosition(4,4,8);
        this.lookAt(0,0,0);
        // Init OrbitControls
        this.orbitControls = new OrbitControls(this.camera, this.renderer);
        // Configure OrbitControls
        this.orbitControls.panSpeed = 2;
        this.orbitControls.rotateSpeed = 2;
        this.orbitControls.zoomSpeed = 2;
        this.orbitControls.maxDistance = 30;
        this.orbitControls.minDistance = 5;
    }

    setCamPosition(x,y,z){
        this.camera.position.set(x,y,z);
    }

    lookAt(x,y,z) {
        this.camera.lookAt(x,y,z);
    }

    resetCamera(){
        this.orbitControls.reset();
        this.camera.position.set(4, 4, 8);
        // this.camera.lookAt(0, 0, 0); // unnecessary
        this.camera.updateProjectionMatrix();
        // this.controls.update(); // need to update whenever OrbitControls or camera get updates

    }
    initOrbitControls() {

    }
}