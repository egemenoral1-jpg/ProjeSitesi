import * as THREE from 'three';
import { TAPE } from '../config/layout';
import { tapeLabelTexture, tapeTopTexture } from './textures';
import { toon } from './toon';

let sideMat: THREE.Material | null = null;
let topMat: THREE.Material | null = null;

/** A VHS cassette: black plastic box, reel windows on top, the coloured label on the front (+z). */
export function buildTapeMesh(label: string, color: string) {
  sideMat ??= toon('#2a2a31');
  topMat ??= toon('#ffffff', { map: tapeTopTexture() });
  const front = toon('#ffffff', { map: tapeLabelTexture(label, color), emissive: '#ffffff', emissiveIntensity: 0 });
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(TAPE.w, TAPE.h, TAPE.d), [sideMat, sideMat, topMat, sideMat, front, sideMat]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return { mesh, front };
}
