<script setup lang="ts">
import { ref, onMounted } from "vue"

import createScene from "./entry"

const canvasRef = ref<HTMLCanvasElement>()
const domRef = ref<HTMLDivElement>()

onMounted(() => {
  createScene(domRef.value!, canvasRef.value!)
})

</script>
<template>
  <div class="animation-scroll-pg" ref="domRef">
    <canvas ref="canvasRef" class="container" /> 

    <section class="section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>
</template>
<style lang="scss">
.animation-scroll-pg {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  .container {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;

    background: #1e1a20;
  }

  .section {
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    z-index: 1;
    font-family: 'Cabin', sans-serif;
    color: #ffeded;
    text-transform: uppercase;
    font-size: 7vmin;
    padding-left: 10%;
    padding-right: 10%;
    user-select: none;

    &:nth-child(odd) {
      justify-content: flex-end;
    }
  }

}
</style>