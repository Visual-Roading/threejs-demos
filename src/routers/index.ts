import { createRouter, createWebHistory, RouteRecordRaw }  from "vue-router"

import Home from "@/pages/home/index.vue"
import NofFound from '@/pages/404.vue'

import ThreeJSDemoRoutes from "./modules/threejs"

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  ...ThreeJSDemoRoutes,
  {
    path: "/:pathMatch(.*)",
    component: NofFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router