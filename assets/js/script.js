// #region Setup
import * as THREE from 'https://unpkg.com/three/build/three.module.js'

const textureLoader = new THREE.TextureLoader()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 10000000)
camera.position.z = 5000

const renderer = new THREE.WebGLRenderer({antialias: true, pixelRatio: window.devicePixelRatio})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// #endregion

// #region Data
// Distances in KM
const data = {
  sun: {
    name: 'Sun',
    color: 0xFFA63A04,
    radius: 695508,
    distanceFromSun: 0,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
  },
  mercury: {
    name: 'Mercury',
    color: 0xFF797979,
    radius: 2440,
    distanceFromSun: 57e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 88,
    position: 0
  },
  venus: {
    name: 'Venus',
    color: 0xFFB06D20,
    radius: 6052,
    distanceFromSun: 108e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 225,
    reverse: true,
    position: 0
  },
  earth: {
    name: 'Earth',
    color: 0xFF35364A,
    radius: 6371,
    distanceFromSun:  150e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 365,
    position: 0
  },
  mars: {
    name: 'Mars',
    color: 0xFF74301E,
    radius: 3390,
    distanceFromSun: 228e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 687,
    position: 0
  },
  jupiter: {
    name: 'Jupiter',
    color: 0xFF645C50,
    radius: 69911,
    distanceFromSun: 779e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 4333,
    position: 0
  },
  saturn: {
    name: 'Saturn',
    color: 0xFF8F8158,
    radius: 58232,
    distanceFromSun: 1420e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 10759,
    position: 0,

    ringMesh: undefined,
    ringColor: 0xFFF8F9FA,
    ringDistanceFromPlanet: 7000,
    ringWidth: 25000
  },
  uranus: {
    name: 'Uranus',
    color: 0xFF579DC7,
    radius: 25362,
    distanceFromSun: 2880e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 30687,
    reverse: true,
    position: 0
  },
  neptune: {
    name: 'Neptune',
    color: 0xFF0179B4,
    radius: 24622,
    distanceFromSun: 4500e6,
    texture: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.turbosquid.com%2FPreview%2F001203%2F681%2FZB%2FZ.jpg&f=1&nofb=1&ipt=9029fdb7c9e0ea1dcc60b2e560f88371f145664c1102f6605af43ed870a82b2e&ipo=images',
    
    rotateDay: 60190,
    position: 0
  }
}

const radiusScale =   0.001
const distanceScale = 0.0001
const timeScale = 10000000
// #endregion

// #region Planets
for (let object of Object.keys(data)) {
  textureLoader.load(data[object].texture, texture => {
    object = data[object]
    let geometry = new THREE.SphereGeometry(object.radius * radiusScale, 50, 50)
    let material = new THREE.MeshBasicMaterial({map: texture}) //({color: object.color})
    
    const obj = new THREE.Mesh(geometry, material)
    obj.position.x = object.distanceFromSun * distanceScale
    scene.add(obj)
    object.mesh = obj

    // Beatiful rings
    if (object.name === 'Saturn') {
      const geometry = new THREE.RingGeometry(object.radius * radiusScale + object.ringDistanceFromPlanet * radiusScale, object.radius * radiusScale + object.ringDistanceFromPlanet * radiusScale + object.ringWidth * radiusScale, 30)
      const material = new THREE.MeshBasicMaterial({color: object.ringColor, side: THREE.DoubleSide})
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      mesh.rotation.x = 0.4 * Math.PI
      mesh.rotation.y = 0.15 * Math.PI
      object.ringMesh = mesh
    }

    // Orbit line
    material = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 0.04, transparent: true})

    let sections = 1000
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
  })
}
// #endregion

// #region Camera Movement
// Radians to degrees
const rtg = ang => Math.floor(ang * 180 / Math.PI) % 360

const pressedKeys = []
let holding = false
let faster = false
let fastMod = 50
let [mouseLastX, mouseLastY] = [0, 0]

document.addEventListener('wheel', e => {
  let speed = 15 * (faster ? fastMod : 1)
  if (e.deltaY <= 0) speed *= -1
  
  camera.position.x += Math.sin(camera.rotation.y) * speed
  camera.position.y += Math.sin(camera.rotation.x) * -speed
  camera.position.z += Math.cos(camera.rotation.y) * Math.cos(camera.rotation.x) * speed
})
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

document.addEventListener('keydown', e => {
  if (!pressedKeys.includes(e.key.toLowerCase())) pressedKeys.push(e.key.toLowerCase())
})
document.addEventListener('keyup', e => {
  pressedKeys.splice(pressedKeys.indexOf(e.key.toLowerCase()), 1)
})

document.addEventListener('keypress', e => {
  const key = e.key.toLowerCase()

  if (key === 'f') {
    faster = !faster
  }
  else if (key === 'r') {
    camera.rotation.x = 0
    camera.rotation.y = 0
  }

  if (!isNaN(Number(key))) {
    const index = Number(key)
    const planetName = Object.keys(data)[index]
    if (planetName) {
      const planet = data[planetName]
      camera.position.x = planet.mesh.position.x
      camera.position.y = planet.mesh.position.y
      camera.position.z = planet.mesh.position.z + planet.radius * radiusScale / 2 + 1000
      camera.lookAt(planet.mesh.position.x, planet.mesh.position.y, planet.mesh.position.z)
    }
  }  

  switch (key) {
    case "arrowdown":
      camera.rotation.x -= 0.5 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "arrowup":
      camera.rotation.x += 0.5 * Math.PI
      camera.rotation.x = Math.min(Math.max(camera.rotation.x, -0.5 * Math.PI), 0.5 * Math.PI)
      break
    case "arrowleft":
      camera.rotation.y += 0.5 * Math.PI
      break
    case "arrowright":
      camera.rotation.y -= 0.5 * Math.PI
      break
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

// #region Planet Movement
function movePlanets() {
  for (let object of Object.keys(data)) {
    const planet = data[object]
    if (!planet.rotateDay) continue
    planet.position += (2 * Math.PI / planet.rotateDay / 24 / 60 / 60 / 60) * timeScale * (planet.reverse ? -1 : 1)
    planet.mesh.position.x = Math.cos(planet.position) * planet.distanceFromSun * distanceScale
    planet.mesh.position.y = Math.sin(planet.position) * planet.distanceFromSun * distanceScale
    
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
  // GUI
  document.querySelector('.coord').innerHTML = `
  Position: (${Math.floor(camera.position.x)}, ${Math.floor(camera.position.y)}, ${Math.floor(camera.position.z)}) <br>
  Rotation: (${rtg(camera.rotation.x)}, ${rtg(camera.rotation.y)})
  `
}
animate()
// #endregion