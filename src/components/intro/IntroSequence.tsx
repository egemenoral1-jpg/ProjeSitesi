import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Black screen -> two short lines -> fade into the room. Click or key skips it. */
export function IntroSequence({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLParagraphElement>(null);
  const l2 = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const done = () => {
      tl.kill();
      gsap.to(root.current, { autoAlpha: 0, duration: 0.5, onComplete: onDone });
    };
    const tl = gsap.timeline({ delay: 0.3, onComplete: done });
    tl.fromTo(l1.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(l1.current, { autoAlpha: 0, duration: 0.5 }, '+=0.9')
      .fromTo(l2.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(l2.current, { autoAlpha: 0, duration: 0.5 }, '+=0.9');
    const skip = () => done();
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      tl.kill();
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone]);

  return (
    <div ref={root} className="intro" role="status">
      <p ref={l1}>Welcome to my portfolio.</p>
      <p ref={l2}>Choose a cassette.</p>
      <small>click to skip</small>
    </div>
  );
}
