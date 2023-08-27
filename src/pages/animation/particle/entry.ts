import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, EquirectangularReflectionMapping, BoxGeometry, Mesh, MeshStandardMaterial, Object3D, Group, Points, PointsMaterial, Color, TextureLoader, Texture, AdditiveBlending, ShaderMaterial, BufferAttribute  } from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// @ts-ignore
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

import gsap from "gsap"

import bgHDRUri from "@/assets/hdrs/city2.hdr?url"
import fighterModelUri from "@/assets/models/fighter.glb?url"
import particleTextureUri from "@/assets/images/particles/1.png"
import fragmentShader from "./shaders/fragmentShader.glsl?raw"
import vertexShader from "./shaders/vertexShader.glsl?raw"

export default function createScene(container: HTMLElement) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 0, 60)
  scene.add(camera)

  const renderer = new WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  const rgbeLoader = new RGBELoader()
  rgbeLoader.loadAsync(bgHDRUri).then((texture) => {
    scene.background = texture
    scene.environment = texture
    scene.environment!.mapping = EquirectangularReflectionMapping
  })

  const textureLoader = new TextureLoader()
  const particleTexture = textureLoader.load(particleTextureUri)
  let fighterModel
  let fighterGroup
  let fighterExpanded = false

  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../../../../node_modules/three/examples/jsm/libs/draco/')
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)
  gltfLoader.load(fighterModelUri, (model) => {
    model.scene.position.set(0, -10, 0)
    scene.add(model.scene)
    fighterModel = model.scene

    fighterGroup = transformModelToPoint(model.scene, particleTexture)

    scene.add(fighterGroup)
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  const axesHelper = new AxesHelper(5)
  scene.add(axesHelper)

  function render() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  
  render()

  function transformModelToPoint(model: Object3D, pointMap: Texture) {
    const group = new Group()

    function createPoints(obj: any, parent) {
      if (obj?.children?.length >  0) {
        obj.children.forEach((item: any) => {
          if (item.isMesh) {
            const color = new Color(
              Math.random(),
              Math.random(),
              Math.random(),
            )
            const material = new ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: pointMap },
                uTime: {
                  value: 0,
                },
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              blending: AdditiveBlending,
              transparent: true,
              depthTest: false,
            })

            const points = new Points(
              item.geometry,
              material,
            )

            points.position.copy(item.position)
            points.scale.copy(item.scale)
            points.rotation.copy(item.rotation)
            parent.add(points)

            createPoints(item, points)
          }
        })
      }
    }

    createPoints(model, group)
    group.position.set(0, 10, 0)

    return group
  }

  window.addEventListener("click", () => {
    if (fighterExpanded) {
      expandFighter()
      fighterExpanded = false
    } else {
      unExpandFighter()
      fighterExpanded = true
    }
  })

  function unExpandFighter() {
    fighterGroup.traverse((child) => {
      if (child.isPoints) {
        let randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        )
        console.log(child)
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }

        child.geometry.setAttribute(
          "aPosition",
          new BufferAttribute(randomPositionArray, 3)
        )

        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 10,
        })
      }
    })
  }

  function expandFighter() {
    fighterGroup.traverse((child) => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 10,
        });
      }
    })
  }
}
