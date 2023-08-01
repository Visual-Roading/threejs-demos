import { BufferGeometry, EdgesGeometry, LineBasicMaterial, LineSegments, Material } from "three";

import { gsap } from "gsap";

export class MeshLine {
  geometry: BufferGeometry
  material: Material
  line: LineSegments

  constructor(geometry: BufferGeometry) {
    this.geometry = geometry

    const edges = new EdgesGeometry(geometry)

    this.material = new LineBasicMaterial({
      color: "white"
    })

    this.line = new LineSegments(
      edges,
      this.material
    )

  }
}
