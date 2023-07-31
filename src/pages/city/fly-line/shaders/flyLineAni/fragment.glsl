varying float vSize;
uniform vec3 uColor;

void main(){
    float radius = distance(gl_PointCoord, vec2(0.5, 0.5));
    float strength = 1.0 - (radius * 2.0);

    if (vSize <= 0.0) {
        gl_FragColor = vec4(0, 0, 0, 0);
    } else {
        gl_FragColor = vec4(uColor, strength);
    }
}