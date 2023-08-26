import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, EquirectangularReflectionMapping, BoxGeometry, Mesh, MeshStandardMaterial  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import gsap from "gsap"

import bgHDRUri from "@/assets/hdrs/city2.hdr?url"

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

  // 创建立方体
  const cubeGeometry = new BoxGeometry(2, 2, 2)
  const cubeGeometry1 = new BoxGeometry(2, 6, 2)
  const cubeGeometry2 = new BoxGeometry(6, 6, 6)
  const cubeMaterial = new MeshStandardMaterial({
    color: 0xff0000
  })

  const mesh = new Mesh(cubeGeometry, cubeMaterial)
  scene.add(mesh)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const rgbeLoader = new RGBELoader()
  rgbeLoader.loadAsync(bgHDRUri).then((texture) => {
    scene.background = texture
    scene.environment = texture
    scene.environment!.mapping = EquirectangularReflectionMapping

    startAnimation()
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const axesHelper = new AxesHelper(5)
  scene.add(axesHelper)

  function render() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  render()

  function startAnimation() {
    const gsapDestMap = {
      phase1: 0,
      phase2: 0
    }
  
    cubeGeometry.morphAttributes.position = [
      cubeGeometry1.attributes.position
    ]
    mesh.morphTargetInfluences = [0]
    mesh.updateMorphTargets()
    gsap.to(gsapDestMap, {
      phase1: 1,
      duration: 3,
      onUpdate() {
        // @ts-ignore
        mesh.morphTargetInfluences[0] = gsapDestMap.phase1
      },
      onComplete() {
        // @ts-ignore
        mesh.morphTargetInfluences[0] = 1

        cubeGeometry.morphAttributes.position.push(cubeGeometry2.attributes.position)
        mesh.morphTargetInfluences?.push(0)
        // updateMorphTargets有可能会导致动画继续从cubeGeometry开始运行
        // mesh.updateMorphTargets()

        gsap.to(gsapDestMap, {
          phase2: 1,
          duration: 3,
          onUpdate() {
            // @ts-ignore
            mesh.morphTargetInfluences[1] = gsapDestMap.phase2
          },
        })
      }
    })
  }
}
