import * as THREE from 'three';
import { TAPE } from '../config/layout';
import { tapeLabelTexture, tapeTopTexture } from './textures';

let sideMat: THREE.Material | null = null;
let topMat: THREE.Material | null = null;

/** A VHS cassette: black plastic box, reel windows on top, the coloured label on the front (+z). */
export function buildTapeMesh(label: string, color: string) {
  sideMat ??= new THREE.MeshPhysicalMaterial({ color: '#1e1e23', roughness: 0.38, clearcoat: 0.45, clearcoatRoughness: 0.3 });
  topMat ??= new THREE.MeshPhysicalMaterial({ map: tapeTopTexture(), roughness: 0.4, clearcoat: 0.4 });
  const front = new THREE.MeshStandardMaterial({ map: tapeLabelTexture(label, color), roughness: 0.55, emissive: '#ffffff', emissiveIntensity: 0 });
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(TAPE.w, TAPE.h, TAPE.d), [sideMat, sideMat, topMat, sideMat, front, sideMat]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return { mesh, front };
}
