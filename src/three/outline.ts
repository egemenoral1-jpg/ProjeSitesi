import * as THREE from 'three';

/**
 * Screen-space "inverted hull" outlines for objects close to the camera (Mordecai's arm).
 *
 * three's OutlineEffect offsets vertices by a 1-unit normal in clip space, which gets very
 * thin (and spiky on pointed tips) for small objects near the camera. Here every vertex of a
 * back-facing copy is pushed outward along its normal *in screen space*, so the black line has
 * the same thickness wherever the arm is - like the ink lines in the show.
 */
const aspect = { value: 16 / 9 };

export function setOutlineAspect(a: number) {
  aspect.value = a;
}

/** thickness: fraction of the screen height (0.01 is about 3.5 px on a 720 px screen). */
export function hullMaterial(thickness: number, color: THREE.ColorRepresentation = '#000000') {
  const m = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: thickness },
      color: { value: new THREE.Color(color) },
      aspect,
    },
    vertexShader: /* glsl */ `
      uniform float thickness;
      uniform float aspect;
      void main() {
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 clipN = projectionMatrix * modelViewMatrix * vec4(position + normal * 0.002, 1.0);
        vec2 dir = clipN.xy / clipN.w - clip.xy / clip.w;
        dir.x *= aspect;
        float len = length(dir);
        dir = len > 1e-7 ? dir / len : vec2(0.0);
        dir.x /= aspect;
        clip.xy += dir * thickness * clip.w;
        gl_Position = clip;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      void main() { gl_FragColor = vec4(color, 1.0); }
    `,
    side: THREE.BackSide,
  });
  // never outline the outline
  m.userData.outlineParameters = { visible: false };
  return m;
}

/** Give every mesh under `root` a black hull. Meshes whose material has `noHull` in userData are skipped. */
export function addHulls(root: THREE.Object3D, thicknessFor: (mesh: THREE.Mesh) => number) {
  const cache = new Map<number, THREE.ShaderMaterial>();
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && !(o as THREE.Mesh).userData.isHull) meshes.push(o as THREE.Mesh);
  });
  for (const mesh of meshes) {
    const t = thicknessFor(mesh);
    if (t <= 0) continue;
    let mat = cache.get(t);
    if (!mat) {
      mat = hullMaterial(t);
      cache.set(t, mat);
    }
    const hull = new THREE.Mesh(mesh.geometry, mat);
    hull.userData.isHull = true;
    hull.castShadow = false;
    hull.receiveShadow = false;
    mesh.add(hull);
  }
}
