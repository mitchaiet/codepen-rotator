import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('white')
camera.position.set(0, 14, 0)
controls.maxPolarAngle = Math.PI/ 2
controls.autoRotate = true
controls.enableDamping = true
renderer.shadowMap.enabled = true

const light = new THREE.DirectionalLight()
light.position.set(10, 10, 10)
const c = light.shadow.camera;
[c.left, c.right, c.top, c.bottom, c.near, c.far] = [-20, 20, 20, -20, 0, 30]
light.castShadow = true
scene.add(light)
scene.add(new THREE.AmbientLight('white', 0.1))

const geom = new THREE.PlaneGeometry(1e3, 1e3).rotateX(-Math.PI / 2)
const mat = new THREE.ShadowMaterial({ transparent: true, opacity: 0.5 })
const mesh = new THREE.Mesh(geom, mat)
mesh.receiveShadow = true;
scene.add(mesh)

function OneBlob(anchor, color='white') {
  const g = new THREE.Group() //pivot
  const geom = new THREE.BoxGeometry(0.5, 1, 0.5)
  switch (anchor) {
    case 'bottom':
      geom.translate(0, 0.5, 0);
      g.position.y = -0.5
      break
    case 'left':
      geom.translate(0.5, 0, 0);
      g.position.x = -0.5
      break
    case 'right':
      geom.translate(-0.5, 0, 0);
      g.position.x = 0.5
      break
    default:
      throw 1;
  }
  const mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.castShadow = true
  mesh.receiveShadow = true
  g.add(mesh)
  return g
}

function TheBlob() {
  //  4
  //l 3 r
  //  2
  //  1
  const man = new THREE.Group()
  const b1 = OneBlob('bottom')
  man.add(b1)
  const b2 = OneBlob('bottom')
  b2.position.y = 1
  b1.add(b2)
  const b3 = OneBlob('bottom')
  b3.position.y = 1
  b2.add(b3)
  const b4 = OneBlob('bottom')
  b4.position.y = 1
  b4.scale.setScalar(2)
  b3.add(b4)
  let curr = b3
  const rwing = []
  for (let i = 0; i < 10; ++i) {
    const b = OneBlob('left', i == 3 ? 'crimson': '#222')
    b.position.x = i ? 1 : 0.5
    b.position.y = 0.5
    curr.add(b)
    rwing.push(b)
    curr = b
  }
  curr = b3
  const lwing = []
  for (let i = 0; i < 10; ++i) {
    const b = OneBlob('right', i == 2 ? 'crimson' : '#222')
    b.position.x = i ? -1 : -0.5
    b.position.y = 0.5
    curr.add(b)
    lwing.push(b)
    curr = b
  }

  gsap.fromTo(b1.rotation,
    { x: Math.PI / 180 * -5, duration: 1, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' },
    { x: Math.PI / 180 * 10, duration: 2, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' })
  gsap.fromTo(b2.rotation,
    { x: Math.PI / 180 * 5, duration: 1, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' },
    { x: -Math.PI / 180 * 5, duration: 2, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' })
  gsap.fromTo(b4.rotation,
    { x: Math.PI / 180 * 10, duration: 1, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' },
    { x: -Math.PI / 180 * 30, duration: 1, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' })
  gsap.fromTo(lwing.map(m => m.rotation),
    { y: () => Math.random()* -Math.PI / 5, duration: 1 , repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' },
    { y: () => Math.random()* Math.PI / 2, duration: 1 , repeat: -1, yoyo: true, yoyoEase: true, ease: 'none' })
  gsap.fromTo(rwing.map(m => m.rotation),
    { y: () => Math.random()* Math.PI / 5, duration: 1, repeat: -1, yoyo: true, yoyoEase: true, ease: 'power4' },
    { y: () => Math.random()* -Math.PI / 2, duration: 2 , repeat: -1, yoyo: true, yoyoEase: true, ease: 'elastic' })

  return man
}

const theBlob = TheBlob()
theBlob.position.y = 1
scene.add(theBlob)

// ----
// render
// ----

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(), 0.2, 0.5, 0.5))

renderer.setAnimationLoop(() => {
  composer.render()
  controls.update()
})

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, false)
  composer.setPixelRatio(dpr)
  composer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', () => resize(innerWidth, innerHeight))
dispatchEvent(new Event('resize'))
document.body.prepend(renderer.domElement)
