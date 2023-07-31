attribute float aIndex;
varying float vSize;

void main() {
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;

    vSize = (500.0 - aIndex) * 0.1;

    gl_PointSize = vSize;
}