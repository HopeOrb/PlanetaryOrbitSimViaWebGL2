import * as THREE from './../../node_modules/three/build/three.module.js';

import { ShaderPhongMaterial } from '../materials/ShaderPhongMaterial.js';
import { ShaderToonMaterial } from '../materials/ShaderToonMaterial.js';
import {GameObject} from "./GameObject.js";
import * as Three_Bvh_Csg from "three-bvh-csg"

export class Asteroid extends GameObject {

    constructor(color) {
        super();

        this.defaultMaterial = new THREE.MeshPhongMaterial({color: color}); // This is only for testing while development, will be removed in final
        this.phongMaterial = new ShaderPhongMaterial( {color: {value: color}, shininess: {value: 1.0}} );    
        this.toonMaterial = new ShaderToonMaterial( {color: {value: color}} );

        // this.geometry = new THREE.SphereGeometry();
        this.geometry = Asteroid.getAsteroidGeometry(1, 1.1, 1.2);
        
        
        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;
        
        this.geometry.scale(this.sizeX, this.sizeY, this.sizeZ);
        this.material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
        
        
        
        this.material = this.defaultMaterial;
    }
    
    
    
    static getAsteroidGeometry(scaleX, scaleY, scaleZ) {
        // According to the example we should be calling .updateMatrixWorld after some operations
        // Brushes are meshes too (class three_bvh_csg.Brush extends THREE.Mesh)
        const resultingBrush = new Three_Bvh_Csg.Brush(/* a_geometry */);
        resultingBrush.geometry = new THREE.SphereGeometry(1);
        resultingBrush.geometry.scale(scaleX, scaleY, scaleZ);
        // resultingBrush.updateMatrixWorld();
        
        const evaluator = new Three_Bvh_Csg.Evaluator();
        // { // Subtract a single crater
        // 	smallBigSphereBrush.geometry = new THREE.SphereGeometry();
        // 	smallBigSphereBrush.geometry.scale(0.5, 0.5, 0.5);
        // 	smallBigSphereBrush.geometry.translate(3, 3, 3);
        // 	// smallBigSphereBrush.updateMatrixWorld();
        // 	resultingBrush.geometry = evaluator.evaluate(resultingBrush, smallBigSphereBrush, Three_Bvh_Csg.SUBTRACTION).geometry;
        // }
        
        for (let i of [-1, 0, 1]) for (let j of [-1, 0, 1]) for (let k of [-1, 0, 1]) {
            // Subtract a single crater
            const smallBigSphereBrush = new Three_Bvh_Csg.Brush(/* a_geometry */);
            smallBigSphereBrush.geometry = new THREE.SphereGeometry();
            
            const getRand = () => 0.1*(0.1 + 2*(Math.random() + 0.5))
            smallBigSphereBrush.geometry.scale(getRand(), getRand(), getRand());
            const distFromCenter = (i**2 + j**2 + k**2)**(1/2);
            smallBigSphereBrush.geometry.translate(scaleX*i/distFromCenter, scaleY*j/distFromCenter, scaleZ*k/distFromCenter);
            // smallBigSphereBrush.updateMatrixWorld();
            resultingBrush.geometry = evaluator.evaluate(resultingBrush, smallBigSphereBrush, Three_Bvh_Csg.SUBTRACTION).geometry;
        }
        
        resultingBrush.geometry.scale(2, 2, 2);
        return resultingBrush.geometry;
    }
    
    

}