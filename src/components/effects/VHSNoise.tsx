import { memo, useEffect, useRef } from 'react';

/** Analog static. Only animates while `active`, so it costs nothing when the TV is off. */
export const VHSNoise = memo(function VHSNoise({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(canvas.width, canvas.height);
    const px = new Uint32Array(img.data.buffer);
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      if (t - last > 45) {
        last = t;
        for (let i = 0; i < px.length; i++) {
          const v = (Math.random() * 255) | 0;
          px[i] = 0xff000000 | (v << 16) | (v << 8) | v;
        }
        ctx.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return <canvas ref={ref} className="vhs-noise" width={130} height={98} />;
});
