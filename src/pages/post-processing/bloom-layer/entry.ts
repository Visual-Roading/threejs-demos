import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  TorusKnotGeometry,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry,
  SphereGeometry,
  Vector2,
} from 'three'
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import bgUri from '@/assets/hdrs/Dosch-Space_0026_4k.hdr?url'

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 20)
  scene.add(camera)
  //   更新摄像机的投影矩阵
// camera.updateProjectionMatrix();

  const hdrLoader = new RGBELoader()
  hdrLoader.loadAsync(bgUri).then((texture) => {
    texture.mapping = EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 禁止每次渲染时的自动清除
  renderer.autoClear = false

  const material = new MeshBasicMaterial({ color: 'lightgreen' })

  const boxGeometry = new BoxGeometry(2, 2, 2, 60, 60, 60)
  const boxMesh = new Mesh(boxGeometry, material)
  boxMesh.position.set(-10, 0, 0)
  scene.add(boxMesh)

  const torusKnotGeometry = new TorusKnotGeometry(2, 0.5, 120, 10)
  const torusKnotMesh = new Mesh(torusKnotGeometry, material)
  scene.add(torusKnotMesh)
  torusKnotMesh.layers.set(1)

  const sphereGeometry = new SphereGeometry(2, 60, 60)
  const sphereMesh = new Mesh(sphereGeometry, material)
  sphereMesh.position.set(10, 0, 0)
  scene.add(sphereMesh)

  const composer = new EffectComposer(renderer)
  composer.setPixelRatio(window.devicePixelRatio)
  composer.setSize(window.innerWidth, window.innerHeight)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  const effect = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight),
    0,
    10,
    1
  )
  effect.threshold = 0
  effect.strength = 3
  effect.radius = 0.5
  composer.addPass(effect)

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  function render() {
    renderer.clear()
    controls.update()

    // 渲染第一层
    camera.layers.set(0)
    composer.render()
    renderer.clearDepth()
    // 渲染第二层
    camera.layers.set(1)
    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  render()

  const cubeLayMap = {
    activeLayer: 0
  }
  window.addEventListener('click', () => {
    if (cubeLayMap.activeLayer == 0) {
      boxMesh.layers.set(1)
      sphereMesh.layers.set(1)
      cubeLayMap.activeLayer = 1
    } else {
      boxMesh.layers.set(0)
      sphereMesh.layers.set(0)
      cubeLayMap.activeLayer = 0
    }
  })
  
}
