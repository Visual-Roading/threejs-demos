import { PlaneGeometry, Clock, Mesh, Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, DoubleSide, ShaderMaterial, Color  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui"

import fragmentShader from "./fragment.glsl?raw"
import vertexShader from "./vertex.glsl?raw"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(3, 3, 3)
  scene.add(camera)

  const uniformParams = {
    uTime: 0,
    uScale: 0.12,
    uFrequency: 5.0,
    uNoiseFrequency: 4.5,
    uNoiseScale: 1.0,
    uLowColor: "#282575",
    uHightColor: "#453bcc",
    uOpacity: 1.0,
    uXSpeed: 0.3,
    uZSpeed: 0.5,
  }
  const geometry = new PlaneGeometry(5, 5, 500, 500)
  geometry.rotateX( -Math.PI / 2)

  const shaderMaterial = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
    uniforms: {
      uTime: {
        value: uniformParams.uTime
      },
      uScale: {
        value: uniformParams.uScale,
      },
      uFrequency: {
        value: uniformParams.uFrequency,
      },
      uNoiseFrequency: {
        value: uniformParams.uNoiseFrequency,
      },
      uNoiseScale: {
        value: uniformParams.uNoiseScale,
      },
      uTIme: {
        value: uniformParams.uTime,
      },
      uLowColor: {
        value: new Color(uniformParams.uLowColor),
      },
      uHightColor: {
        value: new Color(uniformParams.uHightColor),
      },
      uOpacity: {
        value: uniformParams.uOpacity,
      },
      uXSpeed: {
        value: uniformParams.uXSpeed,
      },
      uZSpeed: {
        value: uniformParams.uZSpeed,
      },
    },
    transparent: true,
  })
  const mesh = new Mesh(geometry, shaderMaterial)

  scene.add(mesh)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  const renderClock = new Clock()

  function render() {
    controls.update();
    uniformParams.uTime = renderClock.getElapsedTime()
    shaderMaterial.uniforms.uTime.value = uniformParams.uTime
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  
  render();

  const gui = new GUI()
  gui.add(uniformParams, "uFrequency").min(0).max(30).step(0.1).onChange(value => {
    shaderMaterial.uniforms.uFrequency.value = value
  })
  gui.add(uniformParams, "uScale").min(0).max(5).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uScale.value = value
  })
  gui.add(uniformParams, "uNoiseFrequency").min(0).max(30).step(0.1).onChange(value => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value
  })
  gui.add(uniformParams, "uNoiseScale").min(0).max(5).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uNoiseScale.value = value
  })
  gui.add(uniformParams, "uNoiseScale").min(0).max(5).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uNoiseScale.value = value
  })
  gui.add(uniformParams, "uOpacity").min(0).max(1.0).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uOpacity.value = value
  })
  gui.add(uniformParams, "uXSpeed").min(0).max(5).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uXSpeed.value = value
  })
  gui.add(uniformParams, "uZSpeed").min(0).max(5).step(0.01).onChange(value => {
    shaderMaterial.uniforms.uZSpeed.value = value
  })
  gui.addColor(uniformParams, "uLowColor").onChange(color => {
    shaderMaterial.uniforms.uLowColor.value = new Color(color)
  })
  gui.addColor(uniformParams, "uHightColor").onChange(color => {
    shaderMaterial.uniforms.uHightColor.value = new Color(color)
  })

}



