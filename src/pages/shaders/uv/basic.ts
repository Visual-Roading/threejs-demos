import { PlaneGeometry, MeshBasicMaterial, Mesh, Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, DoubleSide, ShaderMaterial  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import fragmentShader from "./fragment.glsl?raw"
import vertexShader from "./vertex.glsl?raw"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 10)
  scene.add(camera)

  const geometry = new PlaneGeometry(10, 10)
  

  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
  })
  const mesh = new Mesh(geometry, material)

  scene.add(mesh)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  render();
}
