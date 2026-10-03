import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { sfx } from './audio/audio';
import App from './App';
import './styles/global.css';
import './styles/tv.css';

// Dev only: lets the console / test and video-recording scripts reach GSAP and the sound engine.
if (import.meta.env.DEV) Object.assign(window, { gsap, sfx });

// No StrictMode: the scene is driven imperatively by GSAP and must mount exactly once.
createRoot(document.getElementById('root')!).render(<App />);
