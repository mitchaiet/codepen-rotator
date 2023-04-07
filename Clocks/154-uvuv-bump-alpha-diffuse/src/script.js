import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Alexander Krivitskiy https://unsplash.com/photos/o7wiNx9x9OQ
const image_url = 'https://images.unsplash.com/photo-1602033350291-a9ab8d800269?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60'
const image_tex = new THREE.TextureLoader().load(image_url)
image_tex.wrapT = THREE.RepeatWrapping

// Amit Lahav https://unsplash.com/photos/h3dH3Ov2SqA
const bump_url = 'https://images.unsplash.com/photo-1582363476910-3223e5fd0b32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTl8fGdyYWlufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60'
const bump_tex = new THREE.TextureLoader().load(bump_url)

// ---
// stairs geom poc, in 1x1x1, centered at o
// ---

class StairsGeom extends THREE.BufferGeometry {
  constructor(n_steps = 1) { // +ve int
    super()
    this.type = 'StairsGeom'
    const pos = new Float32Array(3 * 6 * n_steps) //six 3tuple per step
    const norm = new Float32Array(3 * 6 * n_steps) //six 3tuple per step
    const uv = new Float32Array(2 * 6 * n_steps) //six 2tuple per step
    const idx = new Uint16Array(12 * n_steps) //12 indices per step
    const avg = new THREE.Vector3(0, 1, 1).normalize().toArray() // avg normal
    for (let i = 0; i < n_steps; ++i) {
      const r0 = i / n_steps
      const r1 = (i + 1) / n_steps
      pos.set([
        -0.5, r0 - 0.5, 0.5 - r0, // near lower L
        +0.5, r0 - 0.5, 0.5 - r0, // near lower R
        -0.5, r1 - 0.5, 0.5 - r0, // near upper L
        +0.5, r1 - 0.5, 0.5 - r0, // near upper R
        -0.5, r1 - 0.5, 0.5 - r1, // far upper L
        +0.5, r1 - 0.5, 0.5 - r1, // far upper R
      ], i * 18)
      norm.set([
        0, 0, 1, 0, 0, 1, // near lower L and R
        ...avg, ...avg,   // near upper L and R
        0, 1, 0, 0, 1, 0  // far upper L and R
      ], i * 18)
      const rmid = r0 + (r1 - r0) / 2
      uv.set([
        0, r0, 1, r0,     // near lower L and R
        0, rmid, 1, rmid, // near upper L and R
        0, r1, 1, r1      // far upper L and R
      ], i * 12)
      const k = 6 * i
      idx.set([
        k, k + 1, k + 2, k + 2, k + 1, k + 3, // quad (upright)
        k + 2, k + 3, k + 4, k + 4, k + 3, k + 5 // quad
      ], i * 12)
    }
    this.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    this.setAttribute('normal', new THREE.Float32BufferAttribute(norm, 3))
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    this.setIndex(new THREE.Uint16BufferAttribute(idx, 1))
  }
}

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('white')
camera.position.set(-1, 0.5, 1.5)
controls.enableDamping = true

const light = new THREE.PointLight('white', 4, 2, 0.5)
light.position.set(1, 1, 1)
scene.add(light)
scene.add(new THREE.AmbientLight('white', 0.3))

const geom = new StairsGeom(4)
const mat = new THREE.MeshLambertMaterial({ 
  alphaMap: image_tex, alphaTest: 0.12, 
  map: image_tex, bumpMap: bump_tex, bumpScale: 0.01, 
  side: THREE.DoubleSide
})
const mesh = new THREE.Mesh(geom, mat)
scene.add(mesh)

// ----
// render
// ----

renderer.setAnimationLoop((t) => {
  renderer.render(scene, camera)
  controls.update()
  image_tex.offset.y = t * 0.0005
})

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', () => resize(innerWidth, innerHeight))
dispatchEvent(new Event('resize'))
document.body.prepend(renderer.domElement)
