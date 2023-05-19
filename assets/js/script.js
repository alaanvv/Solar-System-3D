// #region Setup
import * as THREE from 'https://unpkg.com/three/build/three.module.js'

const textureLoader = new THREE.TextureLoader()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.2, 1e10)
camera.position.z = 5000

const renderer = new THREE.WebGLRenderer({ pixelRatio: window.devicePixelRatio })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let fps = 0
let frameCount = 0
let lastTime = performance.now()

if (window.innerWidth < 700) alert('For a better experience, use a computer. Its hard to pilot this spaceship.')
// #endregion

// #region Data
const radiusScale = 1
const distanceScale = radiusScale
const timeScale = 1


const PSX = true

const planetFragments = PSX ? 6 : 50
const saturnRingFragments = PSX ? 8 : 30
const sunLightFragments = PSX ? 5 : 8
const orbitLineFragments = PSX ? 1000 : 1000
const skydomeFragments = PSX ? 10 : 10

const fastMod = 100

const data = {
  sun: {
    name: 'Sun',
    radius: 695508 * radiusScale,
    distanceFromSun: 0 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/sun${PSX ? '-psx' : ''}.png`,
  },
  mercury: {
    name: 'Mercury',
    radius: 2440 * radiusScale,
    distanceFromSun: 57e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/mercury${PSX ? '-psx' : ''}.png`,

    translateDays: 88 * timeScale,
    rotateDays: 58.6 * timeScale,
    position: 0
  },
  venus: {
    name: 'Venus',
    radius: 6052 * radiusScale,
    distanceFromSun: 108e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/venus${PSX ? '-psx' : ''}.png`,

    translateDays: 225 * timeScale,
    rotateDays: 243 * timeScale,
    rotateReverse: true,
    translateReverse: true,
    position: 0
  },
  earth: {
    name: 'Earth',
    radius: 6371 * radiusScale,
    distanceFromSun: 150e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/earth${PSX ? '-psx' : ''}.png`,

    translateDays: 365 * timeScale,
    rotateDays: 1 * timeScale,
    position: 0
  },
  mars: {
    name: 'Mars',
    radius: 3390 * radiusScale,
    distanceFromSun: 228e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/mars${PSX ? '-psx' : ''}.png`,

    translateDays: 687 * timeScale,
    rotateDays: 1.03 * timeScale,
    position: 0
  },
  jupiter: {
    name: 'Jupiter',
    radius: 69911 * radiusScale,
    distanceFromSun: 779e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/jupiter${PSX ? '-psx' : ''}.png`,

    translateDays: 4333 * timeScale,
    rotateDays: 0.41 * timeScale,
    position: 0
  },
  saturn: {
    name: 'Saturn',
    radius: 58232 * radiusScale,
    distanceFromSun: 1420e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/saturn${PSX ? '-psx' : ''}.png`,

    translateDays: 10759 * timeScale,
    rotateDays: 0.44 * timeScale,
    position: 0,

    ringColor: 0x625E5F,
    ringDistanceFromPlanet: 7000 * radiusScale,
    ringWidth: 25000 * radiusScale
  },
  uranus: {
    name: 'Uranus',
    color: 0xFF579DC7,
    radius: 25362 * radiusScale,
    distanceFromSun: 2880e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/uranus${PSX ? '-psx' : ''}.png`,

    translateDays: 30687 * timeScale,
    rotateDays: 0.72 * timeScale,
    translateReverse: true,
    position: 0
  },
  neptune: {
    name: 'Neptune',
    color: 0xFF0179B4,
    radius: 24622 * radiusScale,
    distanceFromSun: 4500e6 * distanceScale,
    texture: `https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/neptune${PSX ? '-psx' : ''}.png`,

    translateDays: 60190 * timeScale,
    rotateDays: 0.67 * timeScale,
    position: 0
  }
}
// #endregion

// #region Sky
const texture = textureLoader.load(`https://raw.githubusercontent.com/alaanvv/Solar-System-3D/main/assets/img/stars${PSX ? '-psx' : ''}.png`)
let geometry = new THREE.SphereGeometry(data.neptune.distanceFromSun * 1.5, skydomeFragments, skydomeFragments)
let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })

const skydome = new THREE.Mesh(geometry, material)
scene.add(skydome)
// #endregion

// #region Planets (Sun is a fire-element planet)
for (let object of Object.values(data)) {
  const texture = textureLoader.load(object.texture)

  let geometry = new THREE.SphereGeometry(object.radius, planetFragments, planetFragments)
  let material = object.name === 'Sun'
    ? new THREE.MeshBasicMaterial({ map: texture })
    : new THREE.MeshStandardMaterial({ map: texture })

  const objectMesh = new THREE.Mesh(geometry, material)
  scene.add(objectMesh)

  objectMesh.position.x = object.distanceFromSun
  object.mesh = objectMesh

  // Sun light
  if (object.name === 'Sun') {
    const partSize = 2 * Math.PI / sunLightFragments

    // X and [Y, Z]
    for (let pos of ['y', 'z']) {
      for (let angle = 0; angle < sunLightFragments * partSize; angle += partSize) {
        const light = new THREE.PointLight(0xffffff, 0.1)
        objectMesh.add(light)

        const radius = object.radius + data.mercury.distanceFromSun / 4
        light.position.x = Math.sin(angle) * radius
        light.position[pos] = Math.cos(angle) * radius
      }
    }
  }
  // Beatiful rings
  if (object.name === 'Saturn') {
    const innerRadius = object.radius + object.ringDistanceFromPlanet

    let geometry = new THREE.RingGeometry(innerRadius, innerRadius + object.ringWidth, saturnRingFragments)
    let material = new THREE.MeshBasicMaterial({ color: object.ringColor, side: THREE.DoubleSide })
    
    const ringMesh = new THREE.Mesh(geometry, material)
    scene.add(ringMesh)

    ringMesh.rotation.x = 0.4 * Math.PI
    ringMesh.rotation.y = 0.15 * Math.PI
    object.ringMesh = ringMesh
  }

  // Orbit line
  if (object.name !== 'Sun') {
    const points = []
    
    for (let angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / orbitLineFragments) {
      let x = Math.cos(angle) * object.distanceFromSun
      let y = Math.sin(angle) * object.distanceFromSun

      points.push(new THREE.Vector3(x, y, 0))
    }
    points.push(points[0])
    
    let geometry = new THREE.BufferGeometry().setFromPoints(points)
    let material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.05, transparent: true })

    const line = new THREE.Line(geometry, material)
    scene.add(line)
  }
}
// #endregion

// #region Camera Movement
const pressedKeys = []
let dragging = false
let faster = false
let [mouseLastX, mouseLastY] = [0, 0]

// Move forward and backward with scroll
document.addEventListener('wheel', e => {
  let speed = 15 * (faster ? fastMod : 1)
  if (e.deltaY <= 0) speed *= -1

  camera.position.x += Math.sin(camera.rotation.y) * speed
  camera.position.y += Math.sin(camera.rotation.x) * -speed
  camera.position.z += Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x) * speed
})

// Move in all directions with [A, S, D, W, Q, E]
function moveBasedOnKeys() {
  for (let key of pressedKeys) {
    if (['a', 'd'].includes(key)) {
      let speed = 1 * (faster ? fastMod : 1)
      if (key === 'a') speed *= -1

      camera.position.x += Math.cos(camera.rotation.y) * speed
      camera.position.z += Math.sin(camera.rotation.y) * -speed
    }
    else if (['w', 's'].includes(key)) {
      let speed = 1 * (faster ? fastMod : 1)
      if (key === 'w') speed *= -1

      camera.position.x += Math.sin(camera.rotation.y) * speed
      camera.position.y += Math.sin(camera.rotation.x) * -speed
      camera.position.z += Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x) * speed
    }
    else if (['q', 'e'].includes(key)) {
      let speed = 1 * (faster ? fastMod : 1)
      if (key === 'q') speed *= -1

      camera.position.y += speed
    }
  }
}

// Rotate camera with arrows and add to pressedKeys
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()

  if (!pressedKeys.includes(key)) pressedKeys.push(key)

  switch (key) {
    case "arrowdown":
      camera.rotation.x -= 0.25 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "arrowup":
      camera.rotation.x += 0.25 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "arrowleft":
      camera.rotation.y += 0.25 * Math.PI
      break
    case "arrowright":
      camera.rotation.y -= 0.25 * Math.PI
      break
  }
})
document.addEventListener('click', e => {
  const element = e.target
  const key = element.getAttribute('key')
  const pressed = element.hasAttribute('pressed')

  if (!key) return
  
  if (pressed) {
    element.removeAttribute('pressed')
    
    if (key === 'f') faster = false
    else pressedKeys.splice(pressedKeys.indexOf(key), 1)
  }
  else {
    element.setAttribute('pressed', '')

    if (key === 'f') faster = true
    else pressedKeys.push(key)
  }
})

// Remove from pressedKeys
document.addEventListener('keyup', e => {
  const key = e.key.toLowerCase()

  pressedKeys.splice(pressedKeys.indexOf(key), 1)
})

// Special key functions
document.addEventListener('keypress', e => {
  const key = e.key.toLowerCase()

  if (key === 'f') faster = !faster
  else if (key === 'r') {
    camera.rotation.x = 0
    camera.rotation.y = 0
  }

  if (!isNaN(Number(key))) {
    const index = Number(key)
    const planet = Object.values(data)[index]

    if (planet) {
      camera.position.x = planet.mesh.position.x
      camera.position.y = planet.mesh.position.y
      camera.position.z = planet.mesh.position.z + planet.radius * 3
      camera.lookAt(planet.mesh.position.x, planet.mesh.position.y, planet.mesh.position.z)
    }
  }
})

// Start grabbing
document.addEventListener('mousedown', e => {
  dragging = true
  document.body.classList.add('grabbing')
})
document.addEventListener('touchstart', e => {
  if (!dragging) {
    dragging = true
    mouseLastX = e.touches[0].clientX
    mouseLastY = e.touches[0].clientY
  }
})

// Stop grabbing
document.addEventListener('mouseup', e => {
  dragging = false
  document.body.classList.remove('grabbing')
})
document.addEventListener('touchend', e => {
  dragging = false
})

// Grab the camera
document.addEventListener('mousemove', e => {
  let mouseX = e.clientX
  let mouseY = e.clientY

  if (dragging) {
    camera.rotation.y += (mouseX - mouseLastX) * 0.001
    camera.rotation.x += (mouseY - mouseLastY) * 0.001

    // Limit X rotation
    camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
    camera.rotation.z = Math.min(Math.max(camera.rotation.z, -0.5 * Math.PI), 0.5 * Math.PI)
  }

  mouseLastX = mouseX
  mouseLastY = mouseY
})
document.addEventListener('touchmove', e => {
  e.preventDefault() // Prevent page scrolling

  const x = e.touches[0].clientX
  const y = e.touches[0].clientY

  camera.rotation.x += (y - mouseLastY) * 0.005
  camera.rotation.y += (x - mouseLastX) * 0.005

  // Limit X rotation
  camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)

  mouseLastX = x
  mouseLastY = y
})
// #endregion

// #region Planet Movement
function movePlanets() {
  for (let planet of Object.values(data)) {
    if (planet.name === 'Sun') continue // You're not a planet

    planet.position += (2 * Math.PI / planet.translateDays / 24 / 60 / 60 / (fps || 1)) * (planet.translateReverse ? -1 : 1)
    planet.mesh.position.x = Math.cos(planet.position) * planet.distanceFromSun
    planet.mesh.position.y = Math.sin(planet.position) * planet.distanceFromSun

    planet.mesh.rotation.y -= Math.cos(planet.position) * (2 * Math.PI / planet.rotateDays / 24 / 60 / 60 / (fps || 1)) * (planet.rotateReverse ? -1 : 1)
    planet.mesh.rotation.x += Math.sin(planet.position) * (2 * Math.PI / planet.rotateDays / 24 / 60 / 60 / (fps || 1)) * (planet.rotateReverse ? -1 : 1)
    planet.mesh.rotation.z = planet.position

    if (planet.name === 'Saturn') {
      planet.ringMesh.position.x = planet.mesh.position.x
      planet.ringMesh.position.y = planet.mesh.position.y
      planet.ringMesh.position.z = planet.mesh.position.z
    }
  }
}
// #endregion

// #region Render
function animate() {
  requestAnimationFrame(animate)

  movePlanets()
  moveBasedOnKeys()

  renderer.render(scene, camera)
  
  // Calculate FPS
  const currentTime = performance.now()
  const elapsedTime = currentTime - lastTime
  frameCount++

  if (elapsedTime >= 100) {
    fps = frameCount / (elapsedTime / 100)
    frameCount = 0
    lastTime = currentTime
  }
}

animate()
// #endregion
