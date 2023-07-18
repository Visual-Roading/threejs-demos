precision lowp float;

varying vec2 vUv;
// 顶点的位置
varying vec4 pointPosition;
// 物体在世界中的坐标位置
varying vec4 modelPosition;

void main() {
  // 坐标系转换：投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标，相乘顺序不能改变
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  // uv是内置变量，代表图像中每个像素的坐标位置
  vUv = uv;

  pointPosition = vec4(position, 1.0);
  modelPosition = modelMatrix * vec4(position, 1.0);
}