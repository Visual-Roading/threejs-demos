varying vec2 vUv;
// 顶点的位置
varying vec4 pointPosition;
// 物体在世界中的坐标位置
varying vec4 modelPosition;

void main() {
  vec4 redColor = vec4(1, 0, 0, 1);
  vec4 yellowColor = vec4(1, 1, 0.5, 1);
  vec4 mixedColor = mix(yellowColor, redColor, pointPosition.y / 3.0);

  if (gl_FrontFacing) {
    gl_FragColor = vec4(mixedColor.xyz-(modelPosition.y-20.0)/80.0-0.1, 1);
  } else {
      gl_FragColor = vec4(mixedColor.xyz, 1);
  }

}