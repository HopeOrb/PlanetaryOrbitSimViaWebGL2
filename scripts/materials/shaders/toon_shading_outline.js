export const outlineVertex = `
uniform float thickness;

void main() {
    vec3 newPosition = position + normal * thickness;   // Each point towards its normal so the outline is bigger than the object
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`;

export const outlineFragment = `
uniform float strength;

void main() {
    gl_FragColor = vec4( vec3( -strength ), 1.0 );
}
`