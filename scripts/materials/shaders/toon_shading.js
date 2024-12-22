export const toonVertex = `
// All uniforms and attributes not explicitly declared here are handled by three.js (See WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fL;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {    
    fN = normalMatrix * normal; // Normal (in eye coordinates)
    fL = pointLights[0].position - (modelViewMatrix * vec4(position, 1.0)).xyz; // Vector from point to light (in eye coordinates)
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const toonFragment = `
in mediump vec3 fN;
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
    vec3 L = normalize(fL);

    vec3 result = ambientLightColor * color;

    float d = length(fL);   // Distance between point and light
    float decay = 3.0 + 2.0 * d + 1.0 * d * d; // Arbitrary, I've tried a lot of values to see what looks good

    float intensity = dot(N, L);
    
    if (intensity / decay > 0.02) {
        result += pointLights[0].color * color * 0.05;
    }
    else if (intensity / decay > 0.008) {
        result += pointLights[0].color * color * 0.03;
    }
    else if (intensity / decay > 0.0) {
        result += pointLights[0].color * color * 0.02;
    }

    gl_FragColor = vec4(result, 1.0);
}
`;