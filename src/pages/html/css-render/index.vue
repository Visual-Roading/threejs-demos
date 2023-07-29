<script setup lang="ts">
import { ref, onMounted } from "vue"

import createScene from "./entry"

const domRef = ref<HTMLElement>()

onMounted(() => {
  createScene(domRef.value)
})

</script>
<template>
  <div class="el-pg">
    <div ref="domRef" class="map" />
  </div>
</template>
<style lang="scss">
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

  .label {
    color: #fff;
    font-size: 1rem;
  }

  .label1 {
    color: #fff;
    display: none;
    font-size: 1rem;
  }


  .label1.visible{
    display: block;
  }

}
</style>./entry