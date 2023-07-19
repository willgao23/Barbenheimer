import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

THREE.ColorManagement.enabled = false

//Debug
const gui = new dat.GUI()

//Canvas
const canvas = document.querySelector('canvas.webgl')

//Scene
const scene = new THREE.Scene()

//Textures
const TextureLoader = new THREE.TextureLoader()
const barbInner = TextureLoader.load('/textures/barbieMatcap2.png')
const barbOuter = TextureLoader.load('/textures/barbieMatcap.png')
const oppenheimer = TextureLoader.load('/textures/oppenheimerMatcap.png')

//Fonts
const fontLoader = new FontLoader()

let xTranslate = 0
let shiftL = 0.70347225

fontLoader.load(
    '/fonts/Bartex_Regular.json',
    (font) => {
        const barbie = new TextGeometry(
            'Barb',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        barbie.center()
        barbie.computeBoundingBox()
        console.log(barbie.boundingBox)
        xTranslate = barbie.boundingBox.min.x - 0.04
        barbie.translate(xTranslate - shiftL, 0, 0)
        const material = new THREE.MeshMatcapMaterial()
        material.matcap = barbOuter
        const outerBarbie = new THREE.Mesh(barbie, material)
        scene.add(outerBarbie)
    }
)

fontLoader.load(
    '/fonts/Bartex_Regular.json',
    (font) => {
        const innerTextGeometry = new TextGeometry(
            'Barb',
            {
                font: font,
                size: 0.5,
                height: 0.3,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        innerTextGeometry.center()
        innerTextGeometry.translate(xTranslate - shiftL, 0, 0.03)
        const innerMaterial = new THREE.MeshMatcapMaterial()
        innerMaterial.matcap = barbInner
        const innerText = new THREE.Mesh(innerTextGeometry, innerMaterial)
        scene.add(innerText)
    }
)

fontLoader.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font) => {
        const oppTextGeometry = new TextGeometry(
            'E N H E I M E R',
            {
                font: font,
                size: 0.3,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        oppTextGeometry.center()
        oppTextGeometry.computeBoundingBox()
        console.log(oppTextGeometry.boundingBox)
        oppTextGeometry.translate(oppTextGeometry.boundingBox.max.x + 0.04 - shiftL, -0.08, 0)
        const oppMaterial = new THREE.MeshMatcapMaterial()
        oppMaterial.matcap = oppenheimer
        const oppText = new THREE.Mesh(oppTextGeometry, oppMaterial)
        scene.add(oppText)
    }
)



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 3
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

//Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.heigh)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    window.location.reload()
})

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

