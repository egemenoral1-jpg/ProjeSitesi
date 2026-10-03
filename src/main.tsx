import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import App from './App';
import './styles/global.css';
import './styles/scene.css';
import './styles/cassette.css';
import './styles/character.css';
import './styles/tv.css';

// Dev only: lets the console/test harness reach GSAP (e.g. gsap.ticker.useRAF(false) in a background tab).
if (import.meta.env.DEV) (window as unknown as { gsap: typeof gsap }).gsap = gsap;

// No StrictMode: the scene is driven imperatively by GSAP and must mount exactly once.
createRoot(document.getElementById('root')!).render(<App />);
