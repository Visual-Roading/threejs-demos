import { Scene, PerspectiveCamera, WebGLRenderer, EquirectangularRefractionMapping, ACESFilmicToneMapping, SRGBColorSpace, TextureLoader  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Water } from 'three/addons/objects/Water2.js';

import envTexture from "@/assets/hdrs/beath.hdr?url"
import gltfModel from "@/assets/models/bathhub.glb?url"

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

  const controls = new OrbitControls(camera, renderer.domElement);

  function render() {
    controls.update();
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
  gltfLoader.load(gltfModel, model => {
    const bathhub = model.scenes[0].children[0]
    const waterPlane = model.scenes[0].children[1].geometry

    const textureLoader = new TextureLoader();
    const flowMap = textureLoader.load("shaders/textures/water/Water_1_M_Flow.jpg");

    const water = new Water( waterPlane, {
      scale: 2,
      textureWidth: 1024,
      textureHeight: 1024,
      flowMap: flowMap
    } );


    scene.add(bathhub)
    scene.add(water)
  })
}
