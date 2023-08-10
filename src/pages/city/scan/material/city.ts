import { Color, Mesh, MeshBasicMaterial, Shader, Vector2, Vector3 } from "three";
import { gsap } from "gsap";

export function createCityMaterial(mesh: Mesh, bottomColor: string, topColor: string) {
  const material = new MeshBasicMaterial({
    color: bottomColor,
  })
  
  // @ts-ignore
  const { min, max }: { min: Vector3, max: Vector3 } = mesh.geometry.boundingBox
  const meshHeight = max.y - min.y
  // @ts-ignore
  material.onBeforeCompile = (shader, render) => {

    createGradColor(shader, topColor, meshHeight)

    createSpreadColor(shader)

    createAxesColor(shader)

    createHypotenuseColor(shader)

    createVerticalColor(shader)

    gsap.to(shader.uniforms.uSpreadTime, {
      value: 200,
      duration: 3,
      ease: "bounce",
      repeat: -1,
    })

    gsap.to(shader.uniforms.uAxesTime, {
      value: 1200,
      duration: 3,
      ease: "none",
      repeat: -1,
    })

    gsap.to(shader.uniforms.uHypotenuseTime, {
      value: 1600,
      duration: 3,
      ease: "none",
      repeat: -1,
    })
    gsap.to(shader.uniforms.uVerticalTime, {
      value: meshHeight,
      duration: 2,
      ease: "none",
      repeat: -1,
    })
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

export function createSpreadColor(shader: Shader, options: {
  width?: number
  time?: number
  center?: Vector2
} = {}) {
  const { width = 40, time = 0, center = new Vector2(0,0) } = options

  shader.uniforms.uSpreadCenter = {
    value: center
  }
  shader.uniforms.uSpreadTime = {
    value: time
  }
  shader.uniforms.uSpreadWidth = {
    value: width
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
    uniform vec2 uSpreadCenter;
    #include <common>
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "//##shader-end##",
    `
    float spreadRadius = distance(vPosition.xz, uSpreadCenter);
    float spreadRate = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;

    if (spreadRate > 0.0) {
      gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 1.0, 1.0), spreadRate);
    }

    //##shader-end##
    `
  )
}

/**
 * 轴向扫描
 * @param shader 
 * @param options 
 */
export function createAxesColor(shader: Shader, options: {
  width?: number
  time?: number
  start?: number
} = {}) {
  const { width = 40, time = 0, start = 600 } = options

  shader.uniforms.uAxesStart = {
    value: start
  }
  shader.uniforms.uAxesTime = {
    value: time
  }
  shader.uniforms.uAxesWidth = {
    value: width
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    uniform float uAxesTime;
    uniform float uAxesWidth;
    uniform float uAxesStart;
    #include <common>
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "//##shader-end##",
    `
    float AxesRate = -(vPosition.x - uAxesTime + uAxesStart) * (vPosition.x - uAxesTime + uAxesStart) + uAxesWidth;

    if (AxesRate > 0.0) {
      gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 1.0, 1.0), AxesRate);
    }

    //##shader-end##
    `
  )
}

/**
 * 斜向扫描
 * @param shader 
 * @param options 
 */
export function createHypotenuseColor(shader: Shader, options: {
  width?: number
  time?: number
  start?: number
} = {}) {
  const { width = 60, time = 0, start = 800 } = options

  shader.uniforms.uHypotenuseStart = {
    value: start
  }
  shader.uniforms.uHypotenuseTime = {
    value: time
  }
  shader.uniforms.uHypotenuseWidth = {
    value: width
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    uniform float uHypotenuseTime;
    uniform float uHypotenuseWidth;
    uniform float uHypotenuseStart;
    #include <common>
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "//##shader-end##",
    `
    float hypotenuseRate = -(vPosition.x + vPosition.z - uHypotenuseTime + uHypotenuseStart) * (vPosition.x + vPosition.z - uHypotenuseTime + uHypotenuseStart) + uHypotenuseWidth;

    if (hypotenuseRate > 0.0) {
      gl_FragColor = mix(gl_FragColor, vec4(0.8, 1.0, 1.0, 1.0), hypotenuseRate);
    }

    //##shader-end##
    `
  )
}

/**
 * 纵向扫描
 * @param shader 
 * @param options 
 */
export function createVerticalColor(shader: Shader, options: {
  width?: number
  time?: number
  start?: number
} = {}) {
  const { width = 10, time = 0, start = -10 } = options

  shader.uniforms.uVerticalStart = {
    value: start
  }
  shader.uniforms.uVerticalTime = {
    value: time
  }
  shader.uniforms.uVerticalWidth = {
    value: width
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
    uniform float uVerticalTime;
    uniform float uVerticalWidth;
    uniform float uVerticalStart;
    #include <common>
    `,
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    "//##shader-end##",
    `
    float verticalRate = -(vPosition.y - uVerticalTime + uVerticalStart) * (vPosition.y - uVerticalTime + uVerticalStart) + uVerticalWidth;

    if (verticalRate > 0.0) {
      gl_FragColor = mix(gl_FragColor, vec4(0.8, 1.0, 1.0, 1.0), verticalRate);
    }

    //##shader-end##
    `
  )
}

