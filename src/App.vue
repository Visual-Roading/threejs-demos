<script setup lang="ts">
import { useRouter } from "vue-router"
import { NPopover, NButton, NMenu } from "naive-ui"
import type { MenuOption } from "naive-ui"

import ThreeJSRoutes from "@/routers/modules/threejs"

const router = useRouter()

function navigate(path?: string) {
  if (path) {
    router.push(path)
  }
}

const menuOptions: MenuOption[] = ThreeJSRoutes.map(item => {
  const children: MenuOption[] = (item.children ?? []).map(subItem => {
    return {
      label: subItem.meta?.title,
      key: subItem.path ? (item.path + "/" + subItem.path) : item.path
    }
  })

  return {
    label: item.meta?.title,
    key: item.path,
    children,
  }
})
menuOptions.unshift({
  label: "首页",
  key: "/"
})

const defOpendMenuIds = menuOptions.map(item => item.key)

</script>

<template>
  <n-popover>
    <template #trigger>
      <n-button type="primary" class="app-menu">菜单</n-button>
    </template>
    <!-- 1111 -->
    <n-menu mode="vertical" :options="menuOptions" :default-expanded-keys="defOpendMenuIds" @update:value="navigate" />
  </n-popover>
  <router-view></router-view>
</template>

<style lang="scss">
.app-pg {}

.app-menu {
  position: fixed;
  bottom: 100px;
  left: 100px;

  z-index: 99;
}
</style>
