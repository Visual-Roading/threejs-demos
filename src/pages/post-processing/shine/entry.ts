import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, EquirectangularReflectionMapping, TorusKnotGeometry, MeshBasicMaterial, Mesh, BoxGeometry, SphereGeometry, Vector2,  } from "three"
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

import bgUri from "@/assets/hdrs/Dosch-Space_0026_4k.hdr?url"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";


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

  const hdrLoader = new RGBELoader()
  hdrLoader.loadAsync(bgUri).then(texture => {
    texture.mapping = EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })

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

  const material = new MeshBasicMaterial({ color: "lightgreen" })
  
  const torusKnotGeometry = new TorusKnotGeometry(2, 0.5, 120, 10)
  const torusKnotMesh = new Mesh(torusKnotGeometry, material)
  scene.add(torusKnotMesh)

  const boxGeometry = new BoxGeometry(2, 2, 2, 60, 60, 60)
  const boxMesh = new Mesh(boxGeometry, material)
  boxMesh.position.set(-10, 0, 0)
  scene.add(boxMesh)

  const sphereGeometry = new SphereGeometry(2, 60, 60)
  const sphereMesh = new Mesh(sphereGeometry, material)
  sphereMesh.position.set(10, 0, 0)
  scene.add(sphereMesh)

  const outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
    [boxMesh, sphereMesh]
  )
  outlinePass.edgeStrength = 10
  outlinePass.edgeGlow = 0.3
  outlinePass.edgeThickness = 6
  outlinePass.visibleEdgeColor.set("#fff")
  outlinePass.visibleEdgeColor.set("#fff")
  composer.addPass(outlinePass)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  function render() {
    composer.render()
    // renderer.render(scene, camera)

    controls.update();
    requestAnimationFrame(render);
  }
  
  render();
}

