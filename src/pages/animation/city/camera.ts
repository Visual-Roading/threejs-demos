import { Camera } from "three"
import eventHub from "@/utils/eventHub"

export default class CameraModule {
  activeCamera: Camera
  collection: Record<string, Camera> = {}

  constructor(camera) {
    this.activeCamera = camera
    this.collection = {
      default: camera
    }

    eventHub.on('toggleCamera', (name) => {
      this.setActive(name)
    })
  }
  add(name, camera) {
    this.collection[name] = camera
  }
  setActive(name) {
    this.activeCamera = this.collection[name]
  }
}


