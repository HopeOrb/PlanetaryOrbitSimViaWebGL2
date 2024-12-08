export const phongVertex = `
// projectionMatrix, modelViewMatrix, normalMatrix uniforms and normal, position attributes are all sent to shaders by three.js automatically (see WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fV;
out mediump vec3 fL;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {    
    fN = (normalMatrix * normal).xyz;
    fV = -(modelViewMatrix * vec4(position, 1.0)).xyz;
    fL = pointLights[0].position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const phongFragment = `
in mediump vec3 fN;
in mediump vec3 fV;
in mediump vec3 fL;

uniform vec3 color;
uniform vec3 ambientLightColor;
uniform float shininess;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {
    vec3 N = normalize(fN);
    vec3 V = normalize(fV);
    vec3 L = normalize(fL);

    vec3 H = normalize(L+V);

    vec3 ambient = ambientLightColor;

    float Kd = max(dot(L, N), 0.0);
    vec3 diffuse = Kd * pointLights[0].color;

    float Ks = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = Ks * pointLights[0].color;

    vec3 result = (ambient + (diffuse + 0.2 * specular) / pointLights[0].decay) * color;

    gl_FragColor = vec4(result, 1.0);
}
`;