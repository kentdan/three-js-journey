import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'
THREE.ColorManagement.enabled = false
// Texture
const loadingManager = new THREE.LoadingManager()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const doorColorTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/color.jpg')
const doorAlphaTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/height.jpg')
const doorNormalTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/normal.jpg')
const doorMetalnessTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/metalness.jpg')
const doorRoughnessTexture = new THREE.TextureLoader(loadingManager).load('/textures/door/roughness.jpg')
const matcapTexture = new THREE.TextureLoader(loadingManager).load('/textures/matcaps/3.png')
const gradientTexture = new THREE.TextureLoader(loadingManager).load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter // can be use for twm logo

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

/**
 * debug
 */
const gui = new lil.GUI()
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

// material
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color('purple')

// material.opacity = 0.5
// material.transparent = true

//const material = new THREE.MeshNormalMaterial()
//material.wireframe = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
//material.flatShading = true

//const material = new THREE.MeshLambertMaterial() // simple light but artifact
// const material = new THREE.MeshPhongMaterial() // no articact but performance issue
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture // ambient occlusion ambient light source
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture // displacement map how much the texture is going to be displaced
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(1,1)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture

//debug

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)

/**
 * light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// 3d mesh
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material 
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material 
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material 
)
scene.add(sphere,torus,plane)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    sphere.position.x = 1.5
    torus.position.x = 0
    plane.position.x = -1.5
    
    sphere.rotation.y = 0.25 * elapsedTime
    torus.rotation.y = 0.25 * elapsedTime
    plane.rotation.y = 0.25 * elapsedTime

    sphere.rotation.x = 0.25 * elapsedTime
    torus.rotation.x = 0.25 * elapsedTime
    plane.rotation.x = 0.25 * elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()