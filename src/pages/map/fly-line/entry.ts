import chinaJson from "@/assets/china.json"

import GeoMap from "./geoMap";

export default function createScene(container: HTMLElement) {
  const colors = ['#fff', '#ff0']
  const datas = [
    { name: '海南省', value: 60 },
    { name: '北京市', value: 100 },
    { name: '山东省', value: 80 },
    { name: '海南省', value: 100 },
    { name: '四川省', value: 100 },
    { name: '台湾省', value: 70 },
    { name: '黑龙江省', value: 80 },
    { name: '湖北省', value: 70 },
    { name: '内蒙古自治区', value: 50 },
    { name: '西藏自治区', value: 50 },
    { name: '新疆维吾尔自治区', value: 63 },
    { name: '甘肃省', value: 63 },
    { name: '山西省', value: 83 },
    { name: '上海市', value: 73 },
    { name: '福建省', value: 63 },
    { name: '广东省', value: 53 },
    { name: '云南省', value: 43 },
    { name: '辽宁省', value: 63 },
    { name: '青海省', value: 90 }
  ]
  
  const flyDatas = [
    { source: { name: '海南省' }, target: { name: '四川省' } },
    { source: { name: '北京市' }, target: { name: '四川省' } },
    { source: { name: '山东省' }, target: { name: '四川省' } },
    { source: { name: '台湾省' }, target: { name: '四川省' } },
    { source: { name: '黑龙江省' }, target: { name: '四川省' } },
    { source: { name: '湖北省' }, target: { name: '四川省' } },
    { source: { name: '内蒙古自治区' }, target: { name: '四川省' } },
    { source: { name: '西藏自治区' }, target: { name: '四川省' } },
    { source: { name: '新疆维吾尔自治区' }, target: { name: '四川省' } },
    { source: { name: '青海省' }, target: { name: '四川省' } }
  ]

  const geoMap = new GeoMap(container)

  geoMap.createMap(chinaJson)
  geoMap.on("click", (_, g) => {
    geoMap.setAreaColor(g)
  })

   // 绘制光柱
   geoMap.drawLightBar(datas, colors)

   // 绘制线条
   // @ts-ignore
   geoMap.drawFlyLine(flyDatas, colors)
}
