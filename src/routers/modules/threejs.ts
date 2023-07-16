import { RouteRecordRaw }  from "vue-router"

const threeJSDemoRoutes: RouteRecordRaw[] = [
  {
    path: '/shaders',
    meta: {
      title: "着色器"
    },
    children: [
      {
        path: "",
        meta: {
          title: "基础"
        },
        component: () => import("@/pages/shaders/basic/index.vue")
      },
      {
        path: "uv",
        meta: {
          title: "uv"
        },
        component: () => import("@/pages/shaders/uv/index.vue")
      },
      {
        path: "light",
        meta: {
          title: "孔明灯"
        },
        component: () => import("@/pages/shaders/light/index.vue")
      },
      {
        path: "wave",
        meta: {
          title: "波浪"
        },
        component: () => import("@/pages/shaders/wave/index.vue")
      },
      {
        path: "bathhub",
        meta: {
          title: "浴缸"
        },
        component: () => import("@/pages/shaders/bathhub/index.vue")
      }
    ]
  }
]

export default threeJSDemoRoutes