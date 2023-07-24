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
      },
      {
        path: "firework",
        meta: {
          title: "烟花"
        },
        component: () => import("@/pages/shaders/firework/index.vue")
      },
      {
        path: "material",
        meta: {
          title: "材质加工"
        },
        component: () => import("@/pages/shaders/material/index.vue")
      }
    ]
  },
  {
    path: "/post-processing",
    meta: {
      title: "后期处理"
    },
    children: [
      {
        path: "",
        meta: {
          title: "基础"
        },
        component: () => import("@/pages/post-processing/basic/index.vue"),
      },
    ],
  }
]

export default threeJSDemoRoutes