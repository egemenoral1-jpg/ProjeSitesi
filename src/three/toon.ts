import * as THREE from 'three';

/**
 * Cartoon (cel) shading: three flat light bands instead of smooth lighting.
 * Together with the OutlineEffect in World this gives the drawn, Regular Show look.
 */
let gradient: THREE.DataTexture | null = null;

function gradientMap() {
  if (gradient) return gradient;
  const tones = new Uint8Array([90, 175, 255]);
  gradient = new THREE.DataTexture(tones, tones.length, 1, THREE.RedFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

export function toon(color: THREE.ColorRepresentation, extra: THREE.MeshToonMaterialParameters = {}) {
  return new THREE.MeshToonMaterial({ color, gradientMap: gradientMap(), ...extra });
}

/** Hide the cartoon outline for a material (glass, glowing screen...). */
export function noOutline<T extends THREE.Material>(m: T) {
  m.userData.outlineParameters = { visible: false };
  return m;
}

/** Thinner outline for small parts. */
export function thinOutline<T extends THREE.Material>(m: T, thickness = 0.0025) {
  m.userData.outlineParameters = { thickness };
  return m;
}

/** Regular Show living room palette. */
export const PALETTE = {
  wall: '#f8e7cb',
  wallTrim: '#fff3dc',
  carpet: '#a9c48a',
  stairTread: '#ecc95c',
  stairRiser: '#f5e09a',
  rail: '#e3bd47',
  wood: '#8c5a35',
  woodLight: '#a8714a',
  tvGrey: '#8c8d95',
  tvDark: '#5d5e66',
  frame: '#5b5862',
  mordecai: '#6faaf0',
  mordecaiDark: '#4d8ad8',
  white: '#fbfbf7',
  outline: [0.1, 0.09, 0.14] as [number, number, number],
};
