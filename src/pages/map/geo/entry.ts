import { Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, Object3D, Shape, LineBasicMaterial, Line, Vector3, BufferGeometry, ExtrudeGeometry, MeshBasicMaterial, Mesh, AmbientLight, Raycaster, Vector2  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { geoMercator } from "d3-geo"

import chinaJson from "@/assets/china.json"

export default function createScene(container: HTMLElement, provinceContainer: HTMLElement) {
  const areaColor = 0x02A1E2
  const areaActiveColor = 0xff0000
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 70)
  scene.add(camera)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.toneMapping = ACESFilmicToneMapping
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const ambientLight = new AmbientLight(0xffffff); // 环境光
  scene.add(ambientLight);

  // @ts-ignore
  const map = createMap(chinaJson, { areaTransparent: true, areaColor, })
  scene.add(map)

  const raycaster = new Raycaster()
  const mouse = new Vector2()
  let activeInstersect = []; // 鼠标与地图相交的省份列表

  function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    provinceContainer.style.left = event.clientX + 2 + 'px'
    provinceContainer.style.top = event.clientY + 2 + 'px'

    // 检测鼠标是否舆地图重合
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    // 将原来相交的省份颜色置为正常
    if (activeInstersect && activeInstersect.length) {
      activeInstersect.forEach(element => {
        // @ts-ignore
        element.object.material[0].color.set(areaColor);
        // @ts-ignore
        element.object.material[1].color.set(areaColor);
      })
    }
    // 检测鼠标与省份相交的元素
    activeInstersect = []
    for(let i = 0; i < intersects.length; i++) {
      // @ts-ignore
      if (intersects[i].object.material && intersects[i].object.material.length === 2) {
        // @ts-ignore
        activeInstersect.push(intersects[i]);
        // @ts-ignore
        intersects[i].object.material[0].color.set(areaActiveColor);
        // @ts-ignore
        intersects[i].object.material[1].color.set(areaActiveColor);
        break; // 只取第一个
      }
    }

    createProvinceInfo(provinceContainer, activeInstersect)
  }

  window.addEventListener("mousemove", onMouseMove, false)

  function render() {
    requestAnimationFrame(render)

    renderer.render(scene, camera)
    controls.update()
  }
  
  render();
}

// @ts-ignore
function createMap(geoJson: any, options?: {
  center?: [number, number],
  scale?: number,
  boundaryColor?: string,
  areaColor?: string | number
  depth?: number
} = {}) {
  const { 
    center = [104.0, 37.5], 
    scale = 80, 
    boundaryColor = "#fff", 
    depth = 4,
    areaColor = "#02A1E2",
  } = options

  // 建一个空对象存放对象
  const map = new Object3D()
  
  const projection = geoMercator().center(center).scale(scale).translate([0, 0])

  geoJson.features.forEach(elem => {
    // 定一个省份3D对象
    const province = new Object3D()
    // 每个的 坐标 数组
    const coordinates = elem.geometry.coordinates

    coordinates.forEach(multiPolygon => {
      multiPolygon.forEach(polygon => {
        const shape = new Shape()
        const lineMaterial = new LineBasicMaterial({
          color: boundaryColor
        })
        const lineGeometry = new BufferGeometry()
        const pointPositions: Vector3[] = []
  
        for (let i = 0; i < polygon.length; i++) {
          const [x, y] = projection(polygon[i])
          if (i === 0) {
            shape.moveTo(x, -y)
          }
          shape.lineTo(x, -y)
          pointPositions.push(new Vector3(x, -y, depth))
        }
        lineGeometry.setFromPoints(pointPositions)
        const line = new Line(lineGeometry, lineMaterial)
        province.add(line)
  
        const gemoetry = new ExtrudeGeometry(shape, {
          depth: 4,
          bevelEnabled: true,
        })
        const surfaceMaterial = new MeshBasicMaterial({
          color: areaColor,
          transparent: true,  // 必须要透明才能看见省份的边缘线
          opacity: 0.5,
        })
        const bottomMaterial = surfaceMaterial.clone()
        bottomMaterial.opacity -= 0.1

        const mesh = new Mesh(gemoetry, [surfaceMaterial, bottomMaterial])
        province.add(mesh)
      })
    })

    // 将geo的属性放到省份模型中
    // @ts-ignore
    province.properties = elem.properties
    if (elem.properties.contorid) {
      // @ts-ignore
      const [x, y] = projection(elem.properties.contorid);
      // @ts-ignore
      province.properties._centroid = [x, y]
    }

    map.add(province)
  })

  return map
}

// 显示省份的信息 
function createProvinceInfo(provinceEl: HTMLElement, activeInstersect) {    
  if (activeInstersect.length !== 0 && activeInstersect[0].object.parent.properties.name) {
    var properties = activeInstersect[0].object.parent.properties;
    provinceEl.textContent = properties.name;
    provinceEl.style.visibility = 'visible';
  } else {
    provinceEl.style.visibility = 'hidden';
  }
}