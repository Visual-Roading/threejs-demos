void main() {
  // 坐标系转换：投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标，相乘顺序不能改变
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}