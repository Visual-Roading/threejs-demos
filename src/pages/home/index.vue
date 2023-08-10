<script setup lang="ts">

</script>
<template>
  <div class="home-pg">
    <h2 class="title">This is a project for vue demos.</h2>
    <img src="../../../public/snapshot.png" class="snapshot" style="width: 100%;height: 100%;"/>
  </div>
</template>
<style lang="scss" scoped>
.home-pg {
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    margin: 0;
    padding: 20px;
  }
  .snapshot {
    flex: 1;
  }
}

</style>