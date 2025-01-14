// TODO: Spotlight, multiple point lights, star

export const toonVertex = `
// All uniforms and attributes not explicitly declared here are handled by three.js (See WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fLp[NUM_POINT_LIGHTS];
out mediump vec3 fLs[NUM_SPOT_LIGHTS];

out vec2 vUv;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[NUM_POINT_LIGHTS];

uniform struct SpotLight {
    vec3 color;
    vec3 position;
    vec3 direction;
    float distance;
    float coneCos;
    float penumbraCos;
    float decay;
} spotLights[NUM_SPOT_LIGHTS];

void main() {    
    fN = normalMatrix * normal; // Normal (in eye coordinates)
    
    for (int i=0; i<NUM_POINT_LIGHTS; i++) {
        fLp[i] = pointLights[i].position - ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;
    }

    for (int i=0; i<NUM_SPOT_LIGHTS; i++) {
        fLs[i] = spotLights[i].position - (modelViewMatrix * vec4( position, 1.0 )).xyz;
    }
    
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const toonFragment = `
in mediump vec3 fN;
in mediump vec3 fLp[NUM_POINT_LIGHTS];
in mediump vec3 fLs[NUM_SPOT_LIGHTS];

in vec2 vUv;

uniform vec3 ambientLightColor;
uniform float shininess;

uniform sampler2D texture1;

uniform bool isStar;
uniform vec3 color;
uniform float opacity;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[NUM_POINT_LIGHTS];

uniform struct SpotLight {
    vec3 color;
    vec3 position;
    vec3 direction;
    float distance;
    float coneCos;
    float penumbraCos;
    float decay;
} spotLights[NUM_SPOT_LIGHTS];

void main() {

    if (isStar) {
        gl_FragColor = vec4( color, opacity );
    }
    else {
        vec3 N = normalize(fN);

        vec3 lightIntensity;
    
        vec3 ambient = ambientLightColor;
        lightIntensity += ambient;

        for (int i=0; i<NUM_POINT_LIGHTS; i++) {
            vec3 L = normalize( fLp[i] );
    
            float d = length( fLp[i] );
            float attenuation = 1.0 / ( pointLights[i].decay * d * d );

            float intensity = max( dot( N, L ), 0.0 );
        
            vec3 pointLight = pointLights[i].color * intensity * attenuation;
            lightIntensity += pointLight;
        }

        // Spotlight calculations
        // TODO: Still need to calculate the penumbra
        vec3 spotlight = vec3( 0.0 );
        for (int i=0; i<NUM_SPOT_LIGHTS; i++) {
            vec3 L = normalize( fLs[i] );
            vec3 direction = normalize( spotLights[i].direction );
            float d = length( fLs[i] );
            float attenuation = 1.0 / (spotLights[i].decay * d * d);
            float angle = max( dot( L, direction ), 0.0 );
            if ( angle > spotLights[i].coneCos ) {
                float intensity = max( dot( L, N ), 0.0 );
                spotlight += intensity * spotLights[i].color * attenuation;
            }
        }
        lightIntensity += spotlight;

        vec3 lightDiscrete = (floor( lightIntensity * 5.0 ) / 5.0) / 4.0 ;

        vec4 texColor = texture2D( texture1, vUv );

        // EDGE DETECTION

        ivec2 texSize = textureSize( texture1, 0 );

        float offsetX = 1.0 / float(texSize.x);
        float offsetY = 1.0 / float(texSize.y);

        vec4 texColorRight = texture2D( texture1, vUv + offsetX );
        vec4 texColorLeft = texture2D( texture1, vUv - offsetX );
        vec4 texColorUp = texture2D( texture1, vUv + offsetY );
        vec4 texColorDown = texture2D( texture1, vUv - offsetY );

        vec4 horizontalGradient = texColorRight - texColorLeft;
        vec4 verticalGradient = texColorUp - texColorDown;

        vec4 edgeMagnitude = sqrt( horizontalGradient * horizontalGradient + verticalGradient * verticalGradient );
        float edgeIntensity = (edgeMagnitude.r + edgeMagnitude.g + edgeMagnitude.b) / 3.0;

        gl_FragColor = vec4(lightDiscrete, 1.0) * texColor;
    
        // If edge paint black
        if (edgeIntensity > 0.06) {
            gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        }
    }

    
}
`;