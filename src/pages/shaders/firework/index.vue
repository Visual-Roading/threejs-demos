<script setup lang="ts">
import { ref, onMounted } from "vue"

import createScene from "./entry"

const domRef = ref<HTMLElement>()

onMounted(() => {
  createScene(domRef.value!)
})

</script>
<template>
  <div ref="domRef" class="shaders-uv-pg">
    
  </div>
</template>
<style lang="scss">
.shaders-uv-pg {
  width: 100%;
  height: 100%;
}
</style>./light./entry