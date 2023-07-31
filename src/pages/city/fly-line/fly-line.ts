import { CatmullRomCurve3, Material, Mesh, MeshBasicMaterial, MirroredRepeatWrapping, RepeatWrapping, Texture, TextureLoader, TubeGeometry, Vector3 } from "three";

import lineTextureUri from "@/assets/textures/city/z_11.png?url"
import { gsap } from "gsap";

export class FlyLine {
  points: Vector3[]
  mesh: Mesh
  geometry: TubeGeometry
  curve: CatmullRomCurve3
  material: Material
  texture: Texture

  constructor(points: Vector3[], radius: number) {
    this.points = points
    this.curve = new CatmullRomCurve3(points)

    this.geometry = new TubeGeometry(this.curve, 64, radius, 2)
    const texture = new TextureLoader()
    this.texture = texture.load(lineTextureUri)
    this.texture.repeat.set(1, 2)
    this.texture.wrapS = RepeatWrapping
    this.texture.wrapT = MirroredRepeatWrapping

    this.material =  new MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })

    this.mesh = new Mesh(this.geometry, this.material)

    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1,
      ease: "none",
      repeat: -1,
    })
  }
}