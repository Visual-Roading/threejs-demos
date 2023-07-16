import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, DoubleSide, ShaderMaterial, EquirectangularRefractionMapping, ACESFilmicToneMapping, SRGBColorSpace  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import gsap from "gsap"

import envTexture from "@/assets/hdrs/light.hdr?url"
import lightModel from "@/assets/models/light.glb?url"
import fragmentShader from "./fragment.glsl?raw"
import vertexShader from "./vertex.glsl?raw"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 10)
  scene.add(camera)

  const shaderMaterial = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
  })

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMappingExposure = 0.2;

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.6

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
  gltfLoader.load(lightModel, model => {
    const lightBox = model.scene.children[0]
    lightBox.material = shaderMaterial

    for (let i = 0; i < 150; i++) {
      const lightScene = model.scene.clone()
      const x = Math.random() * 300 - 150
      const y = Math.random() * 25 + 10
      const z = Math.random() * 300 - 150

      lightScene.position.set(x, y, z)

      gsap.to(lightScene.position, {
        x: "+=" + Math.random() * 5,
        y: "+=" + Math.random() * 15,
        yoyo: true,
        duration: 5 + Math.random() * 10,
        repeat: -1
      })
      gsap.to(lightScene.rotation, {
        y: 2 * Math.PI,
        duration: 10 + Math.random() * 30,
        repeat: -1
      })

      scene.add(lightScene)
    }
  })
}
