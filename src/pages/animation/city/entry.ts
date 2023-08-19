import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, Mesh, DoubleSide, MeshBasicMaterial, EquirectangularReflectionMapping, AnimationClip, AnimationMixer, Clock, Vector3, CatmullRomCurve3 } from "three"
import gsap from "gsap"

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

import cityModelUri from "@/assets/models/animations/city.glb?url"
import bgHDRUri from "@/assets/hdrs/city2.hdr?url"
import CameraModule from "./camera"



export default function createScene(container: HTMLElement) {
  const scene = new Scene()
  let animationMixer: AnimationMixer
  let carModel: Mesh
  let carTraceLine: CatmullRomCurve3

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  const cameraModule = new CameraModule(camera)
  camera.position.set(1500, 1500, 1500)
  scene.add(cameraModule.activeCamera)

  const renderer = new WebGLRenderer({
    logarithmicDepthBuffer: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMappingExposure = 0.7

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(cameraModule.activeCamera, renderer.domElement)
  const clock = new Clock()

  const rgbeLoader = new RGBELoader()
  rgbeLoader.loadAsync(bgHDRUri).then((texture) => {
    scene.background = texture
    scene.environment = texture
    scene.environment!.mapping = EquirectangularReflectionMapping
  })

  function render() {
    const deltaTime = clock.getDelta()
    controls.update()
    renderer.render(scene, cameraModule.activeCamera)
    animationMixer?.update(deltaTime)

    requestAnimationFrame(render)
  }
  
  render()

  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('node_modules/three/examples/jsm/libs/draco/')
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load(cityModelUri, model => {
    scene.add(model.scene)
    let hotAirBalloonModel

    model.scene.traverse(item => {
      if (item.name == "热气球") {
        hotAirBalloonModel = item
      }

      if (item.name == "汽车园区轨迹") {
        item.visible = false

        const points: Vector3[] = []
        for(let i = item.geometry.attributes.position.count - 1;i>=0;i--) {
          points.push(new Vector3(
            item.geometry.attributes.position.getX(i),
            item.geometry.attributes.position.getY(i),
            item.geometry.attributes.position.getZ(i),
          ))
        }

        carTraceLine = new CatmullRomCurve3(points)
      }

      if (item.name == "redcar") {
        carModel = item
      }

      playCarAnimation(carModel, carTraceLine)

    })

    model.cameras.forEach(camera => {
      cameraModule.add(camera.name, camera)
    })

    const animationClip: AnimationClip = model.animations[1]
    animationMixer = new AnimationMixer(hotAirBalloonModel)
    const action = animationMixer.clipAction(animationClip)
    action.play()
  })

  return {
    cameraModule
  }
}

function playCarAnimation(carModel: Mesh, carTrace: CatmullRomCurve3) {
  if (!carModel || !carTrace) return
  const gsapDest = {
    curveProgress: 0,
  }

 gsap.to(gsapDest, {
  curveProgress: 0.999,
  duration: 20,
  repeat: -1,
  onUpdate() {
    let point = carTrace.getPoint(gsapDest.curveProgress)
    carModel.position.set(point.x, point.y, point.z)

    // 未到达终点前，调整car的朝向
    if (gsapDest.curveProgress < 0.999) {
      point = carTrace.getPoint(gsapDest.curveProgress + 0.001)
      carModel.lookAt(point)
    }
  }
 })
}
