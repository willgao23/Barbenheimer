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

//Create shapes

let scale = 0.3;

function drawHeart(x, y) {
    const heartShape = new THREE.Shape();

    heartShape.moveTo( x - (0.5 * scale), y - (0.5 * scale));
    heartShape.bezierCurveTo( x - (0.5 * scale), y - (0.5 * scale), x - (0.4 * scale), y, x, y );
    heartShape.bezierCurveTo( x + (0.6 * scale), y, x + (0.6 * scale), y - (0.7 * scale),x + (0.6 * scale), y - (0.7* scale));
    heartShape.bezierCurveTo( x + (0.6 * scale), y - (1.1 * scale), x + (0.3 * scale), y - (1.54 * scale), x - (0.5 * scale), y - (1.9 * scale));
    heartShape.bezierCurveTo( x - (1.2 * scale), y - (1.54 * scale), x - (1.6 * scale), y - (1.1 * scale), x - (1.6 * scale), y - (0.7 * scale));
    heartShape.bezierCurveTo( x - (1.6 * scale), y - (0.7 * scale), x -(1.6 * scale), y, x - (1.0 * scale), y );
    heartShape.bezierCurveTo( x - (0.7 * scale), y, x - (0.5 * scale), y - (0.5 * scale), x - (0.5 * scale), y - (0.5 * scale) );

    return heartShape;
}

let hearts = []
for (let i = 0; i < 105; i++) {
    const shape = drawHeart(0, 0)
    const geometry = new THREE.ShapeGeometry( shape )
    const material = new THREE.MeshMatcapMaterial()
    let rand = Math.random()
    if (rand > 0.5) {
        material.matcap = oppenheimer
    } else if (rand < 0.25) {
        material.matcap = barbOuter
    } else {
        material.matcap = barbInner
    }
    material.side = THREE.DoubleSide
    const heart = new THREE.Mesh( geometry, material ) 

    heart.position.x = (Math.random() - 0.5) * 15
    heart.position.y = (Math.random() - 0.5) * 15
    heart.position.z = (Math.random() - 0.5) * 15

    scene.add( heart )
    hearts.push(heart)

}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 6
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

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for (let i = 0; i < 25; i++) {
        hearts[i].rotation.y = elapsedTime * 0.05 * i
    }

    for (let i = 25; i < 53; i++) {
        hearts[i].rotation.y = elapsedTime * 0.05 * i
    }
    
    for (let i = 53; i < 75; i++) {
        hearts[i].rotation.y = - elapsedTime * 0.025 * i
    }

    for (let i = 75; i < hearts.length; i++) {
        hearts[i].rotation.y = - elapsedTime * 0.025 * i
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

