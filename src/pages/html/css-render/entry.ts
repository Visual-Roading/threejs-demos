import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, AmbientLight, Raycaster, Vector2, SphereGeometry, Mesh, DirectionalLight, MeshPhongMaterial, Clock, TextureLoader  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { CSS2DRenderer, CSS2DObject, } from "three/examples/jsm/renderers/CSS2DRenderer.js"

import earthSpecularTexture from "@/assets/textures/planets/earth_specular_2048.jpg?url"
import earthNormalTexture from "@/assets/textures/planets/earth_normal_2048.jpg?url"
import earthTexture from "@/assets/textures/planets/earth_atmos_2048.jpg?url"
import moonTexture from "@/assets/textures/planets/moon_1024.jpg?url"

export default function createScene(container: HTMLElement, ) {
  const EARTH_RADIUS = 2;
  const MOON_RADIUS = 0.27;

  const scene = new Scene()
  const raycaster = new Raycaster()

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

  // 添加提示标签：添加html标签到ThreeJS的model上
  const earthDiv = document.createElement('div')
  earthDiv.className = "label"
  earthDiv.innerHTML = "地球"
  earthDiv.style.color = "#fff"
  const earthLabel = new CSS2DObject(earthDiv)
  // 指定标签的位置
  earthLabel.position.set(0, EARTH_RADIUS, 0)
  earthModel.add(earthLabel)

  // 中国
  const chinaDiv = document.createElement('div')
  chinaDiv.className = "label1"
  chinaDiv.innerHTML = "中国"
  chinaDiv.style.color = "#fff"
  const chinaLabel = new CSS2DObject(chinaDiv)
  chinaLabel.position.set(-(EARTH_RADIUS / 3), (EARTH_RADIUS / 2), -EARTH_RADIUS + 0.2)
  earthModel.add(chinaLabel)

  const moonDiv = document.createElement('div')
  moonDiv.className = "label"
  moonDiv.innerHTML = "月球"
  moonDiv.style.color = "#fff"
  const moonLabel = new CSS2DObject(moonDiv)
  moonLabel.position.set(0, MOON_RADIUS + 0.2, 0)
  moonModel.add(moonLabel)

  // 实例化css2d的渲染器：添加一个HTML的渲染层，尺寸等于ThreeJS画布尺寸，层级在ThreeJS画布之上
  const labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(window.innerWidth, window.innerHeight)
  container.parentElement?.insertBefore(labelRenderer.domElement, container)
  labelRenderer.domElement.style.position = 'fixed'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.left = '0px'
  labelRenderer.domElement.style.zIndex = '10'

  // 由于HTMl层级在ThreeJS画布之上，因此鼠标控制器需要改为labelRenderer的DOM元素
  const control = new OrbitControls(camera, labelRenderer.domElement)
  control.enableDamping = true
  control.minDistance = 5;
  control.maxDistance = 100;

  const clock = new Clock()
  function animate() {
    requestAnimationFrame(animate)
  
    const elapsed = clock.getElapsedTime()
  
    moonModel.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)
    const chinaPosition = chinaLabel.position.clone()
    // 计算出标签跟摄像机的距离
    const labelDistance = chinaPosition.distanceTo(camera.position)
    // 检测射线的碰撞
    // chinaLabel.position
    // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
    chinaPosition.project(camera)
    // @ts-ignore
    raycaster.setFromCamera(chinaPosition, camera)
    const intersects = raycaster.intersectObjects(scene.children,true)
    
    // 如果没有碰撞到任何物体，那么让标签显示。需手动添加CSS来控制显示与隐藏
    if(intersects.length == 0){
      chinaLabel.element.classList.add('visible')
    }else{
      const minDistance = intersects[0].distance
      if(minDistance<labelDistance){
        chinaLabel.element.classList.remove('visible')
      }else{
        chinaLabel.element.classList.add('visible')
      }
      
    }
    
  
    // 标签渲染器渲染
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
  }
  animate()
}
