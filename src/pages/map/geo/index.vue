<script setup lang="ts">
import { ref, onMounted } from "vue"

import createScene from "./entry"

const domRef = ref<HTMLElement>()
const provinceDomRef = ref<HTMLElement>()

onMounted(() => {
  createScene(domRef.value, provinceDomRef.value)
})

</script>
<template>
  <div class="el-pg">
    <div ref="domRef" class="map">
    
    </div>
    <div ref="provinceDomRef" class="province-tag" />
  </div>
</template>
<style lang="scss" scoped>
.el-pg {
  width: 100%;
  height: 100%;

  .map {
    width: 100%;
    height: 100%;
  }

  .province-tag {
    position: absolute;
    z-index: 10;

    background: #fff;
    padding: 2px 4px;
    line-height: 14px;
    font-size: 14px;
    border-radius: 7px;
  }
}
</style>./entry