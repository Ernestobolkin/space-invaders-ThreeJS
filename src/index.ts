import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);  // Set background to white

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 75, 0);  // Position the camera high above the ship, x, y, z.
camera.lookAt(0, 0, 0);  // Make the camera look down at the origin

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light with intensity of 1
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity of 1
directionalLight.position.set(9, 9, 9); // Position the light
scene.add(directionalLight);

let ship: THREE.Object3D;
const speed = 0.5;

// GLTF Loader
const loader = new GLTFLoader();
loader.load(
  '/src/models/ship.gltf',  // Ensure this path is correct
  (gltf) => {
    ship = gltf.scene;
    scene.add(ship);

    // Position the model
    ship.position.set(0, 0, 35);
    ship.rotation.y = Math.PI;  // Rotate the ship 180 degrees
    const animate = () => {
      requestAnimationFrame(animate);
      updateMovement();
      renderer.render(scene, camera);
    };

    animate();
  },
  undefined,
  (error) => {
    console.error('An error happened', error);
  }
);

const move = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const updateMovement = () => {
  if (ship) {
    if (move.forward) ship.position.z -= speed;
    if (move.backward) ship.position.z += speed;
    if (move.left) ship.position.x -= speed;
    if (move.right) ship.position.x += speed;
  }
};

const onDocumentKeyDown = (event: KeyboardEvent) => {
  console.log(event.which, "key down")
  const keyCode = event.which;
  switch (keyCode) {
    case 87: // W key
      move.forward = true;
      break;
    case 83: // S key
      move.backward = true;
      break;
    case 65: // A key
      move.left = true;
      break;
    case 68: // D key
      move.right = true;
      break;
  }
};

const onDocumentKeyUp = (event: KeyboardEvent) => {
  console.log(event.which, "key up")
  const keyCode = event.which;
  switch (keyCode) {
    case 87: // W key
      move.forward = false;
      break;
    case 83: // S key
      move.backward = false;
      break;
    case 65: // A key
      move.left = false;
      break;
    case 68: // D key
      move.right = false;
      break;
  }
};

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});