import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Black screen -> two short lines -> fade into the room. Click or key skips it.
 * It never fades out before the 3D room is `ready`.
 */
export function IntroSequence({ onDone, ready }: { onDone: () => void; ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLParagraphElement>(null);
  const l2 = useRef<HTMLParagraphElement>(null);
  const readyRef = useRef(ready);
  const pending = useRef(false);
  const finished = useRef(false);

  const finish = useRef(() => {
    if (finished.current) return;
    if (!readyRef.current) {
      pending.current = true;
      return;
    }
    finished.current = true;
    gsap.to(root.current, { autoAlpha: 0, duration: 0.6, onComplete: onDone });
  });

  useEffect(() => {
    readyRef.current = ready;
    if (ready && pending.current) finish.current();
  }, [ready]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3, onComplete: () => finish.current() });
    tl.fromTo(l1.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(l1.current, { autoAlpha: 0, duration: 0.5 }, '+=0.9')
      .fromTo(l2.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(l2.current, { autoAlpha: 0, duration: 0.5 }, '+=0.9');
    const skip = () => {
      tl.kill();
      gsap.set([l1.current, l2.current], { autoAlpha: 0 });
      finish.current();
    };
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      tl.kill();
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  return (
    <div ref={root} className="intro" role="status">
      <p ref={l1}>Welcome to my portfolio.</p>
      <p ref={l2}>Choose a cassette.</p>
      <small>{ready ? 'click to skip' : 'loading the room…'}</small>
    </div>
  );
}
