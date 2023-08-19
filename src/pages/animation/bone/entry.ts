import { PlaneGeometry,  Mesh, Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, DoubleSide, ShaderMaterial, EquirectangularReflectionMapping, AnimationMixer, Clock  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

import modelUri from "@/assets/models/animations/bone.glb?url"
import bgHDRUri from "@/assets/hdrs/city2.hdr?url"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()
  let mixer: AnimationMixer

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 10)
  scene.add(camera)

  const rgbeLoader = new RGBELoader()
  rgbeLoader.loadAsync(bgHDRUri).then((texture) => {
    scene.background = texture
    scene.environment = texture
    scene.environment!.mapping = EquirectangularReflectionMapping
  })

  const modelLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../../../../node_modules/three/examples/jsm/libs/draco/')
  dracoLoader.preload()
  modelLoader.setDRACOLoader(dracoLoader)
  modelLoader.load(modelUri, (model) => {
    scene.add(model.scene)
    mixer = new AnimationMixer(model.scene)
    const action = mixer.clipAction(model.animations[0])
    action.play()
  })


  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const axesHelper = new AxesHelper(5)
  scene.add(axesHelper)
  const clock = new Clock()

  function render() {
    controls.update()
    renderer.render(scene, camera)
    mixer?.update(clock.getDelta())
    requestAnimationFrame(render)
  }
  
  render()
}
