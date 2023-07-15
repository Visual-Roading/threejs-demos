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
      }
    ]
  }
]

export default threeJSDemoRoutes