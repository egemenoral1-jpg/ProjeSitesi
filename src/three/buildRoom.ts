import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { STAIRS, TABLE, WALL_Z } from '../config/layout';
import { carpetTexture, pictureTexture, wallTexture, woodTexture } from './textures';
import { noOutline, PALETTE, thinOutline, toon } from './toon';

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

/**
 * The living room from the show: cream walls, pale green carpet, a yellow wooden
 * staircase on the right, a framed drawing and a lamp on the left, and a wooden
 * cabinet the TV stands on.
 */
export function buildRoom() {
  const room = new THREE.Group();
  const wallMat = toon(PALETTE.wall, { map: wallTexture() });
  const trim = toon(PALETTE.wallTrim);

  const wall = mesh(new THREE.PlaneGeometry(10, 3.4), wallMat, false);
  wall.position.set(0, 1.7, WALL_Z);
  room.add(wall);
  for (const s of [-1, 1]) {
    const side = mesh(new THREE.PlaneGeometry(6, 3.4), wallMat, false);
    side.position.set(s * 2.6, 1.7, WALL_Z + 3);
    side.rotation.y = -s * Math.PI / 2;
    room.add(side);
  }
  const skirting = mesh(new RoundedBoxGeometry(10, 0.1, 0.03, 2, 0.008), trim, false);
  skirting.position.set(0, 0.05, WALL_Z + 0.015);
  room.add(skirting);
  const crown = mesh(new RoundedBoxGeometry(10, 0.06, 0.04, 2, 0.01), trim, false);
  crown.position.set(0, 2.55, WALL_Z + 0.02);
  room.add(crown);

  const floor = mesh(new THREE.PlaneGeometry(10, 8), toon(PALETTE.carpet, { map: carpetTexture() }), false);
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = WALL_Z + 4;
  room.add(floor);

  room.add(buildCabinet(), buildStairs(), buildPicture(), buildLamp());
  return room;
}

/** Low wooden TV cabinet with two doors; its top is where the TV and tapes stand. */
function buildCabinet() {
  const g = new THREE.Group();
  const wood = toon(PALETTE.woodLight, { map: woodTexture() });
  const dark = toon(PALETTE.wood);
  const knob = thinOutline(toon('#e8c86a'));
  const bodyH = TABLE.topY - TABLE.thickness;
  const body = mesh(new RoundedBoxGeometry(TABLE.width - 0.06, bodyH, TABLE.depth - 0.05, 3, 0.02), dark);
  body.position.set(0, bodyH / 2, TABLE.z - 0.01);
  g.add(body);
  const top = mesh(new RoundedBoxGeometry(TABLE.width, TABLE.thickness, TABLE.depth, 3, 0.015), wood);
  top.position.set(0, TABLE.topY - TABLE.thickness / 2, TABLE.z);
  g.add(top);
  const frontZ = TABLE.z + TABLE.depth / 2 - 0.03;
  for (const s of [-1, 1]) {
    const door = mesh(new RoundedBoxGeometry(TABLE.width / 2 - 0.12, bodyH - 0.16, 0.025, 2, 0.01), wood, false);
    door.position.set(s * (TABLE.width / 4 - 0.01), bodyH / 2 + 0.02, frontZ);
    g.add(door);
    const k = mesh(new THREE.SphereGeometry(0.022, 16, 12), knob, false);
    k.position.set(s * 0.07, bodyH / 2 + 0.03, frontZ + 0.025);
    g.add(k);
  }
  return g;
}

/** Yellow wooden staircase climbing to the right, with balusters and a hand rail. */
function buildStairs() {
  const g = new THREE.Group();
  const tread = toon(PALETTE.stairTread);
  const riser = toon(PALETTE.stairRiser);
  const side = toon('#e6c460');
  const rail = toon(PALETTE.rail);
  const { startX, steps, run, rise, depth } = STAIRS;
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  for (let i = 0; i < steps; i++) {
    const h = rise * (i + 1);
    const step = mesh(new THREE.BoxGeometry(run, h, depth), [riser, riser, tread, side, side, side]);
    step.position.set(startX + i * run + run / 2, h / 2, WALL_Z + depth / 2);
    g.add(step);
  }
  const railZ = WALL_Z + depth - 0.04;
  const balusterH = 0.82;
  const baluster = new THREE.CylinderGeometry(0.016, 0.016, balusterH, 12);
  for (let i = 0; i < steps; i++) {
    for (const f of [0.28, 0.75]) {
      const b = mesh(baluster, rail);
      b.position.set(startX + (i + f) * run, rise * (i + 1) + balusterH / 2, railZ);
      g.add(b);
    }
  }
  // hand rail along the slope
  const x0 = startX;
  const y0 = rise + balusterH;
  const x1 = startX + steps * run;
  const y1 = rise * steps + balusterH;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const handrail = mesh(new RoundedBoxGeometry(len + 0.1, 0.06, 0.07, 2, 0.02), rail);
  handrail.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.03, railZ);
  handrail.rotation.z = Math.atan2(y1 - y0, x1 - x0);
  g.add(handrail);
  // newel post at the bottom
  const post = mesh(new RoundedBoxGeometry(0.09, 1.05, 0.09, 2, 0.015), rail);
  post.position.set(startX - 0.02, 0.525, railZ);
  g.add(post);
  const ball = mesh(new THREE.SphereGeometry(0.06, 20, 14), rail);
  ball.position.set(startX - 0.02, 1.1, railZ);
  g.add(ball);
  return g;
}

/** Framed pencil drawing on the wall. */
function buildPicture() {
  const g = new THREE.Group();
  const frame = mesh(new RoundedBoxGeometry(0.42, 0.52, 0.035, 2, 0.01), toon(PALETTE.frame), true);
  g.add(frame);
  const paper = mesh(new THREE.PlaneGeometry(0.34, 0.43), noOutline(toon('#ffffff', { map: pictureTexture() })), false);
  paper.position.z = 0.019;
  g.add(paper);
  g.position.set(-1.1, 1.5, WALL_Z + 0.02);
  return g;
}

/** Floor lamp with a warm shade. */
function buildLamp() {
  const g = new THREE.Group();
  const metal = toon('#6e6a73');
  const shadeMat = toon('#f7e6bd', { emissive: '#ffcf7a', emissiveIntensity: 0.25, side: THREE.DoubleSide });
  const base = mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 28), metal);
  base.position.y = 0.02;
  const pole = mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.45, 12), metal);
  pole.position.y = 0.745;
  const shade = mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.3, 28, 1, true), shadeMat);
  shade.position.y = 1.55;
  g.add(base, pole, shade);
  const glow = new THREE.PointLight('#ffd08a', 0.6, 2.4, 1.8);
  glow.position.y = 1.45;
  g.add(glow);
  g.position.set(-1.45, 0, -0.25);
  return g;
}

/** Bright, warm daytime light like the show; the TV adds its own flickering glow. */
export function buildLights(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight('#fff6e8', '#b9c99a', 1.25));

  const key = new THREE.DirectionalLight('#fff8ee', 1.45);
  key.position.set(-1.6, 3.4, 2.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -2.4;
  key.shadow.camera.right = 2.4;
  key.shadow.camera.top = 2.4;
  key.shadow.camera.bottom = -0.8;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 9;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const fill = new THREE.DirectionalLight('#dfe8ff', 0.45);
  fill.position.set(2.6, 1.8, 2.2);
  scene.add(fill);
}
