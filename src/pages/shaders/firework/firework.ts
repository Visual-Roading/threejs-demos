import { AdditiveBlending, Audio, AudioLoader, AudioListener, BufferAttribute, BufferGeometry, Camera, Clock, Color, ColorRepresentation, Points, Scene, ShaderMaterial } from "three"

import boomAudio1 from "@/assets/audio/pow1.ogg?url"
import boomAudio2 from "@/assets/audio/pow2.ogg?url"
import boomAudio3 from "@/assets/audio/pow3.ogg?url"
import boomAudio4 from "@/assets/audio/pow4.ogg?url"
import sendAudio from "@/assets/audio/send.mp3?url"

import startPointFragmentShader from "./shaders/startPointFragment.glsl?raw"
import startPointVertexShader from "./shaders/startPointVertex.glsl?raw"
import boomFragmentShader from "./shaders/boomFragment.glsl?raw"
import boomVertexShader from "./shaders/boomVertex.glsl?raw"

export class FireworkPosition {
  public x: number
  public y: number
  public z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
}

class Firework {
  private color: Color
  private clock: Clock
  private scene?: Scene
  private camera?: Camera
  private boomPointGeometry: BufferGeometry
  private boomPointMaterial: ShaderMaterial
  private boomPoint: Points
  private boomCount: number

  private startPointGeometry: BufferGeometry
  private startPointMaterial: ShaderMaterial
  private startPoint: Points
  private from: FireworkPosition
  private to: FireworkPosition

  private boomAudios: string[] = [
    boomAudio1,
    boomAudio2,
    boomAudio3,
    boomAudio4,
  ]
  private startAudio: Audio
  private boomAudio: Audio
  private startAudioListener: AudioListener
  private boomAudioListener: AudioListener
  private isSendPlaying = false
  private isBoomPlaying = false

  constructor(color: ColorRepresentation , from: FireworkPosition, to: FireworkPosition) {
    this.color = new Color(color)
    this.from = from
    this.to = to

    this.startPointGeometry = new BufferGeometry()
    this.startPointGeometry.setAttribute(
      "position",
      new BufferAttribute(
        new Float32Array([from.x, from.y, from.z]),
        3
      )
    )
    this.startPointGeometry.setAttribute(
      "aStep",
      new BufferAttribute(new Float32Array([
        to.x - from.x,
        to.y - from.y,
        to.z - from.z
      ]), 3)
    )

    this.startPointMaterial = new ShaderMaterial({
      vertexShader: startPointVertexShader,
      fragmentShader: startPointFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 20
        },
        uColor: {
          value: this.color,
        }
      }
    })

    // 创建烟花点球
    this.startPoint = new Points(
      this.startPointGeometry,
      this.startPointMaterial
    )
    this.clock = new Clock()

    this.boomPointGeometry = new BufferGeometry()
    this.boomPointMaterial = new ShaderMaterial({
      vertexShader: "",
      fragmentShader: "",
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 20
        },
        uColor: {
          value: this.color,
        }
      }
    })
    this.boomCount = 180 + Math.floor(Math.random() * 180)
    const boomPositionArray = new Float32Array(this.boomCount * 3)
    const boomScaleArray = new Float32Array(this.boomCount)
    const directionArray = new Float32Array(this.boomCount * 3)
    for(let i = 0; i < this.boomCount; i++) {
      // 一开始烟花位置
      boomPositionArray[i * 3 + 0] = to.x
      boomPositionArray[i * 3 + 1] = to.y
      boomPositionArray[i * 3 + 2] = to.z

      //   设置烟花所有粒子初始化大小
      boomScaleArray[i] = Math.random()

      //   设置四周发射的角度
      let theta = Math.random() * 2 * Math.PI
      let beta = Math.random() * 2 * Math.PI
      let r = Math.random()
      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
    }
    this.boomPointGeometry.setAttribute(
      "position",
      new BufferAttribute(
        boomPositionArray,
        3
      )
    )
    this.boomPointGeometry.setAttribute(
      "aScale",
      new BufferAttribute(boomScaleArray, 1)
    )
    this.boomPointGeometry.setAttribute(
      "aRandom",
      new BufferAttribute(directionArray, 3)
    )
    
    this.boomPointMaterial = new ShaderMaterial({
      vertexShader: boomVertexShader,
      fragmentShader: boomFragmentShader,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0
        },
        uSize: {
          value: 0
        },
        uColor: {
          value: this.color,
        }
      }
    })
    this.boomPoint = new Points(
      this.boomPointGeometry,
      this.boomPointMaterial
    )

    this.startAudioListener = new AudioListener()
    this.startAudio = new Audio(this.startAudioListener)
    const startAudioLoader = new AudioLoader()
    startAudioLoader.load(
      sendAudio,
      buffer => {
        this.startAudio.setBuffer(buffer)
        this.startAudio.setLoop(false)
        this.startAudio.setVolume(1)
      }
    )

    const boomAudioUrl =  this.boomAudios[ Math.floor(Math.random() * 4) ]
    this.boomAudioListener = new AudioListener()
    this.boomAudio = new Audio(this.boomAudioListener)
    const boomAudioLoader = new AudioLoader()
    boomAudioLoader.load(
      boomAudioUrl,
      buffer => {
        this.boomAudio.setBuffer(buffer)
        this.boomAudio.setLoop(false)
        this.boomAudio.setVolume(1)
      }
    )
  }

  add2Scene(scene: Scene, camera: Camera) {
    this.scene = scene
    this.camera = camera

    scene.add(this.startPoint)
    scene.add(this.boomPoint)
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime()

    if (elapsedTime < 0.2) return

    if (elapsedTime < 1) {
      if (!this.startAudio.isPlaying && !this.isSendPlaying) {
        this.startAudio.play()
        this.isSendPlaying = true
      }

      this.startPointMaterial.uniforms.uTime.value = elapsedTime
      this.startPointMaterial.uniforms.uSize.value = 20
    } else {
      const time = elapsedTime - 1
      //   让点元素消失
      this.startPointMaterial.uniforms.uSize.value = 0
      this.startPoint.clear()
      this.startPointGeometry.dispose()
      this.startPointMaterial.dispose()
      this.scene!.remove(this.startPoint)

      if (!this.boomAudio.isPlaying && !this.isBoomPlaying) {
        this.boomAudio.play()
        this.isBoomPlaying = true
      }

      // 显示
      this.boomPointMaterial.uniforms.uSize.value = 20
      this.boomPointMaterial.uniforms.uTime.value = time

      if (time > 5) {
        this.boomPointMaterial.uniforms.uSize.value = 0
        this.boomPoint.clear()
        this.boomPointGeometry.dispose()
        this.boomPointMaterial.dispose()
        this.scene!.remove(this.boomPoint)

        return "removed"
      }
    }
  }

}

export default Firework
