import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * textures
 */
const textureLoader = new THREE.TextureLoader()

// floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg")
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace
floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.repeat.set(8, 8)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.repeat.set(8, 8)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.repeat.set(8, 8)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// walls
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace


// roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

/**
 * House
 */
const houseMeasurments = {
	width:  4,
	height: 2.5,
	depth:  4
}

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20, 100, 100),
	new THREE.MeshStandardMaterial({
		alphaMap: floorAlphaTexture,
		transparent: true,
		map: floorColorTexture,
		aoMap: floorARMTexture,
		roughnessMap: floorARMTexture,
		metalnessMap: floorARMTexture,
		normalMap: floorNormalTexture,
		displacementMap: floorDisplacementTexture,
		displacementScale: 0.35,
		displacementBias: -0.2
	})
)

floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name("floorDisplacementScale")
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name("floorDisplacementBias")

// house group
const house = new THREE.Group()
scene.add(house)

// walls
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(houseMeasurments.width, houseMeasurments.height, houseMeasurments.depth),
	new THREE.MeshStandardMaterial({
		map: wallColorTexture,
		aoMap: wallARMTexture,
		roughnessMap: wallARMTexture,
		metalnessMap: wallARMTexture,
		normalMap: wallNormalTexture
	})
)
walls.position.y += houseMeasurments.height * 0.5
house.add(walls)

// roof
const roofMeasurment = {
	height:         1.5,
	radialSegments: 4,
	radius:         3.5

}

const roof = new THREE.Mesh(
	new THREE.ConeGeometry(roofMeasurment.radius, roofMeasurment.height, roofMeasurment.radialSegments),
	new THREE.MeshStandardMaterial({
		map: roofColorTexture,
		aoMap: roofARMTexture,
		roughnessMap: roofARMTexture,
		metalnessMap: roofARMTexture,
		normalMap: roofNormalTexture
	})
)
roof.position.y += houseMeasurments.height + roofMeasurment.height * 0.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2),
	new THREE.MeshStandardMaterial()
)

door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometyry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
	color: "#ccffcc",
	map: bushColorTexture,
	aoMap: bushARMTexture,
	roughnessMap: bushARMTexture,
	metalnessMap: bushARMTexture,
	normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometyry, bushMaterial)
bush1.scale.setScalar(0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometyry, bushMaterial)
bush2.scale.setScalar(0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometyry, bushMaterial)
bush3.scale.setScalar(0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometyry, bushMaterial)
bush4.scale.setScalar(0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveMeasurments = 
{
	width:  0.6,
	height: 0.8,
	depth:  0.2
}

const graveGeometry = new THREE.BoxGeometry(graveMeasurments.width, graveMeasurments.height, graveMeasurments.depth)
const graveMaterial = new THREE.MeshStandardMaterial()

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++)
{
  const angle = Math.random() * Math.PI * 2
	const radius = houseMeasurments.width - 1 + Math.random() * 4
	const x = Math.sin(angle) * radius
	const z = Math.cos(angle) * radius

	// Mesh
	const grave = new THREE.Mesh(graveGeometry, graveMaterial)
	grave.position.x = x
	grave.position.y = Math.random() * graveMeasurments.height * 0.5
	grave.position.z = z

	grave.rotation.x = (Math.random() - 0.5) * 0.4
	grave.rotation.y = (Math.random() - 0.5) * 0.4
	grave.rotation.z = (Math.random() - 0.5) * 0.4

	// add to graves group
	graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () =>
{
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
	// Timer
	timer.update()
	const elapsedTime = timer.getElapsed()

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()