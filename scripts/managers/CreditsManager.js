import * as THREE from "three";

export class CreditsManager {

    letterMap;
    creatorNames;

    constructor(scene,renderer) {
        this.scene = scene;
        this.renderer = renderer;
    }

    //
    init(){
        this.letterMap = this.createLetterMap();
        this.creators = new THREE.Group();
    }
    initCreators(){
        this.creatorNames = ["EKIN DOGA TASKIN",
        "ILTER DOGAC DONMEZ",
        "MELIH KOC",
        "MURAT EREN GUVEN"];
        const offsetY = 5; // Space between names in Y axis
        for (let i = 0; i < this.creatorNames.size; i++) {
            this.creators.add(this.createSentence(this.creatorNames[i], i + offsetY));
        }
    }
    addCreditsRelativeToPosition(camera, offset = {x:0,y:0,z:-10}) {
        // Determine the position relative to the camera
        const cameraPosition = camera.position.clone();
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion); // Forward vector
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);   // Right vector
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);      // Up vector

        // Compute the target position relative to the camera
        const targetPosition = cameraPosition
            .add(forward.multiplyScalar(offset.z))
            .add(right.multiplyScalar(offset.x))
            .add(up.multiplyScalar(offset.y));

        // Set the position of the sentence group
        this.creators.position.copy(targetPosition);

        // Align the sentence group to face the camera
        this.creators.quaternion.copy(camera.quaternion);

        // Add the sentence to the scene
        this.scene.add(this.creators);
    }
    createLetter(letter){
        const vertices = this.letterMap[letter];
        if (!vertices || vertices.length === 0) return new THREE.Group();

        const group = new THREE.Group();
        for (let i = 0; i < vertices.length; i += 2) {
            const geometry = new THREE.BufferGeometry().setFromPoints([vertices[i], vertices[i + 1]]);
            const material = new THREE.LineBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(geometry, material);
            group.add(line);
        }
        return group;
    }
    createSentence(sentence, offsetY = 0) {
        const sentenceGroup = new THREE.Group();
        let offsetX = 0;

        for (let char of sentence.toUpperCase()) {
            const letterGroup = this.createLetter(char);
            letterGroup.position.x = offsetX;
            letterGroup.position.y = offsetY;
            sentenceGroup.add(letterGroup);
            offsetX += 3; // Adjust spacing between letters
        }

        return sentenceGroup;
    }

    addSentenceToScene(scene, sentence) {
        const sentenceGroup = this.createSentence(sentence);
        scene.add(sentenceGroup);
    }
    createLetterMap() {
        // Line coordinates from i to i+1
        const unit = 1;

        return {
            E: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0.5, 0, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
            ],
            K: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, -1, 0),
            ],
            I: [
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
            ],
            N: [
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(1, -1, 0), new THREE.Vector3(1, 1, 0),
            ],
            " ": [], // Space has no lines.
            D: [
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0.5, 0.5, 0),
                new THREE.Vector3(0.5, 0.5, 0), new THREE.Vector3(0.5, -0.5, 0),
                new THREE.Vector3(0.5, -0.5, 0), new THREE.Vector3(-1, -1, 0),
            ],
            O: [
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1, 0, 0),
            ],
            G: [
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(1, -1, 0), new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0),
            ],
            A: [
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0.5, 0, 0),
            ],
            T: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
            ],
            S: [
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(1, -1, 0), new THREE.Vector3(-1, -1, 0),
            ],
            L: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
            ],
            R: [
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0.5, 1, 0),
                new THREE.Vector3(0.5, 1, 0), new THREE.Vector3(0.5, 0, 0),
                new THREE.Vector3(0.5, 0, 0), new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0.5, -1, 0),
            ],
            C: [
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
            ],
            M: [
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0),
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, -1, 0),
            ],
            Z: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
            ],
            U: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(1, -1, 0), new THREE.Vector3(1, 1, 0),
            ],
            V: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 1, 0),
            ],
            H: [
                new THREE.Vector3(-1, 1, 0), new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, -1, 0),
            ],
        };
    }
}