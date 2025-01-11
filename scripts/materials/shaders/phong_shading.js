export const phongVertex = `
// All uniforms and attributes not explicitly declared here are handled by three.js (See WebGLProgram in three docs)

out mediump vec3 fN;
out mediump vec3 fV;
out mediump vec3 fL[NUM_POINT_LIGHTS];

out vec2 vUv;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[NUM_POINT_LIGHTS];

uniform vec2 uvScale;

void main() {   
    vUv = uv * uvScale;
    fN = normalMatrix * normal; // Normal (in eye coordinates)
    fV = (modelViewMatrix * vec4(position, 0.0)).xyz; // Vector from point to camera (in eye coordinates)
    
    // Array of vectors from the point to the lights (also in eye coordinates)
    for (int i=0; i<NUM_POINT_LIGHTS; i++) {
        fL[i] = pointLights[i].position - ((modelViewMatrix * vec4( position, 1.0 )).xyz);
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const phongFragment = `
in mediump vec3 fN;
in mediump vec3 fV;
in mediump vec3 fL[NUM_POINT_LIGHTS];

in vec2 vUv;

uniform vec3 ambientLightColor;
uniform float shininess;

uniform struct PointLight {
    vec3 position;
    vec3 color;
    float decay;
    float distance;
} pointLights[NUM_POINT_LIGHTS];

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform bool isStar;
uniform float time;

void main() {
    vec3 N = normalize(fN);
    vec3 V = normalize(fV);

    vec3 lightIntensity;
    vec4 texColor;

    if (isStar) {    
        vec2 position = -1.0 + (2.0 * vUv);

        vec4 noise = texture2D( texture1, vUv );
        vec2 T1 = vUv + vec2( 1.5, -1.5 ) * time * 0.02;
        vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;

        T1.x += noise.x * 2.0;
        T1.y += noise.y * 2.0;
        T2.x -= noise.y * 0.2;
        T2.y += noise.z * 0.2;

        float p = texture2D( texture1, T1 * 2.0 ).a;

        vec4 color = texture2D( texture2, T2 * 2.0 );
        texColor = color * (vec4( p ) * 2.0) + (color * color - 0.1);

        if (texColor.r > 1.0) { texColor.bg += clamp( texColor.r - 2.0, 0.0, 100.0 ); }
        if (texColor.g > 1.0) { texColor.rb += texColor.g - 1.0; }
        if (texColor.b > 1.0) { texColor.rg += texColor.b - 1.0; }

        lightIntensity = vec3( 1.0 );
    }

    else {
        vec3 ambient = ambientLightColor;
        lightIntensity += ambient;

        for (int i=0; i<NUM_POINT_LIGHTS; i++) {
            vec3 L = normalize( fL[i] );
            vec3 H = normalize( L+V );  // The half vector

            float d = length( fL[i] );  // Distance between light and point
            float attenuation = 1.0 / (pointLights[i].decay * d * d);

            float Kd = max( dot( L, N ), 0.0 );
            vec3 diffuse = Kd * pointLights[i].color * attenuation;

            float Ks = pow( max( dot( N, H ), 0.0 ), shininess );
            vec3 specular = vec3( Ks ) * attenuation;

            if ( dot( L, N ) < 0.0 ) {
                specular = vec3( 0.0, 0.0, 0.0 );    
            }

            lightIntensity += diffuse + specular;
        }

        vec4 dayTexColor = texture2D(texture1, vUv);
        vec4 nightTexColor = texture2D(texture2, vUv);

        if (dayTexColor == nightTexColor) {
            nightTexColor = nightTexColor * 0.3;
        }

        vec3 temp = lightIntensity - ambient;
        float temp2 = (temp.x + temp.y + temp.z) / 3.0;

        float dayNightSlider = min( temp2, 1.0 );

        texColor = mix(nightTexColor, dayTexColor, dayNightSlider);
    }

    gl_FragColor = vec4(lightIntensity, 1.0) * texColor;
}
`;