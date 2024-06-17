import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GLTF Loader
const loader = new GLTFLoader();
loader.load(
  './models/ship.gltf',  // Ensure this path is correct
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Position the model
    model.position.set(0, 0, 0);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      model.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});