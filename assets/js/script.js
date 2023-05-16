// #region Setup
import * as THREE from 'https://unpkg.com/three/build/three.module.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 5000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// #endregion

// #region Data
// Distances in KM
const data = {
  sun: {
    radius: 695508
  }
}

const distanceScale = 0.00001
// #endregion

// SUN
let geometry = new THREE.SphereGeometry(data.sun.radius * distanceScale, 10, 10)
let material = new THREE.MeshBasicMaterial({color: 0xedcd68})

const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

// #region Movement
// Radians to degrees
const rtg = ang => Math.floor(ang * 180 / Math.PI) % 360

let holding = false
let [mouseLastX, mouseLastY] = [0, 0]

document.addEventListener('wheel', e => {
  let speed = 5
  if (e.deltaY <= 0) speed *= -1
  
  camera.position.x += Math.sin(camera.rotation.y) * speed
  camera.position.y += Math.sin(camera.rotation.x) * -speed
  camera.position.z += (1 - Math.sin(camera.rotation.y) - Math.sin(camera.rotation.x)) * speed
})
document.addEventListener('keydown', e => {
  if (['a', 'd'].includes(e.key)) {
    let speed = 1
    if (e.key === 'a') speed *= -1
    
    camera.position.x += Math.cos(camera.rotation.y) * speed
    camera.position.z += Math.sin(camera.rotation.y) * -speed
  }

  else if (['w', 's'].includes(e.key)) {
    let speed = 1
    if (e.key === 'w') speed *= -1
      
    camera.position.x += Math.sin(camera.rotation.y) * speed
    camera.position.y += Math.sin(camera.rotation.x) * -speed
    camera.position.z += (1 - Math.sin(camera.rotation.y) - Math.sin(camera.rotation.x)) * speed
  }

  else if (['q', 'e'].includes(e.key)) {
    let speed = 1
    if (e.key === 'q') speed *= -1
      
    camera.position.y += speed
  }

  else if (e.key === 'r') {
    camera.rotation.x = 0
    camera.rotation.y = 0
  }
})

document.addEventListener('mousedown', e => {
  holding = true
})
document.addEventListener('mouseup', e => {
  holding = false
})

document.addEventListener('mousemove', e => {
  let mouseX = e.clientX
  let mouseY = e.clientY

  if (holding) {
    camera.rotation.x += (mouseY - mouseLastY) * 0.001
    camera.rotation.y += (mouseX - mouseLastX) * 0.001

    // Limit X rotation, prohibited upside down persons fucking around
    camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.445 * Math.PI), 0.445 * Math.PI)
  }

  mouseLastX = mouseX
  mouseLastY = mouseY
})
// #endregion

// #region Render
function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)

  // GUI
  document.querySelector('.coord').innerHTML = `
  Position: (${Math.floor(camera.position.x)}, ${Math.floor(camera.position.y)}, ${Math.floor(camera.position.z)}) <br>
  Rotation: (${rtg(camera.rotation.x)}, ${rtg(camera.rotation.y)}, ${rtg(camera.rotation.z)})
  `
}
animate()
// #endregion