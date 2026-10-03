import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { TABLE, TV } from '../config/layout';
import { ScreenTexture } from './ScreenTexture';

export interface TVObject {
  group: THREE.Group;
  screen: ScreenTexture;
  light: THREE.PointLight;
  led: THREE.MeshStandardMaterial;
}

/** A CRT television with a built-in VCR, front facing +z. */
export function buildTV(): TVObject {
  const g = new THREE.Group();
  const plastic = new THREE.MeshPhysicalMaterial({ color: '#2a2a30', roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.35 });
  const plasticDark = new THREE.MeshPhysicalMaterial({ color: '#1d1d22', roughness: 0.45, clearcoat: 0.3 });
  const bezel = new THREE.MeshPhysicalMaterial({ color: '#4b4b55', roughness: 0.5, clearcoat: 0.2 });
  const black = new THREE.MeshStandardMaterial({ color: '#060607', roughness: 0.65 });
  const grey = new THREE.MeshStandardMaterial({ color: '#9b9ba4', roughness: 0.45 });
  const add = (m: THREE.Mesh, shadow = true) => {
    m.castShadow = shadow;
    m.receiveShadow = true;
    g.add(m);
    return m;
  };

  const baseTop = TABLE.topY + TV.baseH;
  const bodyY = baseTop + TV.bodyH / 2;

  // body + CRT tube behind it
  add(new THREE.Mesh(new RoundedBoxGeometry(TV.width, TV.bodyH, TV.bodyDepth, 4, 0.035), plastic)).position.set(0, bodyY, TV.frontZ - TV.bodyDepth / 2);
  const tube = add(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 0.34, 4, 1), plastic));
  tube.rotation.x = -Math.PI / 2;
  tube.rotateY(Math.PI / 4);
  tube.position.set(0, bodyY, TV.frontZ - TV.bodyDepth - 0.15);

  // screen: bezel, dark well, curved picture, glass
  const s = TV.screen;
  add(new THREE.Mesh(new RoundedBoxGeometry(s.w + 0.07, s.h + 0.065, 0.024, 3, 0.022), bezel)).position.set(s.x, s.y, TV.frontZ + 0.004);
  add(new THREE.Mesh(new THREE.BoxGeometry(s.w + 0.012, s.h + 0.012, 0.01), black), false).position.set(s.x, s.y, TV.frontZ + 0.012);

  const screen = new ScreenTexture();
  const curved = new THREE.PlaneGeometry(s.w, s.h, 24, 18);
  const pos = curved.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i) / (s.w / 2);
    const ny = pos.getY(i) / (s.h / 2);
    pos.setZ(i, 0.016 * (1 - nx * nx * 0.7) * (1 - ny * ny * 0.7));
  }
  curved.computeVertexNormals();
  const picture = new THREE.Mesh(curved, new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false }));
  picture.position.set(s.x, s.y, TV.frontZ + 0.012);
  g.add(picture);
  const glass = new THREE.Mesh(
    curved.clone(),
    new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.1, roughness: 0.06, metalness: 0, clearcoat: 1, envMapIntensity: 2.2 }),
  );
  glass.position.set(s.x, s.y, TV.frontZ + 0.0145);
  g.add(glass);

  // side panel: display, keypad, speaker slats, button, power LED
  const px = s.x + s.w / 2 + 0.035 + (TV.width / 2 - (s.x + s.w / 2 + 0.035)) / 2;
  const z = TV.frontZ;
  add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.032, 0.01), black), false).position.set(px, 1.37, z + 0.004);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      add(new THREE.Mesh(new RoundedBoxGeometry(0.023, 0.018, 0.012, 2, 0.004), grey), false).position.set(px + (c - 1) * 0.031, 1.322 - r * 0.026, z + 0.005);
    }
  }
  for (let i = 0; i < 8; i++) {
    add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.0075, 0.006), black), false).position.set(px, 1.15 - i * 0.017, z + 0.002);
  }
  add(new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.018, 0.012, 2, 0.004), grey), false).position.set(px - 0.012, 0.985, z + 0.005);
  const led = new THREE.MeshStandardMaterial({ color: '#330808', emissive: '#ff2a2a', emissiveIntensity: 0.15 });
  add(new THREE.Mesh(new THREE.SphereGeometry(0.0055, 12, 8), led), false).position.set(px + 0.038, 0.985, z + 0.004);

  // VCR base: slot, round buttons, little grilles
  add(new THREE.Mesh(new RoundedBoxGeometry(TV.width, TV.baseH, TV.baseDepth, 3, 0.02), plasticDark)).position.set(0, TABLE.topY + TV.baseH / 2, TV.frontZ - TV.baseDepth / 2);
  const sl = TV.slot;
  add(new THREE.Mesh(new THREE.BoxGeometry(sl.w, sl.h, 0.012), black), false).position.set(sl.x, sl.y, z + 0.001);
  add(new THREE.Mesh(new THREE.BoxGeometry(sl.w + 0.024, 0.01, 0.016), plastic)).position.set(sl.x, sl.y + sl.h / 2 + 0.005, z + 0.004);
  add(new THREE.Mesh(new THREE.BoxGeometry(sl.w + 0.024, 0.01, 0.016), plastic)).position.set(sl.x, sl.y - sl.h / 2 - 0.005, z + 0.004);
  const btnGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.012, 24);
  for (const bx of [-0.335, -0.297, -0.259, 0.259, 0.297, 0.335]) {
    const b = add(new THREE.Mesh(btnGeo, grey), false);
    b.rotation.x = Math.PI / 2;
    b.position.set(bx, sl.y + 0.02, z + 0.004);
  }
  for (const gx of [-0.297, 0.297]) {
    for (let i = 0; i < 3; i++) {
      add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.005, 0.004), black), false).position.set(gx, sl.y - 0.012 - i * 0.012, z + 0.002);
    }
  }

  const light = new THREE.PointLight('#cfe0ff', 0.6, 3.2, 1.6);
  light.position.set(s.x, s.y, TV.frontZ + 0.4);
  g.add(light);

  return { group: g, screen, light, led };
}
