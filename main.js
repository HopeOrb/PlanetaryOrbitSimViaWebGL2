import './style.css'
import * as THREE from 'three';

// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 4);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( {color: 0x000055} );
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

let t = 0;
const orbitCube = new THREE.Mesh( geometry, material );
orbitCube.position.set(2*Math.cos(t), 0, 2*Math.sin(t));
scene.add(orbitCube);

const plight = new THREE.PointLight( 0xffffff, 100, 0 );
plight.position.set( -3, 3, 3 );
scene.add( plight );

const alight = new THREE.AmbientLight( 0xffffff, 10);
scene.add( alight );

requestAnimationFrame(animate);

function animate() {
  t += 0.004;
  orbitCube.position.set(2*Math.cos(t), 0, 2*Math.sin(t));
  cube.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}