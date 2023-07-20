import { MeshBasicMaterial, Mesh, Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, DoubleSide, CubeTextureLoader, MeshStandardMaterial, TextureLoader, DirectionalLight, PlaneGeometry, MeshDepthMaterial, RGBADepthPacking, Clock  } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import gltfModelUrl from "@/assets/models/LeePerrySmith/LeePerrySmith.glb?url"
import gltfColorUrl from "@/assets/models/LeePerrySmith/color.jpg?url"
import gltfNormalUrl from "@/assets/models/LeePerrySmith/normal.jpg?url"

import envNX from "@/assets/environmentMaps/0/nx.jpg?url"
import envNY from "@/assets/environmentMaps/0/ny.jpg?url"
import envNZ from "@/assets/environmentMaps/0/nz.jpg?url"
import envPX from "@/assets/environmentMaps/0/px.jpg?url"
import envPY from "@/assets/environmentMaps/0/py.jpg?url"
import envPZ from "@/assets/environmentMaps/0/pz.jpg?url"


export default function createScene(container: HTMLElement) {
  const scene = new Scene()

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 15)
  scene.add(camera)

  const cubeTextureLoader = new CubeTextureLoader()
  const envMapTexture = cubeTextureLoader.load([envPX, envNX, envPY, envNY, envPZ, envNZ])
  scene.environment = envMapTexture
  scene.background = envMapTexture

  const geometry = new PlaneGeometry(20, 20)
  const material = new MeshStandardMaterial({
    color: "#fff",
    side: DoubleSide
  })
  const plane = new Mesh(geometry, material)
  plane.receiveShadow = true
  scene.add(plane)

  const directionLight = new DirectionalLight("#fff", 1)
  directionLight.castShadow = true
  directionLight.position.set(0, 0, 100)
  scene.add(directionLight)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  const uniformVariables = {
    uTime: {
      value: 0
    }
  }
  const clock = new Clock()

  function render() {
    uniformVariables.uTime.value = clock.getElapsedTime()

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  render();

  const textureLoader = new TextureLoader()
  const modelTexture = textureLoader.load(gltfColorUrl)
  const modelNormalTexture = textureLoader.load(gltfNormalUrl)
  const modelMaterial = new MeshStandardMaterial({
    map: modelTexture,
    normalMap: modelNormalTexture,
  })
  modelMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniformVariables.uTime
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>

      mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle));
      }
      uniform float uTime;
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      #include <beginnormal_vertex>

      float angle = sin(position.y + uTime) * 0.5;
      mat2 rotateMatrix = rotate2d(angle);

      objectNormal.xz = rotateMatrix * objectNormal.xz;
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>   
      
      transformed.xz = rotateMatrix * transformed.xz;
      `
    )
  }

  const depthMaterial = new MeshDepthMaterial({
    depthPacking: RGBADepthPacking
  })
  depthMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniformVariables.uTime
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
      #include <common>
      mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle));
      }
      uniform float uTime;
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      float angle = sin(position.y+uTime) *0.5;
      mat2 rotateMatrix = rotate2d(angle);
      
      transformed.xz = rotateMatrix * transformed.xz;
      `
    )
  }
  depthMaterial

  const gltfLoader = new GLTFLoader()
  gltfLoader.load(gltfModelUrl, (model) => {
    const validModel = model.scenes[0].children[0]
    validModel.material = modelMaterial
    validModel.position.z = 5
    validModel.castShadow = true
    validModel.customDepthMaterial = depthMaterial

    scene.add(validModel)
  })
}
