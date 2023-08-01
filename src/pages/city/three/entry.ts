import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, Mesh, DoubleSide, MeshBasicMaterial, Vector3  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import cityfModelUri from "@/assets/models/city/city.glb?url"
import { createCityMaterial } from "../fly-line/material/city"
import { FlyLine } from "../fly-line/fly-line"
import { FlyLineShader, FlyLineShaderWithAnimation } from "../fly-line/fly-line-shader"
import { MeshLine } from "../fly-line/mesh-line"
import { LightBar } from "./light-bar"
import { Radar } from "./radar"

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

          const meshLine = new MeshLine(item.geometry)
          const scale = item.scale.x * 1.0001
          meshLine.line.scale.set(scale, scale, scale)
          scene.add(meshLine.line)
        }

        scene.add(item)
      }
    })
  })

  const flyLine = new FlyLine([
    new Vector3(-12, 0, -10),
    new Vector3(6, 6, -2),
    new Vector3(12, 0, 10),
  ], 0.4)

  const flyLineShader = new FlyLineShader([
  new Vector3(-10, 0, 0),
    new Vector3(4, 6, 2),
    new Vector3(8, 0, 8),
  ])

  const flyLineShader1 = new FlyLineShaderWithAnimation([
    new Vector3(10, 0, 0),
    new Vector3(6, 6, 12),
    new Vector3(4, 0, 8),
  ])

  const lightBar = new LightBar()
  const radar = new Radar()

  scene.add(flyLine.mesh)
  scene.add(flyLineShader.mesh)
  scene.add(flyLineShader1.mesh)
  scene.add(lightBar.mesh)
  scene.add(radar.mesh)
}
