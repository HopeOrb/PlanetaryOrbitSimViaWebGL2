export const toonVertex = `
// All uniforms and attributes not explicitly declared here are handled by three.js (See WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fL;

out vec2 vUv;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {    
    fN = normalMatrix * normal; // Normal (in eye coordinates)
    fL = pointLights[0].position - (modelViewMatrix * vec4(position, 1.0)).xyz; // Vector from point to light (in eye coordinates)

    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const toonFragment = `
in mediump vec3 fN;
in mediump vec3 fL;

in vec2 vUv;

uniform vec3 color;
uniform vec3 ambientLightColor;
uniform float shininess;

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[1];

void main() {
    vec3 N = normalize(fN);
    vec3 L = normalize(fL);

    vec3 ambient = ambientLightColor;

    float d = length( fL );   // Distance between point and light
    float decay = 3.0 + 2.0 * d + 1.0 * d * d; // Arbitrary, I've tried a lot of values to see what looks good

    float intensity = max( dot( N, L ), 0.0 );
    
    vec3 light = pointLights[0].color * intensity / decay;

    light = floor( light * 5.0 ) / 5.0; // This is a better approach than hand-picking the light values for each interval

    vec4 dayTexColor = texture2D( dayTexture, vUv );
    vec4 nightTexColor = texture2D( nightTexture, vUv );

    if (dayTexColor == nightTexColor) {
        nightTexColor = nightTexColor * 0.3;
    }

    vec4 texColor = mix( nightTexColor, dayTexColor, intensity );

    gl_FragColor = vec4(light + ambient, 1.0) * texColor;
}
`;