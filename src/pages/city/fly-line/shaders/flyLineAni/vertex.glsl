attribute float aIndex;
varying float vSize;
uniform float uTime;
uniform float uLength;

void main() {
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;

    vSize = 50.0 + aIndex - uTime;
    if (vSize > 50.0) {
        vSize = 0.0;
    }

    gl_PointSize = vSize * 0.1;
}