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
    path: "/geo-map",
    meta: {
      title: "Geo地图"
    },
    children: [
      {
        path: "",
        meta: {
          title: "基础"
        },
        component: () => import("@/pages/map/geo/index.vue"),
      },
      {
        path: "fly-line",
        meta: {
          title: "飞线"
        },
        component: () => import("@/pages/map/fly-line/index.vue"),
      },
    ],
  },
  {
    path: "/html",
    meta: {
      title: "HTML交互"
    },
    children: [
      {
        path: "",
        meta: {
          title: "CSS渲染"
        },
        component: () => import("@/pages/html/css-render/index.vue"),
      },
      {
        path: "curve-rotate",
        meta: {
          title: "曲线运动"
        },
        component: () => import("@/pages/html/curve-rotate/index.vue"),
      },
    ],
  },
  {
    path: "/city",
    meta: {
      title: "智慧城市"
    },
    children: [
      {
        path: "",
        meta: {
          title: "扫描"
        },
        component: () => import("@/pages/city/scan/index.vue"),
      },
      {
        path: "fly-line",
        meta: {
          title: "飞线"
        },
        component: () => import("@/pages/city/fly-line/index.vue"),
      },
      {
        path: "three",
        meta: {
          title: "综合"
        },
        component: () => import("@/pages/city/three/index.vue"),
      },
    ],
  },
  {
    path: "/animation",
    meta: {
      title: "动画"
    },
    children: [
      {
        path: "",
        meta: {
          title: "城市"
        },
        component: () => import("@/pages/animation/city/index.vue"),
      },
      {
        path: "bone",
        meta: {
          title: "骨骼"
        },
        component: () => import("@/pages/animation/bone/index.vue"),
      },
      {
        path: "morph",
        meta: {
          title: "变形"
        },
        component: () => import("@/pages/animation/morph/index.vue"),
      },
      {
        path: "particle",
        meta: {
          title: "粒子"
        },
        component: () => import("@/pages/animation/particle/index.vue"),
      },
      {
        path: "scroll",
        meta: {
          title: "滚动"
        },
        component: () => import("@/pages/animation/scroll/index.vue"),
      },
    ],
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
      {
        path: "custom",
        meta: {
          title: "自定义"
        },
        component: () => import("@/pages/post-processing/custom/index.vue"),
      },
      {
        path: "shine",
        meta: {
          title: "发光"
        },
        component: () => import("@/pages/post-processing/shine/index.vue"),
      },
      {
        path: "bloom-layer",
        meta: {
          title: "层级发光"
        },
        component: () => import("@/pages/post-processing/bloom-layer/index.vue"),
      },
    ],
  },
]

export default threeJSDemoRoutes