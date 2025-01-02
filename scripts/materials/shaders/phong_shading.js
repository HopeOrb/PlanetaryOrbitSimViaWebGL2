export const phongVertex = `
// All uniforms and attributes not explicitly declared here are handled by three.js (See WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fV;
out mediump vec3 fL;

out vec2 vUv;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {   
    vUv = uv;
    fN = normalMatrix * normal; // Normal (in eye coordinates)
    fV = - (modelViewMatrix * vec4(position, 0.0)).xyz; // Vector from point to camera (in eye coordinates)
    fL = pointLights[0].position - (modelViewMatrix * vec4(position, 1.0)).xyz; // Vector from point to light (also in eye coordinates)
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const phongFragment = `
in mediump vec3 fN;
in mediump vec3 fV;
in mediump vec3 fL;

in vec2 vUv;

uniform vec3 color;
uniform vec3 ambientLightColor;
uniform float shininess;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;

void main() {
    vec3 N = normalize(fN);
    vec3 V = normalize(fV);
    vec3 L = normalize(fL);

    vec3 H = normalize(L+V);    // The half vector

    float d = length(fL);   // Distance between light and point

    vec3 ambient = ambientLightColor;

    float Kd = max(dot(L, N), 0.0);
    vec3 diffuse = Kd * pointLights[0].color;

    float Ks = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = Ks * pointLights[0].color;

    if (dot(L, N) < 0.0) {
        specular = vec3(0.0, 0.0, 0.0);
    }

    vec3 specular2 = vec3(pow(specular.x, shininess), pow(specular.y, shininess), pow(specular.z, shininess));  // Specular^shininess

    vec4 dayTexColor = texture2D(dayTexture, vUv);
    vec4 nightTexColor = texture2D(nightTexture, vUv);
    
    if (dayTexColor == nightTexColor) {
        nightTexColor = nightTexColor * 0.3;
    }

    vec4 texColor = mix(nightTexColor, dayTexColor, Kd);

    float decay = 3.0 + 2.0 * d + 1.0 * d * d;

    vec3 result = (ambient + (diffuse + specular) / decay);

    gl_FragColor = vec4(result, 1.0) * texColor;
}
`;