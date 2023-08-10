import { GeoProjection, geoMercator } from "d3-geo"

import { Scene, Camera, PerspectiveCamera, DirectionalLight, WebGLRenderer, AxesHelper, Object3D, Shape, LineBasicMaterial, Line, Vector3, BufferGeometry, ExtrudeGeometry, MeshBasicMaterial, Mesh, Raycaster, Vector2, Group, DoubleSide, Event, CircleGeometry, LineLoop, QuadraticBezierCurve3, PlaneGeometry, AdditiveBlending, Color, BufferAttribute, TextureLoader, Texture } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import img1 from "@/assets/images/map/lightray.jpg?url"
import img2 from "@/assets/images/map/lightray_yellow.jpg?url"

export default class GeoMap {
  container: HTMLElement
  scene?: Scene
  camera?: Camera
  controller?: OrbitControls
  renderer?: WebGLRenderer
  projection?: GeoProjection
  group?: Group
  sixLineGroup?: Group
  flyGroup?: Group
  raycaster?: Raycaster
  mouse?: Vector2
  meshes?: Object3D<Event>[]
  clickFunction?: CallableFunction
  areaColor?: number | string

  textures = [new TextureLoader().load(img1), new TextureLoader().load(img2)]
  provinceLngLat: Record<string, [number, number]> = {}
  mapHeight = 4
  pointsLength = 20
  pointsColorIndex = 0

  constructor(container: HTMLElement) {
    this.container = container

    this.init()
  }

  init() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    this.setCamera({ x: 0, y: 0, z: 70 })
    this.setLight()
    this.setAxisHelper()
    this.setRender()
    this.setController()

    this.render()

    this.container.addEventListener("click", this.mouseEvent.bind(this))
  }

  /**
   * @desc 设置控制器
   */
  setController() {
    const controller = new OrbitControls(this.camera, this.renderer!.domElement)
    controller.enableDamping = true

    this.controller = controller
  }

  /**
   * @desc 相机
   */
  setCamera(set: { x: number, y: number, z: number }) {
    const { x, y, z } = set
    this.camera!.position.set(x, y, z)
  }

  /**
   * @desc 设置光线
   */
  setLight() {
    const directionalLight = new DirectionalLight(0xffffff, 0.5)
    this.scene!.add(directionalLight)
  }

  /**
   * @desc 设置渲染器
   */
  setRender() {
    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer = renderer

    this.container.appendChild(renderer.domElement)
  }

  /**
   * @desc 设置参考线
   */
  setAxisHelper() {
    const axesHelper = new AxesHelper(5)
    this.scene!.add(axesHelper)
  }

  render() {
    requestAnimationFrame(this.render.bind(this))

    this.controller!.update()
    this.renderer!.render(this.scene!, this.camera!)

    this.doAnimate()
  }

  /**
   * 创建geo地图
   * @param geoJson geo地图数据
   * @param options 选项
   */
  // @ts-ignore
  createMap(geoJson: any, options?: {
    boundaryColor?: string,
    areaColor?: string | number
    depth?: number
  } = {}) {
    const { 
      boundaryColor = "#ccc", 
      depth = 4,
      areaColor = "#006de0",
    } = options
    this.areaColor = areaColor
    this.mapHeight = depth
  
    // 把经纬度转换成x,y,z 坐标
    geoJson.features.forEach(d => {
      d.vector3 = []
      this.provinceLngLat[d.properties.name] = d.properties.center
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = []
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = []
            c.forEach(cinner => {
              let cp = this.lngLat2Mercator(cinner)
              d.vector3[i][j].push(cp)
            })
          } else {
            let cp = this.lngLat2Mercator(c)
            d.vector3[i].push(cp)
          }
        })
      })
    })

    // 绘制地图模型
    const group = new Group()
    const lineGroup = new Group()
    geoJson.features.forEach(d => {
      const g = new Group() // 用于存放每个地图模块。||省份
      // @ts-ignore
      g.data = d
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p, areaColor, depth)
            const lineMesh = this.drawLine(p, boundaryColor)
            lineGroup.add(lineMesh)
            g.add(mesh)
          })
        } else {
          // 单个面
          const mesh = this.drawModel(points, areaColor, depth)
          const lineMesh = this.drawLine(points, boundaryColor)
          lineGroup.add(lineMesh)
          g.add(mesh)
        }
      })
      group.add(g)
    })
    this.group = group // 丢到全局去
    const lineGroupBottom = lineGroup.clone()
    lineGroupBottom.position.z = depth
    this.scene!.add(lineGroup)
    this.scene!.add(lineGroupBottom)
    this.scene!.add(group)
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lngLat2Mercator(lngLat: [number, number]) {
    if (!this.projection) {
      this.projection = geoMercator()
        .center([104.0, 37.5])
        .scale(80)
        .translate([0, 0])
    }

    const [x, y] = this.projection([...lngLat])
    const z = this.mapHeight

    return [x, -y, z]
  }

  /**
   * @desc 绘制线条
   * @param {} points
   */
  drawLine(points, color: string | number) {
    const material = new LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7
    })
    const geometry = new BufferGeometry()
    const positions: Vector3[] = []
    points.forEach(d => {
      // @ts-ignore
      const [x, y, z] = d
      positions.push(new Vector3(x, y, 0))
    })
    geometry.setFromPoints(positions)
    const line = new Line(geometry, material)
    return line
  }

  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points, color: string | number, depth: number) {
    const shape = new Shape()
    points.forEach((d, i) => {
      const [x, y] = d
      if (i === 0) {
        shape.moveTo(x, y)
      } else if (i === points.length - 1) {
        shape.quadraticCurveTo(x, y, x, y)
      } else {
        shape.lineTo(x, y)
      }
    })

    const geometry = new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false
    })
    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      // side: DoubleSide
    })
    const mesh = new Mesh(geometry, material)
    return mesh
  }

  /**
   * @desc 鼠标事件处理
   */
  mouseEvent(event) {
    if (!this.raycaster) {
      this.raycaster = new Raycaster()
    }
    if (!this.mouse) {
      this.mouse = new Vector2()
    }
    if (!this.meshes) {
      this.meshes = []
      this.group!.children.forEach(g => {
        g.children.forEach(mesh => {
          this.meshes!.push(mesh)
        })
      })
    }

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    // 通过摄像机和鼠标位置更新射线
    this.raycaster.setFromCamera(this.mouse!, this.camera!)

    // 计算物体和射线的焦点
    const intersects = this.raycaster.intersectObjects(this.meshes)
    if (intersects.length > 0) {
      this.clickFunction!(event, intersects[0].object.parent)
    }
  }

  /**
   * @desc 绘制光柱
   */
  drawLightBar(data, colors: Array<number | string>) {
    const group = new Group()
    const sixLineGroup = new Group()
    data.forEach((d, i) => {
      const lngLat = this.provinceLngLat[d.name]
      const [x, y, z] = this.lngLat2Mercator(lngLat)
      const color = colors[i % colors.length]

      // 绘制六边体
      group.add(this.drawSixMesh(x, y, z, color))
      // 绘制6边线
      sixLineGroup.add(this.drawSixLineLoop(x, y, z, color))

      // 绘制柱子
      const [plane1, plane2] = this.drawPlane(x, y, z, d.value, colors[i%2] , this.textures[i%2])
      group.add(plane2)
      group.add(plane1)
    })

    this.sixLineGroup = sixLineGroup
    this.scene!.add(group)
    this.scene!.add(sixLineGroup)
  }

  /**
   * @desc 绘制飞线
   */
  drawFlyLine(data) {
    const group = new Group()
    data.forEach(d => {
      const slnglat = this.provinceLngLat[d.source.name]
      const tlnglat = this.provinceLngLat[d.target.name]
      const z = 10
      const [x1, y1, z1] = this.lngLat2Mercator(slnglat)
      const [x2, y2, z2] = this.lngLat2Mercator(tlnglat)
      const curve = new QuadraticBezierCurve3(
        new Vector3(x1, y1, z1),
        new Vector3((x1 + x2) / 2, (y1 + y2) / 2, z),
        new Vector3(x2, y2, z2)
      )
      const points = curve.getPoints(this.pointsLength)
      const geometry = new BufferGeometry()
      const color = new Color("#003670")
      const colors = new Float32Array(points.length * 3).fill(0).map((_, index) => {
        const i = index % 3
        switch(i) {
          case 0:
            return color.r
          case 1:
            return color.g
          default:
            return color.b
        }
      })
      const colorAttributes = new BufferAttribute(colors, 3)
      colorAttributes.needsUpdate = true

      geometry.setFromPoints(points)
      geometry.setAttribute("color", colorAttributes)
      const material = new LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        side: DoubleSide,
        // color: color
      })
      const mesh = new Line(geometry, material)
      group.add(mesh)
    })
    this.flyGroup = group
    this.scene!.add(group)
  }

  /**
   * @desc 柱子
   */
  drawPlane(x, y, z, value, color: number | string, texture: Texture) {
    const hei = value / 10
    const geometry = new PlaneGeometry(1, hei)
    const material = new MeshBasicMaterial({
      map: texture,
      depthTest: false,
      transparent: true,
      color: color,
      side: DoubleSide,
      blending: AdditiveBlending
    })
    const plane = new Mesh(geometry, material)
    plane.position.set(x, y, z + hei / 2)
    plane.rotation.x = Math.PI / 2
    plane.rotation.z = Math.PI
    const plane2 = plane.clone()
    plane2.rotation.y = Math.PI / 2
    return [plane, plane2]
  }

  /**
   * @desc 绘制6边形
   */
  drawSixMesh(x: number, y: number, z: number, color: number | string, size = 6) {
    const geometry = new CircleGeometry(0.5, size)
    const material = new MeshBasicMaterial({ color: color, wireframe: false, })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z + 0.1)
    return mesh
  }

  /**
   * @desc 绘制6边线
   */
  drawSixLineLoop(x: number, y: number, z: number, color: number | string,) {
    // 绘制六边型
    const geometry = new CircleGeometry(0.7, 6)
    const material = new MeshBasicMaterial({ color: color, transparent: true })
    const line = new LineLoop(geometry, material)
    line.position.set(x, y, z + 0.1)
    return line
  }

  /**
   * @desc 节流，防抖
   */
  doAnimate = throttle(() => {
    let ratio = this.pointsColorIndex / this.pointsLength

    if (this.flyGroup) {
      this.flyGroup.children.forEach(d => {
        // @ts-ignore
        const colorAttribute = d.geometry.getAttribute("color")

        let colors = new Float32Array(this.pointsLength * 3)
        for(let i = 0; i <this.pointsLength; i++ ) {
          let color = new Color(i == this.pointsColorIndex ? "#00f3ff" : "#003670") 
          colors[i * 3 + 0] = color.r
          colors[i * 3 + 1] = color.g
          colors[i * 3 + 2] = color.b
        }
        colorAttribute.array = colors
        colorAttribute.needsUpdate = true
      })
    } 

    if (this.sixLineGroup) {
      this.sixLineGroup.children.forEach(d => {
        d.scale.set(1 + ratio, 1 + ratio, d.scale.z)
        // @ts-ignore
        d.material.opacity = 1 - ratio
      })
    }

    this.pointsColorIndex++
    if (this.pointsColorIndex > this.pointsLength - 1) {
      this.pointsColorIndex = 0
    }
  }, 30)

  /**
   * @desc 设置区域颜色
   */
  setAreaColor(g, color = '#ff0') {
    // 恢复颜色
    g.parent.children.forEach(gs => {
      gs.children.forEach(mesh => {
        mesh.material.color.set(this.areaColor!)
      })
    })

    // 设置颜色
    g.children.forEach(mesh => {
      mesh.material.color.set(color)
    })
  }

  /**
   * @desc 绑定事件
   */
  on(eventName, func) {
    if (eventName === 'click') {
      this.clickFunction = func
    }
  }
}

function throttle(fn: Function, wait: number = 300) {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};