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

    vec4 texColor = dayTexColor * 0.7;  // Multiplied because it looks better
    
    if (intensity == 0.0) {
        texColor = nightTexColor;
    }

    // EDGE DETECTION

    ivec2 texSize = textureSize( dayTexture, 0 );

    float offsetX = 1.0 / float(texSize.x);
    float offsetY = 1.0 / float(texSize.y);

    vec4 texColorRight = texture2D( dayTexture, vUv + offsetX );
    vec4 texColorLeft = texture2D( dayTexture, vUv - offsetX );
    vec4 texColorUp = texture2D( dayTexture, vUv + offsetY );
    vec4 texColorDown = texture2D( dayTexture, vUv - offsetY );

    vec4 horizontalGradient = texColorRight - texColorLeft;
    vec4 verticalGradient = texColorUp - texColorDown;

    vec4 edgeMagnitude = sqrt( horizontalGradient * horizontalGradient + verticalGradient * verticalGradient );
    float edgeIntensity = (edgeMagnitude.r + edgeMagnitude.g + edgeMagnitude.b) / 3.0;

    gl_FragColor = vec4(light + ambient, 1.0) * texColor;
    
    // If edge paint black
    if (edgeIntensity > 0.06) {
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    }
}
`;