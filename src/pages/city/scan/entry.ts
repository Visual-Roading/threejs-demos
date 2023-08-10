import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, Mesh, DoubleSide, MeshBasicMaterial  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import cityfModelUri from "@/assets/models/city/city.glb?url"
import { createCityMaterial } from "./material/city"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(5, 5, 5)
  scene.add(camera)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)

  function render() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  render()

  const gltfLoader = new GLTFLoader()
  gltfLoader.load(cityfModelUri, model => {
    const children = model.scene.children
    const topColor = "#aaeeff"
    const bottomColor = "#0c0e6f"
    children.forEach(item => {
      if (item instanceof Mesh) {
        // 地面
        if (item.userData.name == "Layer:topography") {
          item.material = new MeshBasicMaterial({
            side: DoubleSide,
            color: bottomColor,
          })
        } else if (item.userData.name == "Layer:buildings") {
          item.material = createCityMaterial(item, bottomColor, topColor)
        }

        scene.add(item)
      }
    })
  })
}
