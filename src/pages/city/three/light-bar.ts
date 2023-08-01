import { AdditiveBlending, CylinderGeometry, DoubleSide, Mesh, ShaderMaterial, } from "three";

import fragmentShader from "./shaders/light-bar/fragment.glsl?raw"
import vertexShader from "./shaders/light-bar/vertex.glsl?raw"
import { gsap } from "gsap";

export class LightBar {
  mesh: Mesh
  geometry: CylinderGeometry
  material: ShaderMaterial

  constructor() {
    this.geometry = new CylinderGeometry(2, 2, 3, 30, 30, true)

    this.material =  new ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })
    

    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.geometry.computeBoundingBox()
    this.mesh.position.set(0, 1.7, 0)
    const { min, max } = this.mesh.geometry.boundingBox!

    this.material.uniforms.uHeight = {
      value: max.y - min.y
    }

    gsap.to(this.mesh.scale, {
      x: 6,
      z: 6,
      duration: 3,
      ease: "none",
      repeat: -1,
      yoyo: true,
    })
  }
}