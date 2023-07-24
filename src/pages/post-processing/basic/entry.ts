import { Scene, PerspectiveCamera, WebGLRenderer, CubeTextureLoader, ACESFilmicToneMapping  } from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'

import gltfModelUrl from "@/assets/models/DamagedHelmet/DamagedHelmet.gltf?url"

import envNX from "@/assets/environmentMaps/0/nx.jpg?url"
import envNY from "@/assets/environmentMaps/0/ny.jpg?url"
import envNZ from "@/assets/environmentMaps/0/nz.jpg?url"
import envPX from "@/assets/environmentMaps/0/px.jpg?url"
import envPY from "@/assets/environmentMaps/0/py.jpg?url"
import envPZ from "@/assets/environmentMaps/0/pz.jpg?url"


export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 3)
  scene.add(camera)

  const cubeTextureLoader = new CubeTextureLoader()
  const envMapTexture = cubeTextureLoader.load([envPX, envNX, envPY, envNY, envPZ, envNZ])
  scene.environment = envMapTexture
  scene.background = envMapTexture

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.toneMapping = ACESFilmicToneMapping
  container.appendChild(renderer.domElement)

  const composer = new EffectComposer(renderer)
  composer.setPixelRatio(window.devicePixelRatio)
  composer.setSize(window.innerWidth,window.innerHeight)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const dotScreenPass = new DotScreenPass()
  // dotScreenPass.enabled = true
  composer.addPass(dotScreenPass)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  function render() {
    composer.render()

    controls.update();
    requestAnimationFrame(render);
  }
  
  render();

  const gltfLoader = new GLTFLoader()
  gltfLoader.load(gltfModelUrl, (model) => {
    const validModel = model.scene.children[0]

    scene.add(validModel)
  })
}
