import gsap from 'gsap';
import type * as THREE from 'three';
import type { CameraState } from '../state/machine';
import { getWorld, type Pose } from '../three/World';
import { run, tweenVec } from './rig';

/** Smoothly move the 3D camera rig to one of the camera states. */
export function setCamera(state: CameraState, focus?: THREE.Vector3) {
  const w = getWorld();
  let pose: Pose;
  let duration = 1.1;
  let ease = 'power3.inOut';
  switch (state) {
    case 'CASSETTE_FOCUS_CAMERA':
      pose = focus ? w.focusPose(focus, 0.22) : w.idlePose();
      w.cameraMode = 'free';
      break;
    case 'TV_CAMERA':
      pose = w.tvPose();
      w.cameraMode = 'tv';
      duration = 1.6;
      break;
    case 'RETURN_CAMERA':
    case 'IDLE_CAMERA':
    default:
      pose = w.idlePose();
      w.cameraMode = 'idle';
      duration = state === 'RETURN_CAMERA' ? 1.3 : 0.01;
      ease = 'power2.inOut';
  }
  const tl = gsap.timeline();
  tl.add(tweenVec(w.camPos, pose.pos, duration, ease), 0);
  tl.add(tweenVec(w.camLook, pose.look, duration, ease), 0);
  return run(tl);
}
