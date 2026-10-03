import * as THREE from 'three';
import gsap from 'gsap';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { ARM, CAMERA, LEFT_STACK_COUNT, TAPE, TV, tapeHome, type StackId } from '../config/layout';
import { TAPES, type Tape } from '../data/tapes';
import { buildLights, buildRoom } from './buildRoom';
import { buildTV, type TVObject } from './buildTV';
import { buildTapeMesh } from './buildTape';
import { MordecaiArm } from './MordecaiArm';
import { loadFonts } from './textures';
import { PALETTE } from './toon';
import { setOutlineAspect } from './outline';

export type TapeState = 'home' | 'held' | 'loose';

/** A cassette in the scene. The animation code works with these, never with project data. */
export interface TapeObject {
  tape: Tape;
  mesh: THREE.Mesh;
  front: THREE.MeshToonMaterial;
  stack: StackId;
  slot: number;
  home: THREE.Vector3;
  homeRotY: number;
  state: TapeState;
  /** hover amount 0..1 (slides out and glows) */
  hover: number;
  /** vertical offset while a tape under it is missing */
  dropY: number;
}

export interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

export type CameraMode = 'idle' | 'tv' | 'free';

/**
 * Owns the three.js renderer, the room and everything in it, the camera rig,
 * pointer picking and the render loop. React only mounts the canvas and listens to callbacks.
 */
export class World {
  readonly renderer: THREE.WebGLRenderer;
  /** draws the dark cartoon contour around every object */
  private readonly outline: OutlineEffect;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.05, 40);
  /** the camera rig GSAP animates */
  readonly camPos = new THREE.Vector3();
  readonly camLook = new THREE.Vector3();
  cameraMode: CameraMode = 'idle';

  tv!: TVObject;
  tapes: TapeObject[] = [];
  arms!: Record<StackId, MordecaiArm>;

  interactive = false;
  onHover?: (t: TapeObject | null, at: { x: number; y: number } | null) => void;
  onSelect?: (t: TapeObject) => void;

  private readonly raycaster = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private hovered: TapeObject | null = null;
  private parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  private frozen = false;
  private raf = 0;
  private disposed = false;
  private readonly onResizeBound = () => this.resize();

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = new THREE.Color(PALETTE.wall);
    this.outline = new OutlineEffect(this.renderer, { defaultThickness: 0.0055, defaultColor: PALETTE.outline, defaultAlpha: 1 });
  }

  async build() {
    await loadFonts();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.35;
    pmrem.dispose();

    this.scene.add(buildRoom());
    buildLights(this.scene);
    this.tv = buildTV();
    this.scene.add(this.tv.group);

    TAPES.forEach((tape, i) => {
      const stack: StackId = i < LEFT_STACK_COUNT ? 'left' : 'right';
      const slot = stack === 'left' ? i : i - LEFT_STACK_COUNT;
      const { mesh, front } = buildTapeMesh(tape.label, tape.color);
      const h = tapeHome(stack, slot);
      // a little untidy, like a real pile of tapes
      const jitter = Math.sin(i * 12.9898) * 0.5;
      const home = new THREE.Vector3(h.x + jitter * 0.016, h.y, h.z + jitter * 0.012);
      const t: TapeObject = { tape, mesh, front, stack, slot, home, homeRotY: jitter * 0.09, state: 'home', hover: 0, dropY: 0 };
      mesh.userData.tape = t;
      this.scene.add(mesh);
      this.tapes.push(t);
    });

    this.arms = { left: new MordecaiArm('left'), right: new MordecaiArm('right') };
    this.scene.add(this.arms.left.root, this.arms.right.root);

    this.camera.aspect = 16 / 9; // sensible default until the canvas has a size
    this.resize();
    const idle = this.idlePose();
    this.camPos.copy(idle.pos);
    this.camLook.copy(idle.look);

    window.addEventListener('resize', this.onResizeBound);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
    this.canvas.addEventListener('click', this.onClick);
    window.addEventListener('pointermove', this.onParallax, { passive: true });
    this.loop();
  }

  // ---------------------------------------------------------------- camera

  private get portrait() {
    return this.camera.aspect < 0.95;
  }

  /** Whole table in view: TV plus both tape stacks. */
  idlePose(): Pose {
    const look = new THREE.Vector3(CAMERA.look.x, CAMERA.look.y, CAMERA.look.z);
    const half = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const hHalf = Math.atan(Math.tan(half) * this.camera.aspect);
    const fit = this.portrait ? CAMERA.fitHalfWidth * 0.97 : CAMERA.fitHalfWidth;
    const d = Math.max(1.35, fit / Math.tan(hHalf));
    return { pos: new THREE.Vector3(look.x, CAMERA.height + (d - 1.5) * 0.06, look.z + d), look };
  }

  /** Lean in toward something (a tape, the slot). */
  focusPose(target: THREE.Vector3, amount = 0.25): Pose {
    const idle = this.idlePose();
    return { pos: idle.pos.clone().lerp(target, amount), look: idle.look.clone().lerp(target, 0.55) };
  }

  /** Straight in front of the screen, filling most of the viewport. */
  tvPose(): Pose {
    const s = TV.screen;
    const look = new THREE.Vector3(s.x, s.y, TV.frontZ);
    const half = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const fitH = (s.h / 2 / 0.86) / Math.tan(half);
    const fitW = (s.w / 2 / 0.92) / (Math.tan(half) * this.camera.aspect);
    const d = Math.max(fitH, fitW);
    return { pos: new THREE.Vector3(s.x, s.y, TV.frontZ + 0.016 + d), look };
  }

  /** Screen rectangle in CSS pixels, for the HTML overlay that shows the project. */
  screenRect() {
    const s = TV.screen;
    const z = TV.frontZ + 0.02;
    const pts = [
      new THREE.Vector3(s.x - s.w / 2, s.y - s.h / 2, z),
      new THREE.Vector3(s.x + s.w / 2, s.y + s.h / 2, z),
    ].map((p) => this.toScreen(p));
    return {
      left: Math.min(pts[0].x, pts[1].x),
      top: Math.min(pts[0].y, pts[1].y),
      width: Math.abs(pts[1].x - pts[0].x),
      height: Math.abs(pts[1].y - pts[0].y),
    };
  }

  toScreen(p: THREE.Vector3) {
    const r = this.canvas.getBoundingClientRect();
    const v = p.clone().project(this.camera);
    return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
  }

  /** Put the shoulders just outside the bottom corners of the idle view, long enough to reach `targets`. */
  prepareArm(arm: MordecaiArm, targets: THREE.Vector3[]) {
    const idle = this.idlePose();
    const fwd = idle.look.clone().sub(idle.pos).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
    const k = idle.pos.distanceTo(idle.look) / 1.55;
    const sc = ARM.shoulderCam;
    const shoulder = idle.pos
      .clone()
      .addScaledVector(right, arm.sign * sc.x * k)
      .addScaledVector(up, sc.y * k)
      .addScaledVector(fwd, -sc.z * k);
    const need = Math.max(...targets.map((t) => t.distanceTo(shoulder)));
    arm.configure(shoulder, need);
    return { shoulder, rest: shoulder.clone().addScaledVector(fwd, 0.18 * k).addScaledVector(up, -0.06 * k) };
  }

  setFrozen(on: boolean) {
    this.frozen = on;
    if (on) this.setHovered(null);
  }

  // ---------------------------------------------------------------- input

  private pick(e: PointerEvent | MouseEvent) {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.tapes.filter((t) => t.state === 'home').map((t) => t.mesh),
      false,
    );
    return hits.length ? (hits[0].object.userData.tape as TapeObject) : null;
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.interactive) return;
    this.setHovered(this.pick(e));
  };

  private onPointerLeave = () => this.setHovered(null);

  private onClick = (e: MouseEvent) => {
    if (!this.interactive) return;
    const t = this.pick(e);
    if (t) this.onSelect?.(t);
  };

  private onParallax = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    this.parallax.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.parallax.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private setHovered(t: TapeObject | null) {
    if (t === this.hovered) return;
    if (this.hovered) gsap.to(this.hovered, { hover: 0, duration: 0.3, ease: 'power2.out' });
    this.hovered = t;
    if (t) gsap.to(t, { hover: 1, duration: 0.3, ease: 'back.out(2)' });
    this.canvas.style.cursor = t ? 'pointer' : '';
    this.onHover?.(t, t ? this.tapeLabelPoint(t) : null);
  }

  tapeLabelPoint(t: TapeObject) {
    return this.toScreen(new THREE.Vector3(t.home.x, t.home.y + TAPE.h / 2 + t.dropY, t.home.z + TAPE.d / 2));
  }

  // ---------------------------------------------------------------- frame

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (!w || !h) return; // hidden / not laid out yet: keep the last good size
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    setOutlineAspect(this.camera.aspect);
    this.camera.fov = this.portrait ? CAMERA.portraitFov : CAMERA.fov;
    this.camera.updateProjectionMatrix();
    const pose = this.cameraMode === 'idle' ? this.idlePose() : this.cameraMode === 'tv' ? this.tvPose() : null;
    if (pose) {
      this.camPos.copy(pose.pos);
      this.camLook.copy(pose.look);
    }
  }

  /** One frame. Public so tests can step the world in a background tab. */
  tick(now = performance.now()) {
    const p = this.parallax;
    const tx = this.frozen ? 0 : p.tx;
    const ty = this.frozen ? 0 : p.ty;
    p.x += (tx - p.x) * 0.05;
    p.y += (ty - p.y) * 0.05;
    this.camera.position.set(this.camPos.x + p.x * 0.05, this.camPos.y - p.y * 0.03, this.camPos.z);
    this.camera.lookAt(this.camLook);

    for (const t of this.tapes) {
      t.front.emissiveIntensity = t.hover * 0.22;
      if (t.state !== 'home') continue;
      const out = t.stack === 'left' ? -1 : 1;
      t.mesh.position.set(t.home.x + out * 0.02 * t.hover, t.home.y + t.dropY + 0.006 * t.hover, t.home.z + 0.05 * t.hover);
      t.mesh.rotation.set(0, t.homeRotY * (1 - t.hover) + out * 0.06 * t.hover, 0);
    }

    this.tv.screen.update(now);
    const b = this.tv.screen.brightness();
    this.tv.light.intensity = 0.9 * b * (0.92 + Math.random() * 0.08);
    this.arms.left.update();
    this.arms.right.update();
    this.outline.render(this.scene, this.camera);
  }

  private loop = () => {
    if (this.disposed) return;
    this.tick();
    this.raf = requestAnimationFrame(this.loop);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResizeBound);
    window.removeEventListener('pointermove', this.onParallax);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.removeEventListener('click', this.onClick);
    this.renderer.dispose();
  }
}

let instance: World | null = null;
export const setWorld = (w: World | null) => {
  instance = w;
};
export function getWorld() {
  if (!instance) throw new Error('3D world is not ready');
  return instance;
}
