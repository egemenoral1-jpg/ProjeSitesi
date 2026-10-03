import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/scene.css';
import './styles/cassette.css';
import './styles/character.css';
import './styles/tv.css';

// No StrictMode: the scene is driven imperatively by GSAP and must mount exactly once.
createRoot(document.getElementById('root')!).render(<App />);
