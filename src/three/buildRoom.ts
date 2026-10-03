import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { TABLE, WALL_Z } from '../config/layout';
import { floorTexture, wallpaperTexture, woodTexture } from './textures';

/** Wall, grey upper strip, floor and the wooden table. */
export function buildRoom() {
  const room = new THREE.Group();

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 3.3),
    new THREE.MeshStandardMaterial({ map: wallpaperTexture(), roughness: 0.95 }),
  );
  wall.position.set(0, 3.3 / 2, WALL_Z);
  wall.receiveShadow = true;
  room.add(wall);

  // light grey strip at the top of the wall, like the show
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(9, 2), new THREE.MeshStandardMaterial({ color: '#a9a8b1', roughness: 0.95 }));
  strip.position.set(0, 1.68 + 1, WALL_Z + 0.002);
  strip.receiveShadow = true;
  room.add(strip);

  const trimMat = new THREE.MeshStandardMaterial({ color: '#2b2238', roughness: 0.7 });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(9, 0.035, 0.03), trimMat);
  rail.position.set(0, 1.68, WALL_Z + 0.015);
  rail.castShadow = true;
  room.add(rail);
  const skirting = new THREE.Mesh(new THREE.BoxGeometry(9, 0.12, 0.025), trimMat);
  skirting.position.set(0, 0.06, WALL_Z + 0.012);
  room.add(skirting);

  // side walls for very wide screens
  for (const s of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.3), new THREE.MeshStandardMaterial({ map: wallpaperTexture(), roughness: 0.95 }));
    side.position.set(s * 3.2, 3.3 / 2, WALL_Z + 3);
    side.rotation.y = -s * Math.PI / 2;
    room.add(side);
  }

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 8), new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.82 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = WALL_Z + 4;
  floor.receiveShadow = true;
  room.add(floor);

  // table
  const wood = new THREE.MeshPhysicalMaterial({ map: woodTexture(), roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.45 });
  const woodDark = new THREE.MeshStandardMaterial({ color: '#7a4c26', roughness: 0.7 });
  const top = new THREE.Mesh(new RoundedBoxGeometry(TABLE.width, TABLE.thickness, TABLE.depth, 3, 0.012), wood);
  top.position.set(0, TABLE.topY - TABLE.thickness / 2, TABLE.z);
  top.castShadow = true;
  top.receiveShadow = true;
  room.add(top);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(TABLE.width - 0.12, 0.1, 0.03), woodDark);
  apron.position.set(0, TABLE.topY - TABLE.thickness - 0.05, TABLE.z + TABLE.depth / 2 - 0.06);
  apron.castShadow = true;
  room.add(apron);
  const legH = TABLE.topY - TABLE.thickness;
  for (const lx of [-1, 1]) {
    for (const lz of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.065, legH, 0.065), woodDark);
      leg.position.set(lx * (TABLE.width / 2 - 0.1), legH / 2, TABLE.z + lz * (TABLE.depth / 2 - 0.08));
      leg.castShadow = true;
      room.add(leg);
    }
  }
  return room;
}

/** Soft, warm late-evening lighting; the TV adds its own light (see buildTV). */
export function buildLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight('#d9d2ff', '#4a3428', 0.75));

  const key = new THREE.DirectionalLight('#fff0dc', 1.55);
  key.position.set(-1.4, 3.2, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1.8;
  key.shadow.camera.right = 1.8;
  key.shadow.camera.top = 1.6;
  key.shadow.camera.bottom = -0.6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 8;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key);

  const fill = new THREE.DirectionalLight('#a9b6ff', 0.35);
  fill.position.set(2.5, 1.6, 2);
  scene.add(fill);
}
