import { AdditiveBlending, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, Material, Points, ShaderMaterial, Vector3 } from "three";

import fragmentShader from "./shaders/flyLine/fragment.glsl?raw"
import vertexShader from "./shaders/flyLine/vertex.glsl?raw"
import aniFragmentShader from "./shaders/flyLineAni/fragment.glsl?raw"
import aniVertexShader from "./shaders/flyLineAni/vertex.glsl?raw"
import { gsap } from "gsap";

export class FlyLineShader {
  points: Vector3[]
  mesh: Points
  geometry: BufferGeometry
  curve: CatmullRomCurve3
  material: Material

  constructor(points: Vector3[]) {
    this.points = points
    this.curve = new CatmullRomCurve3(points)

    const curvePoints = this.curve.getPoints(500)
    const curveArr = new Float32Array(curvePoints.length)
    curvePoints.forEach((_, i) => {
      curveArr[i] = i
    })

    this.geometry = new BufferGeometry()
    this.geometry.setFromPoints(curvePoints)
    this.geometry.setAttribute("aIndex", new BufferAttribute(curveArr, 1))

    this.material =  new ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    this.mesh = new Points(this.geometry, this.material)
  }
}

export class FlyLineShaderWithAnimation {
  points: Vector3[]
  mesh: Points
  geometry: BufferGeometry
  curve: CatmullRomCurve3
  material: ShaderMaterial

  constructor(points: Vector3[]) {
    this.points = points
    this.curve = new CatmullRomCurve3(points)

    const curvePoints = this.curve.getPoints(500)
    const curveArr = new Float32Array(curvePoints.length)
    curvePoints.forEach((_, i) => {
      curveArr[i] = i
    })

    this.geometry = new BufferGeometry()
    this.geometry.setFromPoints(curvePoints)
    this.geometry.setAttribute("aIndex", new BufferAttribute(curveArr, 1))

    this.material =  new ShaderMaterial({
      fragmentShader: aniFragmentShader,
      vertexShader: aniVertexShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uColor: {
          value: new Color("yellow"),
        },
        uTime: {
          value: 0,
        },
        uLength: {
          value: curvePoints.length
        }
      }
    })

    this.mesh = new Points(this.geometry, this.material)

    gsap.to(this.material.uniforms.uTime, {
      value: curvePoints.length,
      duration: 3,
      ease: "none",
      repeat: -1,
    })
  }
}