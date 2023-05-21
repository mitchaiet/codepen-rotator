import * as THREE from 'three';
console.log('Start');
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass';
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
/**
* Startup Base
*/
const initializeEnv = (width = undefined, height = undefined) => {
    const scene = new THREE.Scene();
    const camera = intializeCamera(scene, width, height);
    const { renderer, canvas } = initializeRenderer(scene, camera);
    const controls = initializeControls(camera, canvas);
    const composer = new EffectComposer(renderer);
    if (width && height) {
        initializeStaticSize(camera, renderer, composer, width, height);
    }
    else {
        initializeFullscreen(camera, renderer, composer, canvas);
    }
    return { scene, camera, renderer, canvas, controls, composer };
};
const intializeCamera = (scene, width = window.innerWidth, height = window.innerHeight) => {
    const camera = new THREE.OrthographicCamera();
    scene.add(camera);
    return camera;
};
const initializeRenderer = (scene, camera) => {
    const canvas = document.querySelector('.webgl');
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.render(scene, camera);
    return { renderer, canvas };
};
const initializeControls = (camera, canvas) => {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    return controls;
};
const initializeStaticSize = (camera, renderer, composer, width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
const initializeFullscreen = (camera, renderer, composer, canvas) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
};
/**
* Main Program
*/
const { scene, camera, renderer, composer, controls, canvas } = initializeEnv();
camera.near = 1;
camera.far = 1000;
camera.zoom = 500;
const radius = 7.5;
camera.position.x = radius * Math.sin(Math.PI * 0.5);
camera.position.y = radius * Math.sin(Math.PI * 0.015) * 20.0;
camera.position.z = radius;
const updateOrthoAspect = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    const frustumSize = 1000;
    camera.left = frustumSize * aspect * -0.5;
    camera.right = frustumSize * aspect * 0.5;
    camera.top = frustumSize * 0.5;
    camera.bottom = frustumSize * -0.5;
    camera.updateProjectionMatrix();
};
updateOrthoAspect();
window.addEventListener('resize', updateOrthoAspect);
/**
 * Config
 */
const parameters = {
    background: '0d0c0c',
    rTheta: 3.66,
    rStrength: 0.8,
    gTheta: 4.04,
    gStrength: 0.779,
    bTheta: 4.51,
    bStrength: 0.766,
    sinScale: 2.9,
    sinOffset: 9,
    angle: 1.0
};
/**
 * Materials
 */
const material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    uniforms: {
        uFrame: { value: 0 },
        uRTheta: { value: parameters.rTheta },
        uGTheta: { value: parameters.gTheta },
        uBTheta: { value: parameters.bTheta },
        uRStrength: { value: parameters.rStrength },
        uGStrength: { value: parameters.gStrength },
        uBStrength: { value: parameters.bStrength },
        uSinScale: { value: parameters.sinScale },
        uSinOffset: { value: parameters.sinOffset },
        uAngle: { value: parameters.angle }
    }
});
/**
 * Geometries
 */
let plane;
const generateGeometries = () => {
    plane = new THREE.BoxGeometry(1, 1, 1);
    const m = new THREE.Mesh(plane, material);
    scene.add(m);
};
generateGeometries();
/**
 * Post Processing
 */
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(540, 540), 2.95, 0.15, 0.05);
composer.addPass(bloomPass);
/**
* GUI
**/
const gui = new lil.GUI();
gui.show(false);
gui.addColor(parameters, 'background').onChange((c) => {
    scene.background = new THREE.Color(c);
});
gui.add(parameters, 'rTheta').min(0.0).max(Math.PI * 2.0).step(0.01).onChange((t) => {
    material.uniforms.uRTheta.value = t;
});
gui.add(parameters, 'rStrength').min(0.0).max(1.0).step(0.001).onChange((t) => {
    material.uniforms.uRStrength.value = t;
});
gui.add(parameters, 'gTheta').min(0.0).max(Math.PI * 2.0).step(0.01).onChange((t) => {
    material.uniforms.uGTheta.value = t;
});
gui.add(parameters, 'gStrength').min(0.0).max(1.0).step(0.001).onChange((t) => {
    material.uniforms.uGStrength.value = t;
});
gui.add(parameters, 'bTheta').min(0.0).max(Math.PI * 2.0).step(0.01).onChange((t) => {
    material.uniforms.uBTheta.value = t;
});
gui.add(parameters, 'bStrength').min(0.0).max(1.0).step(0.001).onChange((t) => {
    material.uniforms.uBStrength.value = t;
});
gui.add(parameters, 'sinScale').min(0.0).max(100.0).step(0.1).onChange((t) => {
    material.uniforms.uSinScale.value = t;
});
gui.add(parameters, 'sinOffset').min(0.0).max(100.0).step(0.1).onChange((t) => {
    material.uniforms.uSinOffset.value = t;
});
gui.add(parameters, 'angle').min(-1.0).max(1.0).step(0.001).onChange((t) => {
    material.uniforms.uAngle.value = t;
});
gui.add(bloomPass, 'radius').min(0.01).max(5.0).step(0.01);
gui.add(bloomPass, 'strength').min(0.01).max(5.0).step(0.01);
gui.add(bloomPass, 'threshold').min(0.01).max(1.0).step(0.01);
gui.onFinishChange(() => {
    generateGeometries();
});
const tick = () => {
    material.uniforms.uFrame.value += 1;
    controls.update();
    camera.lookAt(scene.position);
    composer.render(scene, camera);
    window.requestAnimationFrame(tick);
};
tick();
document.addEventListener('keydown', (event) => {
    gui.show(gui._hidden);
});