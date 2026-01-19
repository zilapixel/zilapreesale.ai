import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: bg, alpha: true });

renderer.setSize(innerWidth, innerHeight);
camera.position.z = 5;

const geometry = new THREE.BufferGeometry();
const count = 2000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05 });
const particles = new THREE.Points(geometry, material);

scene.add(particles);

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();
