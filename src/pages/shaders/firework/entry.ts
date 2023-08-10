import { Scene, PerspectiveCamera, WebGLRenderer, EquirectangularRefractionMapping, ACESFilmicToneMapping, SRGBColorSpace  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import Firework, { FireworkPosition } from "./firework"

import envTexture from "@/assets/hdrs/light.hdr?url"
import houseModel from "@/assets/models/house.glb?url"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(30, 30, 30)
  scene.add(camera)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMappingExposure = 0.2;

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  const fireworks: Firework[] = []

  function render() {
    controls.update();

    fireworks.forEach((item, i) => {
      const type = item.update()
      if (type == "removed") {
        fireworks.splice(i, 1)
      }
    })


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  render();

  // 加载贴图
  const rgbeLoader = new RGBELoader()
  rgbeLoader.loadAsync(envTexture).then(texture => {
    texture.mapping = EquirectangularRefractionMapping
    scene.background = texture
    scene.environment = texture
  })

  const gltfLoader = new GLTFLoader()
  gltfLoader.load(houseModel, model => {
      scene.add(model.scene)
    }
  )


  // 设置创建烟花函数
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`
  const from = new FireworkPosition(0, 0, 0,)
  const to = new FireworkPosition(
    (Math.random() - 0.5) * 20 + 10, 
    (Math.random() - 0.5) * 20 + 10, 
    Math.random() * 15 + 10,
  )

  // 随机生成颜色和烟花放的位置
  const firework = new Firework(color, from, to, );
  firework.add2Scene(scene, camera);
  fireworks.push(firework);
};
// 监听点击事件
window.addEventListener("click", createFireworks);
}
