import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//GUI Debugger
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doroHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')

const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoghnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassambientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8,8)
grassambientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS =THREE.RepeatWrapping
grassambientOcclusionTexture.wrapS =THREE.RepeatWrapping
grassNormalTexture.wrapS =THREE.RepeatWrapping
grassRoughnessTexture.wrapS =THREE.RepeatWrapping
grassColorTexture.wrapT =THREE.RepeatWrapping
grassambientOcclusionTexture.wrapT =THREE.RepeatWrapping
grassNormalTexture.wrapT =THREE.RepeatWrapping
grassRoughnessTexture.wrapT =THREE.RepeatWrapping

//Fog
const fog = new THREE.Fog('#242621',1,20)
scene.fog = fog

// House
const house = new THREE.Group();
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        aoMap : brickAmbientOcclusionTexture,
        normalMap : brickNormalTexture,
        roughnessMap : brickRoghnessTexture
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))
walls.position.y=1.25
house.add(walls)

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#c23616'})
)
roof.position.y=3
roof.rotation.y = Math.PI * 0.25
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map : doorColorTexture,
        transparent:true,
        alphaMap: alphaTexture,
        aoMap : ambientOcclusionTexture,
        displacementMap : doroHeightTexture,  //Adding segemnts to apply this
        displacementScale:0.1,
        normalMap : doorNormalTexture,
        metalnessMap : doorMetalnessTexture,
        roughnessMap : doorRoughnessTexture
    })
)
// door.rotation.z = Math.PI * .5
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
door.position.y = 0.90
door.position.z = 2.001
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(.5,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color : '#7CFC00'})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.position.set(0.95,.35,2.6)


const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.5,0.5,0.5)
bush2.position.set(1.55,.2,2.6)


const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(1.5,1.5,1.5)
bush3.position.set(-6.5,.5,-1.5)


const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(1.5,1.5,1.5)
bush4.position.set(5.5,.5,2.5)
house.add(bush1,bush2,bush3,bush4)

//Graves Group
const graves = new THREE.Group()
scene.add(graves)

//Grave
const graveGeometry = new THREE.BoxBufferGeometry(0.5,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color : '#aaa69d'})

for(let i=0; i <50 ; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6.6
    const x = Math.sin(angle) * radius   //For position in z-axis
    const z = Math.cos(angle) * radius   //For position in x-axis

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random()-0.5) * 0.4
    grave.rotation.z = (Math.random()-0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        aoMap:grassambientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

//Lights

// Ambient light
const ambientLight = new THREE.AmbientLight('#34495e', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#34495e', 0.22)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Point Light
const doorLight = new THREE.PointLight('#e74c3c',1,7)
doorLight.position.z =2.7
doorLight.position.y =2.4
house.add(doorLight)

//Ghost Lights
const point1 = new THREE.PointLight('#FF6600',2,3)
const point2 = new THREE.PointLight('#0062FF',2,3)
const point3 = new THREE.PointLight('#9D00FF',2,3)
scene.add(point1,point2,point3)




//PointLight Helper
// const pointLightHelper = new THREE.PointLightHelper(pointLight,1)
// scene.add(pointLightHelper)

//Sizes
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
renderer.setClearColor('#242621')

//Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
point1.castShadow = true
point2.castShadow = true
point3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.far = 7

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.mapSize.far = 7

point1.shadow.mapSize.height = 256
point1.shadow.mapSize.width = 256
point1.shadow.mapSize.far = 7

point2.shadow.mapSize.height = 256
point2.shadow.mapSize.width = 256
point2.shadow.mapSize.far = 7

point3.shadow.mapSize.height = 256
point3.shadow.mapSize.width = 256
point3.shadow.mapSize.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Ghosts
    const ghost1Angle = elapsedTime * 0.5
    point1.position.x = Math.cos(ghost1Angle) * 4
    point1.position.z = Math.sin(ghost1Angle) * 4
    point1.position.y = Math.sin(elapsedTime * 3) * 0.3

    const ghost2Angle = -elapsedTime * 0.7
    point2.position.x = Math.cos(ghost2Angle) * 8
    point2.position.z = Math.sin(ghost2Angle) * 7
    point2.position.y = Math.cos(elapsedTime * 2) * 5

    const ghost3Angle = -elapsedTime * 0.32
    point3.position.x = Math.cos(ghost3Angle) * (5 + Math.sin(elapsedTime * .03))
    point3.position.z = Math.sin(ghost3Angle) * (5 + Math.sin(elapsedTime * .05))
    point3.position.y = Math.cos(elapsedTime * 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()