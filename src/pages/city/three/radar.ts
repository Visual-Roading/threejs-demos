import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, } from "three";

import fragmentShader from "./shaders/radar/fragment.glsl?raw"
import vertexShader from "./shaders/radar/vertex.glsl?raw"
import { gsap } from "gsap";

export class Radar {
  mesh: Mesh
  geometry: PlaneGeometry
  material: ShaderMaterial

  constructor() {
    this.geometry = new PlaneGeometry(3, 3, 10, 10)

    this.material =  new ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      side: DoubleSide,
      uniforms: {
        uColor: {
          value: new Color("red")
        },
        uTime: {
          value: 0
        }
      },
    })

    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.set(Math.PI / 2, 0, 0)
    this.mesh.position.set(6, 2, 6)
    

    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 2,
      ease: "none",
      repeat: -1,
    })
  }
}