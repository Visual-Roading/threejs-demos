import { Color, Mesh, MeshBasicMaterial, Shader, Vector3 } from "three";

export function createCityMaterial(mesh: Mesh, bottomColor: string, topColor: string) {
  const material = new MeshBasicMaterial({
    color: bottomColor,
  })

  const { min, max }: { min: Vector3, max: Vector3 } = mesh.geometry.boundingBox
  const meshHeight = max.y - min.y

  material.onBeforeCompile = (shader, render) => {
    createGradColor(shader, topColor, meshHeight)
  }

  return material
}

export function createGradColor(shader: Shader, topColor: string, meshHeight: number) {
  shader.uniforms.uHeight = {
    value: meshHeight
  }
  shader.uniforms.uTopColor = {
    value: new Color(topColor),
  }

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    varying vec3 vPosition;

    #include <common>
    `,
  )

  shader.vertexShader = shader.vertexShader.replace(
    "#include <fog_vertex>",
    `
    #include <fog_vertex>
    vPosition = position;
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    uniform float uHeight;
    uniform vec3 uTopColor;
    varying vec3 vPosition;
    #include <common>
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <dithering_fragment>",
    `
    #include <dithering_fragment>

    vec4 originColor = gl_FragColor;
    float rate = (uHeight/2.0 + vPosition.y)/uHeight;
    // 计算出混合颜色
    vec3 mixedColor = mix(originColor.xyz, uTopColor, rate);
    gl_FragColor = vec4(mixedColor, 1);

    //##shader-end##
    `
  )
}
