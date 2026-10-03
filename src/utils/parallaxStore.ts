import gsap from 'gsap';

interface Layer {
  qx: (v: number) => void;
  qy: (v: number) => void;
  amp: number;
}

const layers = new Set<Layer>();
let frozen = false;
let mx = 0;
let my = 0;

/** Register a layer element; returns an unregister function. */
export function registerLayer(el: HTMLElement, amp: number) {
  const layer: Layer = {
    qx: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    qy: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
    amp,
  };
  layers.add(layer);
  return () => void layers.delete(layer);
}

function apply() {
  const x = frozen ? 0 : mx;
  const y = frozen ? 0 : my;
  layers.forEach((l) => {
    l.qx(-x * l.amp);
    l.qy(-y * l.amp * 0.6);
  });
}

/** Normalised pointer position, -1..1 from the centre of the screen. */
export function setPointer(nx: number, ny: number) {
  mx = nx;
  my = ny;
  apply();
}

/** The room holds still while the cinematic plays, so hands line up exactly. */
export function freezeParallax(on: boolean) {
  frozen = on;
  apply();
}
