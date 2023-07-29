import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, AmbientLight, Vector2, SphereGeometry, Mesh, DirectionalLight, MeshPhongMaterial, Clock, TextureLoader, CatmullRomCurve3, Vector3, BufferGeometry, Line, LineBasicMaterial, AxesHelper  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import earthSpecularTexture from "@/assets/textures/planets/earth_specular_2048.jpg?url"
import earthNormalTexture from "@/assets/textures/planets/earth_normal_2048.jpg?url"
import earthTexture from "@/assets/textures/planets/earth_atmos_2048.jpg?url"
import moonTexture from "@/assets/textures/planets/moon_1024.jpg?url"

export default function createScene(container: HTMLElement, ) {
  const EARTH_RADIUS = 2
  const MOON_RADIUS = 0.27

  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, -10)
  scene.add(camera)

  const dirLight = new DirectionalLight(0xffffff)
  dirLight.position.set(0, 0, 4)
  scene.add(dirLight)
  const light = new AmbientLight(0xffffff, 0.5) // soft white light
  scene.add(light)

  const textureLoader = new TextureLoader()
  const earthGeometry = new SphereGeometry(EARTH_RADIUS, 20, 20)
  const earthMaterial = new MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load(earthTexture),
    specularMap: textureLoader.load(earthSpecularTexture),
    normalMap: textureLoader.load(earthNormalTexture),
    normalScale: new Vector2(0.85, 0.85),
  })
  const earthModel = new Mesh(earthGeometry, earthMaterial)
  scene.add(earthModel)

  const moonGeometry = new SphereGeometry(MOON_RADIUS, 16, 16)
  const moonMaterial = new MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load(moonTexture),
  })
  const moonModel = new Mesh(moonGeometry, moonMaterial)
  moonModel.position.set(0, 0, 3)
  scene.add(moonModel)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.toneMapping = ACESFilmicToneMapping
  container.appendChild(renderer.domElement)

  const control = new OrbitControls(camera, renderer.domElement)
  control.enableDamping = true
  control.minDistance = 5
  control.maxDistance = 100

  const axesHelper = new AxesHelper(6)
  scene.add(axesHelper)

  // 根据这一系列的点创建曲线
  const curve = new CatmullRomCurve3(
    [
      new Vector3(-10, -5, -10),
      new Vector3(-5, 5, -5),
      new Vector3(4, 4, 4),
      new Vector3(5, -5, 5),
      new Vector3(10, -5, 10),
    ],
    true
  )
  // 在曲线里，getPoints获取51个点
  const points = curve.getPoints(500)
  const geometry = new BufferGeometry().setFromPoints(points)

  const material = new LineBasicMaterial({ color: 0xff0000 })
  const curveObject = new Line(geometry, material)
  scene.add(curveObject)

  const clock = new Clock()
  function animate() {
    requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  const time = elapsed/10%1
  const point = curve.getPoint(time)
  moonModel.position.copy(point)
    renderer.render(scene, camera)
  }
  animate()
}
