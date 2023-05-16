// #region Setup
import * as THREE from 'https://unpkg.com/three/build/three.module.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 50000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// #endregion

// #region Data
// Distances in KM
const data = {
  sun: {
    radius: 695508,
    distanceFromSun: 0
  },
  mercury: {
    radius: 2440,
    distanceFromSun: 57e6
  },
  venus: {
    radius: 6052,
    distanceFromSun: 108e6
  },
  earth: {
    radius: 6371,
    distanceFromSun:  150e6
  },
  mars: {
    radius: 3390,
    distanceFromSun: 228e6
  },
  jupiter: {
    radius: 69911,
    distanceFromSun: 779e6
  },
  saturn: {
    radius: 58232,
    distanceFromSun: 1420e6
  },
  uranus: {
    radius: 25362,
    distanceFromSun: 2880e6
  },
  neptune: {
    radius: 24622,
    distanceFromSun: 4500e6
  }
}

const radiusScale = 0.00001
const distanceScale = 0.0000001
// const distanceScale = radiusScale
// #endregion

for (let object of Object.keys(data)) {
  object = data[object]
  let geometry = new THREE.SphereGeometry(object.radius * radiusScale, 10, 10)
  let material = new THREE.MeshBasicMaterial({color: 0xedcd68})
  
  const obj = new THREE.Mesh(geometry, material)
  obj.position.x = object.distanceFromSun * distanceScale
  scene.add(obj)

  // Orbit line
  material = new THREE.LineBasicMaterial({color: 0xffffff})

  let sections = 100
  let points = []

  for (let i = 0; i < sections; i++) {
    let angle = (2 * Math.PI) / sections * i
    let x = Math.cos(angle) * object.distanceFromSun * distanceScale
    let y = Math.sin(angle) * object.distanceFromSun * distanceScale
    points.push(new THREE.Vector3(x, y, 0))
  }
  points.push(points[0])

  geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  const line = new THREE.Line(geometry, material)
  scene.add(line)
}

// #region Movement
// Radians to degrees
const rtg = ang => Math.floor(ang * 180 / Math.PI) % 360

let holding = false
let faster = false
let fastMod = 10
let [mouseLastX, mouseLastY] = [0, 0]

document.addEventListener('wheel', e => {
  let speed = 5 * (faster ? fastMod : 1)
  if (e.deltaY <= 0) speed *= -1
  
  camera.position.x += Math.sin(camera.rotation.y) * speed
  camera.position.y += Math.sin(camera.rotation.x) * -speed
  camera.position.z += Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x) * speed
})
document.addEventListener('keydown', e => {
  if (['a', 'd'].includes(e.key)) {
    let speed = 1 * (faster ? fastMod : 1)
    if (e.key === 'a') speed *= -1
    
    camera.position.x += Math.cos(camera.rotation.y) * speed
    camera.position.z += Math.sin(camera.rotation.y) * -speed
  }

  else if (['w', 's'].includes(e.key)) {
    let speed = 1 * (faster ? fastMod : 1)
    if (e.key === 'w') speed *= -1
      
    camera.position.x += Math.sin(camera.rotation.y) * speed
    camera.position.y += Math.sin(camera.rotation.x) * -speed
    camera.position.z += Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x) * speed
  }

  else if (['q', 'e'].includes(e.key)) {
    let speed = 1 * (faster ? fastMod : 1)
    if (e.key === 'q') speed *= -1
      
    camera.position.y += speed
  }

  else if (e.key === 'r') {
    camera.rotation.x = 0
    camera.rotation.y = 0
  }
  else if (e.key === '0') {
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 10
  }
  switch (e.key) {
    case "ArrowDown":
      camera.rotation.x -= 0.5 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "ArrowUp":
      camera.rotation.x += 0.5 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "ArrowLeft":
      camera.rotation.y += 0.5 * Math.PI
      break
    case "ArrowRight":
      camera.rotation.y -= 0.5 * Math.PI
      break
  }
})

document.addEventListener('keypress', e => {
  if (e.key === 'f') {
    faster = !faster
  }
})

document.addEventListener('mousedown', e => {
  holding = true
  document.body.classList.add('grabbing')
})
document.addEventListener('mouseup', e => {
  holding = false
  document.body.classList.remove('grabbing')
})

document.addEventListener('mousemove', e => {
  let mouseX = e.clientX
  let mouseY = e.clientY

  if (holding) {
    camera.rotation.x += (mouseY - mouseLastY) * 0.001
    camera.rotation.y += (mouseX - mouseLastX) * 0.001

    // Limit X rotation, prohibited upside down persons fucking around
    camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
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