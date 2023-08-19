<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue"
import { NButton, NCard, NButtonGroup } from "naive-ui"

import createScene from "./entry"
import CameraModule from "./camera";

const domRef = ref<HTMLElement>()
const activeCamera = ref("default")
const cameraModule = ref<CameraModule>()

onMounted(() => {
  const { cameraModule: _cameraModule }= createScene(domRef.value!)
  cameraModule.value = _cameraModule
})

watchEffect(() => {
  if (!cameraModule.value) return
  cameraModule.value.setActive(activeCamera.value)
})

</script>
<template>
  <div ref="domRef" class="city2-pg">
    
  </div>
  <n-card title="镜头管理" class="city2-camera--card">
    <n-button-group>
      <n-button ghost @click="(_) => activeCamera = 'default'">
        场景镜头
      </n-button>
      <n-button ghost @click="(_) => activeCamera = 'carcamera_Orientation'">
        汽车驾驶镜头
      </n-button>
      <n-button round  @click="(_) => activeCamera = 'rightcamera_Orientation'">
        汽车右侧镜头
      </n-button>
    </n-button-group>
  </n-card>
</template>
<style lang="scss">
.city2-pg {
  width: 100%;
  height: 100%;
}

.city2-camera--card {
    position: fixed;
    top: 20px;
    left: 20px;
    width: auto;
  }
</style>