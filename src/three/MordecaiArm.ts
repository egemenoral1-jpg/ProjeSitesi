import * as THREE from 'three';
import { ARM, TAPE } from '../config/layout';
import type { StackId } from '../config/layout';

export type GripMode = 'end' | 'front';

const UP = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();
const mat = new THREE.Matrix4();

/** How far the palm centre sits from the wrist, along the fingers. */
const PALM_OFFSET = 0.055;

/**
 * One of Mordecai's arms: shoulder -> elbow -> wrist solved with two-bone IK,
 * a hand with three-segment feather-like fingers and a thumb that curl to grip,
 * and the two white bands near the wrist.
 *
 * It is driven by plain numbers so GSAP can tween them:
 *   wrist   - where the wrist should be (world space)
 *   finger  - direction the fingers point
 *   palm    - direction the palm faces
 *   curl    - 0 open ... 1 fist
 */
export class MordecaiArm {
  readonly root = new THREE.Group();
  readonly sign: number;
  readonly shoulder = new THREE.Vector3();
  readonly wrist = new THREE.Vector3();
  readonly finger = new THREE.Vector3(0, 1, 0);
  readonly palm = new THREE.Vector3(0, 0, -1);
  curl = 0.15;
  private upperLen: number = ARM.upper;
  private foreLen: number = ARM.fore;

  private readonly upper = new THREE.Group();
  private readonly fore = new THREE.Group();
  private readonly upperMesh: THREE.Mesh;
  private readonly foreMesh: THREE.Mesh;
  private readonly bands: THREE.Mesh[] = [];
  private readonly shoulderBall: THREE.Mesh;
  private readonly elbowBall: THREE.Mesh;
  private readonly wristBall: THREE.Mesh;
  private readonly hand = new THREE.Group();
  private readonly fingers: THREE.Group[][] = [];
  private readonly thumb: THREE.Group[] = [];

  /** the tape currently in this hand */
  held: { obj: THREE.Object3D; mode: GripMode } | null = null;

  constructor(readonly side: StackId) {
    this.sign = side === 'right' ? 1 : -1;
    const blue = new THREE.MeshPhysicalMaterial({ color: '#4aa3e6', roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.5, sheen: 0.4, sheenColor: new THREE.Color('#bfe3ff') });
    const blueDark = new THREE.MeshPhysicalMaterial({ color: '#3a8fd4', roughness: 0.5, clearcoat: 0.25 });
    const white = new THREE.MeshPhysicalMaterial({ color: '#f6f8fb', roughness: 0.55, clearcoat: 0.2 });
    const r = ARM.radius;

    // limbs are unit-length cylinders scaled along y
    this.upperMesh = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.98, r * 1.12, 1, 28, 1, true), blue);
    this.upper.add(this.upperMesh);
    this.foreMesh = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.82, r * 0.96, 1, 28, 1, true), blue);
    this.fore.add(this.foreMesh);
    for (let i = 0; i < 2; i++) {
      const band = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.93, r * 0.95, 0.03, 28), white);
      this.bands.push(band);
      this.fore.add(band);
    }
    this.shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(r * 1.12, 24, 16), blue);
    this.elbowBall = new THREE.Mesh(new THREE.SphereGeometry(r * 0.99, 24, 16), blue);
    this.wristBall = new THREE.Mesh(new THREE.SphereGeometry(r * 0.83, 24, 16), blue);
    this.root.add(this.upper, this.fore, this.shoulderBall, this.elbowBall, this.wristBall, this.hand);

    this.buildHand(blue, blueDark);
    this.root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    this.root.visible = false;
  }

  /** Hand in local space: fingers along +y, palm facing -z, knuckles +z. */
  private buildHand(blue: THREE.Material, blueDark: THREE.Material) {
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), blue);
    palm.scale.set(0.046, 0.054, 0.021);
    palm.position.set(0, 0.05, 0);
    this.hand.add(palm);
    const knuckles = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.06, 6, 12), blue);
    knuckles.rotation.z = Math.PI / 2;
    knuckles.position.set(0, 0.092, 0.002);
    this.hand.add(knuckles);

    // Mordecai's fingers: long, tapering, pointed like feathers
    const fingerX = [-0.031, -0.0105, 0.0105, 0.031];
    const splay = [0.16, 0.05, -0.05, -0.16];
    const scale = [0.86, 1, 0.97, 0.8];
    fingerX.forEach((fx, i) => {
      const s = scale[i];
      const lens = [0.036 * s, 0.03 * s, 0.03 * s];
      const rads = [0.0105, 0.0094, 0.0084];
      const joints: THREE.Group[] = [];
      let parent: THREE.Object3D = this.hand;
      lens.forEach((len, j) => {
        const joint = new THREE.Group();
        if (j === 0) {
          joint.position.set(fx, 0.098, 0);
          joint.rotation.z = splay[i];
        } else {
          joint.position.y = lens[j - 1];
        }
        const seg =
          j < 2
            ? new THREE.Mesh(new THREE.CapsuleGeometry(rads[j], len, 6, 12), j === 0 ? blue : blue)
            : new THREE.Mesh(new THREE.ConeGeometry(rads[j], len * 1.25, 14), blueDark);
        seg.position.y = j < 2 ? len / 2 : (len * 1.25) / 2;
        joint.add(seg);
        parent.add(joint);
        parent = joint;
        joints.push(joint);
      });
      this.fingers.push(joints);
    });

    // thumb on the side that faces the camera when the hand holds a tape from above
    const tx = -this.sign * 0.044;
    let parent: THREE.Object3D = this.hand;
    [0.032, 0.03].forEach((len, j) => {
      const joint = new THREE.Group();
      if (j === 0) {
        joint.position.set(tx, 0.03, -0.006);
        joint.rotation.z = this.sign * 0.85;
      } else {
        joint.position.y = 0.032;
      }
      const seg = j === 0 ? new THREE.Mesh(new THREE.CapsuleGeometry(0.0125, len, 6, 12), blue) : new THREE.Mesh(new THREE.ConeGeometry(0.011, len * 1.3, 14), blueDark);
      seg.position.y = j === 0 ? len / 2 : (len * 1.3) / 2;
      joint.add(seg);
      parent.add(joint);
      parent = joint;
      this.thumb.push(joint);
    });
  }

  /** Anchor the shoulder and make the arm long enough to reach `need` metres. */
  configure(shoulder: THREE.Vector3, need: number) {
    this.shoulder.copy(shoulder);
    const total = Math.max(ARM.upper + ARM.fore, need * 1.04);
    this.upperLen = total * 0.51;
    this.foreLen = total * 0.49;
    this.upperMesh.scale.y = this.upperLen;
    this.upperMesh.position.y = this.upperLen / 2;
    this.foreMesh.scale.y = this.foreLen;
    this.foreMesh.position.y = this.foreLen / 2;
    this.bands[0].position.y = this.foreLen - 0.05;
    this.bands[1].position.y = this.foreLen - 0.1;
  }

  get visible() {
    return this.root.visible;
  }
  set visible(v: boolean) {
    this.root.visible = v;
  }

  /** Palm centre for a given wrist position and finger direction. */
  static palmCentre(wrist: THREE.Vector3, finger: THREE.Vector3, out = new THREE.Vector3()) {
    return out.copy(finger).normalize().multiplyScalar(PALM_OFFSET).add(wrist);
  }

  /** Where the tape centre is when this hand holds it in `mode`. */
  tapeCentre(mode: GripMode, palmCentre: THREE.Vector3, out = new THREE.Vector3()) {
    if (mode === 'end') {
      // palm on top of the tape near its outer end, fingers over the top
      return out.set(-this.sign * (TAPE.w / 2 - 0.045), -(0.024 + TAPE.h / 2), 0).add(palmCentre);
    }
    // palm pressed on the label side, near the outer end
    return out.set(-this.sign * 0.075, 0, -(0.02 + TAPE.d / 2)).add(palmCentre);
  }

  /** Inverse of tapeCentre: wrist position that holds a tape centred on `centre`. */
  wristFor(mode: GripMode, centre: THREE.Vector3, finger: THREE.Vector3, out = new THREE.Vector3()) {
    const offset = this.tapeCentre(mode, tmp2.set(0, 0, 0), tmp);
    const palmCentre = out.copy(centre).sub(offset);
    return palmCentre.sub(tmp.copy(finger).normalize().multiplyScalar(PALM_OFFSET));
  }

  hold(obj: THREE.Object3D, mode: GripMode) {
    this.held = { obj, mode };
  }
  release() {
    this.held = null;
  }

  update() {
    if (!this.root.visible) return;
    const S = this.shoulder;
    const a = this.upperLen;
    const b = this.foreLen;

    // two-bone IK
    const d = tmp.copy(this.wrist).sub(S);
    const dist = THREE.MathUtils.clamp(d.length(), Math.abs(a - b) + 1e-3, a + b - 1e-4);
    const dir = d.normalize();
    const cosA = THREE.MathUtils.clamp((a * a + dist * dist - b * b) / (2 * a * dist), -1, 1);
    const sinA = Math.sqrt(1 - cosA * cosA);
    // the elbow bends outwards and down
    const pole = tmp2.set(this.sign * 0.8, -0.18, 0.35);
    pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
    const elbow = new THREE.Vector3().copy(S).addScaledVector(dir, a * cosA).addScaledVector(pole, a * sinA);
    const wrist = new THREE.Vector3().copy(S).addScaledVector(dir, dist);

    this.place(this.upper, S, elbow);
    this.place(this.fore, elbow, wrist);
    this.shoulderBall.position.copy(S);
    this.elbowBall.position.copy(elbow);
    this.wristBall.position.copy(wrist);

    // hand orientation from finger direction and palm normal
    const F = this.finger.clone().normalize();
    const K = this.palm.clone().negate().normalize(); // knuckle side
    const X = new THREE.Vector3().crossVectors(F, K);
    if (X.lengthSq() < 1e-6) X.set(1, 0, 0);
    X.normalize();
    const Z = new THREE.Vector3().crossVectors(X, F).normalize();
    mat.makeBasis(X, F, Z);
    this.hand.quaternion.setFromRotationMatrix(mat);
    this.hand.position.copy(wrist);

    // finger curl (toward the palm = negative x rotation)
    const c = this.curl;
    this.fingers.forEach((joints) => {
      joints[0].rotation.x = -c * 0.95;
      joints[1].rotation.x = -c * 1.15;
      joints[2].rotation.x = -c * 0.85;
    });
    this.thumb[0].rotation.x = -c * 0.6;
    this.thumb[1].rotation.x = -c * 0.8;

    // carry the tape
    if (this.held) {
      const pc = MordecaiArm.palmCentre(wrist, F, new THREE.Vector3());
      this.tapeCentre(this.held.mode, pc, this.held.obj.position);
      const rot = this.held.obj.rotation;
      rot.set(rot.x * 0.85, rot.y * 0.85, rot.z * 0.85);
    }
  }

  private place(group: THREE.Group, from: THREE.Vector3, to: THREE.Vector3) {
    group.position.copy(from);
    group.quaternion.setFromUnitVectors(UP, new THREE.Vector3().subVectors(to, from).normalize());
  }
}
