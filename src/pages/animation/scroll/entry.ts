import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  EquirectangularReflectionMapping,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  DirectionalLight,
  MeshToonMaterial,
  ConeGeometry,
  TorusKnotGeometry,
  TorusGeometry,
  TextureLoader,
  Clock,
  Group
} from 'three'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import gradientTextureUri from '@/assets/textures/gradients/3.jpg'

import gsap from 'gsap'

export default function createScene(container: HTMLElement, canvas: HTMLCanvasElement) {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  const parameters = {
    materialColor: '#ffeded',
    meshDistance: 4,
    scrollY: 0,
    sectionIndex: 0,
    prevSectionIndex: 0,
    mouseX: 0,
    mouseY: 0,
  }

  const scene = new Scene()
  const camera = new PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    100
  )
  camera.position.set(0, 0, 6)
  const cameraGroup = new Group()
  cameraGroup.add(camera)
  scene.add(cameraGroup)

  const textureLoader = new TextureLoader()
  const gradientTexture = textureLoader.load(gradientTextureUri)
  const material = new MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
  })

  // Objects
  const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material)
  const mesh2 = new Mesh(new ConeGeometry(1, 2, 32), material)
  const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material)

  scene.add(mesh1, mesh2, mesh3)

  const sectionMeshes = [mesh1, mesh2, mesh3]
  for(let i = 0; i < sectionMeshes.length;i++) {
    sectionMeshes[i].position.y = - i * parameters.meshDistance
    sectionMeshes[i].position.x = (i%2 > 0 ? -2.5 : 2.5)
  }

  const renderer = new WebGLRenderer({
    canvas: canvas,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)

  const directionalLight = new DirectionalLight(0x00fffc, 0.5)
  directionalLight.position.set(10, 10, 10)
  scene.add(directionalLight)

  const clock = new Clock()

  function render() {
    const deltaTime = clock.getDelta()

    camera.position.y = - parameters.scrollY * parameters.meshDistance

    const parallaxX = parameters.mouseX * 0.5
    const parallaxY = - parameters.mouseY * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes) {
      mesh.rotation.x += deltaTime * 0.1
      mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  container.addEventListener("scroll", (e) => {
    // @ts-ignore
    parameters.scrollY = e.target!.scrollTop / sizes.height
    parameters.sectionIndex = Math.round(parameters.scrollY)

    if (parameters.prevSectionIndex != parameters.sectionIndex) {
      parameters.prevSectionIndex = parameters.sectionIndex

      gsap.to(
        sectionMeshes[parameters.sectionIndex].rotation,
        {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        }
    )
    }
  })

  container.addEventListener("mousemove", (e) => {
    parameters.mouseX = e.clientX / sizes.width - 0.5
    parameters.mouseY = e.clientY / sizes.height - 0.5
  })
}
