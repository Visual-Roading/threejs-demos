varying vec3 vPosition;
uniform float uHeight;

void main(){
    float strength = 1.0 - vPosition.y / uHeight;

    gl_FragColor = vec4(0.8, 0.8, 0, strength * strength);
}