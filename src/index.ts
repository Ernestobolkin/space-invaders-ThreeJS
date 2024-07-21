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
const tiltAmount = 0.2; 
const tiltSpeed = 0.05; //TODO - Implement tilt speed


// Particle system for fire effect
const particleCount = 1000;
const particles = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
  color: 0xff6600,
  size: 0.2,
  transparent: true,
  opacity: 0.7,
});

const positions = [];
for (let i = 0; i < particleCount; i++) {
  positions.push((Math.random() - 0.5) * 1.5);
  positions.push((Math.random() - 0.5) * 1.5);
  positions.push((Math.random() - 0.5) * 1.5);
}
particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

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

    particleSystem.position.set(0, 0, -10);
    ship.add(particleSystem);

    const animate = () => {
      requestAnimationFrame(animate);
      updateMovement();
      updateParticles();
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
    ship.rotation.z = 0;
    if (move.forward) ship.position.z -= speed;
    if (move.backward) ship.position.z += speed;
    if (move.left){
      ship.position.x -= speed;
      ship.rotation.z = -tiltAmount;
    };
    if (move.right) {
      ship.rotation.z = tiltAmount;
      ship.position.x += speed;
    }
  }
};

const updateParticles = () => {
  const positions = particles.attributes.position.array;
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i + 1] -= 0.01; // Move particles downwards
    if (positions[i + 1] < -0.5) positions[i + 1] = 0.5; // Reset particle position
  }
  particles.attributes.position.needsUpdate = true;
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