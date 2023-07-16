varying vec2 vUv;
varying float vElevation;
uniform vec3 uLowColor;
uniform vec3 uHightColor;
uniform float uOpacity;

void main() {
  float alpha = (vElevation + 1.0) / 2.0;
  vec3 color = mix(uLowColor, uHightColor, alpha);

  gl_FragColor = vec4(color, uOpacity);
}
