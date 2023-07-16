varying vec2 vUv;

// 随机函数
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

void main() {
  //  图案1
  // gl_FragColor = vec4(vUv, 0, 1.0);
  
  // 图案2
  // gl_FragColor = vec4(vUv.x, vUv.x, 0, 1.0);

  // 图案3：从左到右
  // float strength = vUv.x;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案4：从上到下
  // float strength = vUv.y;
  // gl_FragColor = vec4(1.0 - strength, 1.0 - strength, 1.0 - strength, 1.0);

  // 图案5：从下到上，变化剧烈一点
  // float strength = vUv.y * 6.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案6：从下到上，渐变条纹
  // float strength = mod(vUv.y * 10.0, 1.0);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案7：十字格子
  // float strength = step(mod(vUv.y * 10.0, 1.0), 0.5);
  // strength += step(mod(vUv.x * 10.0, 1.0), 0.5);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案8：点阵，都是1的位置就会显示为白色
  // float strength = step(mod(vUv.y * 10.0, 1.0), 0.3);
  // strength *= step(mod(vUv.x * 10.0, 1.0), 0.3);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案9：点阵，条纹
  // float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
  // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
  // float strength = barX + barY;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 图案10：点阵，T型
  // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
  // float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
  // float strength = barX + barY;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 对称
  // float strength = abs(vUv.x - 0.5);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 最大值
  //  float strength = (abs(vUv.x - 0.5), abs(vUv.y - 0.5);
  //  gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 最大值
  //  float strength = 1.0- max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  //  gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 回字
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 小正方形
  // float strength = step(max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)), 0.2);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 向下取整：条纹
  // float strength = floor(vUv.y * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 方格条纹 
  // float barX = floor(vUv.x * 10.0) / 10.0;
  // float barY = floor(vUv.y * 10.0) / 10.0;
  // float strength = barX * barY;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 随机函数图像
  // float strength = random(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 随机颜色的格子效果：固定
  // float barX = floor(vUv.x * 10.0) / 10.0;
  // float barY = floor(vUv.y * 10.0) / 10.0;
  // vec2 gridUv = vec2(barX, barY);
  // float strength = random(gridUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 向量长度
  // float strength = length(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 距离中心点的距离
  // float strength = distance(vUv, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 中心点高亮
  // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 亮点
  // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 星星
  // float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)));
  // strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 星星：显示效果优化
  // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 星星：旋转
  // vec2 rotatedUv = rotate(vUv, 3.14 * 0.25, vec2(0.5, 0.5));
  // float strength = 0.15 / distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 圆形
  // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  // 圆环
  // float strength = 1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 波浪
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 30.0) * 0.1,
  //   vUv.y + sin(vUv.x * 30.0) * 0.1
  // );
  // float strength = 1.0 - step(0.02, abs(distance(waveUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 波浪
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) * 0.1,
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );
  // float strength = 1.0 - step(0.02, abs(distance(waveUv, vec2(0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 根据角度显示
  // float angle = atan(vUv.x, vUv.y);
  // float strength = angle;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 放大角度 
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  // float strength = angle;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 螺旋渐变
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
  float strength = (angle + 3.14) / 6.28;
  gl_FragColor = vec4(strength, strength, strength, 1.0);

}