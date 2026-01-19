const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("three-bg").appendChild(renderer.domElement)

camera.position.z = 5

const geometry = new THREE.BufferGeometry()
const count = 1500
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  color: 0x44ccff,
  size: 0.02
})

const points = new THREE.Points(geometry, material)
scene.add(points)

function animate() {
  requestAnimationFrame(animate)
  points.rotation.y += 0.0006
  renderer.render(scene, camera)
}

animate()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
