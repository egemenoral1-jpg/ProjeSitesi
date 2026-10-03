(() => {
'use strict';

/* ------------------------------------------------------------------ */
/*  PROJELER                                                          */
/* ------------------------------------------------------------------ */
const PROJECTS = [
  {
    id: 'computer-hardware',
    short: 'PARÇAPARÇA',
    color: '#29c4ae',
    title: 'Computer-Hardware',
    kicker: 'Web sitesi · Eğitim',
    tagline: 'ParçaParça: bilgisayar donanımını izleyerek, deneyerek öğren.',
    desc: 'Bilgisayar parçalarını anlatan küçük bir Türkçe site. Her parçanın kendi sayfası var; anlatımın yanında etkileşimli demolar ve animasyonlar içeriyor.',
    features: [
      'İşlemci: fetch-decode-execute animasyonu, register\'lar, cache piramidi, pipeline',
      'Ekran kartı: render hattı, warp sapması, ışın izleme',
      'RAM hız/gecikme hesaplayıcı, HDD kafa simülasyonu',
      'Tıklanabilir anakart haritası, watt hesaplayıcı, soğutma simülasyonu',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    repo: 'https://github.com/egemenoral1-jpg/Computer-Hardware',
  },
  {
    id: 'hisse-takip-ai',
    short: 'HİSSE-TAKİP',
    color: '#f5b83a',
    title: 'hisse-takip-ai',
    kicker: 'Full-stack · Yapay zekâ',
    tagline: 'Hisseleri takip et, riskini hesapla, yapay zekâya yorumlat.',
    desc: 'Hisse fiyatlarını ve geçmiş verisini çeken, günlük/yıllık volatiliteden risk seviyesi hesaplayan ve Gemini ile yorum üreten bir uygulama.',
    features: [
      'Anlık fiyat, geçmiş grafik ve 52 haftalık aralık',
      'Volatiliteye dayalı risk motoru (düşük / orta / yüksek)',
      'Google Gemini ile yapay zekâ yorumu',
      'FastAPI arka uç + Next.js ön yüz',
    ],
    tech: ['Python', 'FastAPI', 'yfinance', 'Gemini', 'Next.js', 'TypeScript', 'Tailwind'],
    repo: 'https://github.com/egemenoral1-jpg/hisse-takip-ai',
  },
  {
    id: 'amazon-shopping-assistant',
    short: 'AMAZON ASİSTAN',
    color: '#ff8a3d',
    title: 'amazon-shopping-assistant',
    kicker: 'Chrome eklentisi · Yapay zekâ',
    tagline: 'Ürün sayfasını oku, yorumları özetle, ürünleri karşılaştır.',
    desc: 'Amazon, Trendyol ve Hepsiburada ürün sayfalarını okuyup Google Gemini ile analiz eden bir Chrome eklentisi (Manifest V3).',
    features: [
      'Tek ürün analizi: özet, artılar, eksiler, tavsiye',
      'Sayfadan alınan gerçek kullanıcı yorumları panelde',
      '2–4 ürünü puanlayıp karşılaştırma',
      'Türkçe / İngilizce arayüz ve analiz dili',
    ],
    tech: ['JavaScript', 'Chrome Extension MV3', 'Gemini API'],
    repo: 'https://github.com/egemenoral1-jpg/amazon-shopping-assistant',
  },
  {
    id: 'kutuphane',
    short: 'KÜTÜPHANE',
    color: '#a97be0',
    title: 'Kütüphane',
    kicker: 'Web uygulaması · Full-stack',
    tagline: 'Kitap takibi ve okuma alışkanlığı uygulaması.',
    desc: 'Kitaplarını ekle, okuma süreni tut, notlar al, puanla ve günlük okuma serini (streak) koru. Karanlık mod destekli.',
    features: [
      'Kitap ekleme ve yönetme',
      'Okuma süresi takibi ve detaylı istatistikler',
      'Not alma, puanlama, okuma streak\'i',
      'Giriş sistemi ve PostgreSQL (Neon) veritabanı',
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    repo: 'https://github.com/egemenoral1-jpg/kutuphane',
    demo: 'https://akasha-peach.vercel.app',
  },
  {
    id: 'snake-ai',
    short: 'SNAKE-AI',
    color: '#83dc4c',
    title: 'snake-ai',
    kicker: 'Yapay zekâ · Pekiştirmeli öğrenme',
    tagline: 'Kendi kendine Snake oynamayı öğrenen yapay zekâ.',
    desc: 'Deep Q-Learning (DQN) ile eğitilen bir ajan. Başta rastgele hareket ediyor; birkaç yüz oyun sonra elmaları bulmayı, birkaç bin oyun sonra iyi oynamayı öğreniyor.',
    features: [
      'Oyun ortamı, sinir ağı ve eğitici ayrı modüller',
      'Durum 11 sayıya indirgeniyor (tehlike, yön, elma konumu)',
      'Epsilon-greedy keşif + Bellman denklemiyle güncelleme',
      'Eğitim sırasında canlı skor grafiği',
    ],
    tech: ['Python', 'PyTorch', 'Pygame', 'DQN'],
    repo: 'https://github.com/egemenoral1-jpg/snake-ai',
  },
];

/* ------------------------------------------------------------------ */
/*  DOM                                                               */
/* ------------------------------------------------------------------ */
const $ = (s) => document.querySelector(s);
const stage = $('#stage'), shelf = $('#shelf'), tapeLayer = $('#tapes');
const mord = $('#mordecai'), mJump = $('#mJump'), mInner = $('#mInner');
const armEl = $('#arm'), handEl = $('#hand');
const screenEl = $('#screen'), content = $('#content'), canvas = $('#noise');
const lip = $('#lip'), ejectBtn = $('#eject'), led = $('#led');

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? Math.min(ms, 40) : ms));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let u = 10;            // 1em, piksel cinsinden
let busy = false;
let loaded = -1;       // takılı kasetin indeksi
let T = null;          // havadaki kaset

/* ------------------------------------------------------------------ */
/*  Yerleşim                                                          */
/* ------------------------------------------------------------------ */
function layout() {
  const compact = innerWidth < 720;
  stage.classList.toggle('compact', compact);
  const sw = compact ? 60 : 76;
  const availW = document.documentElement.clientWidth - (compact ? 8 : 32);
  const hdr = document.querySelector('header').offsetHeight + 30;
  const cur = parseFloat(stage.style.fontSize) || 10;
  const hEm = stage.offsetHeight / cur || 80;
  const byH = compact ? 99 : (innerHeight - hdr) / hEm;
  u = Math.max(4, Math.min(12, availW / sw, byH));
  stage.style.setProperty('--sw', sw);
  stage.style.setProperty('--u', u + 'px');
  if (T && !busy) placeFinal();
}

function rel(el) {
  const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height };
}
const stageW = () => stage.getBoundingClientRect().width;
const slotX = () => rel(lip).x - 3 * u;
const cutY = () => rel(lip).y;
const spineEl = (i) => shelf.children[i];

/* ------------------------------------------------------------------ */
/*  Kasetler (dolap)                                                  */
/* ------------------------------------------------------------------ */
PROJECTS.forEach((p, i) => {
  const b = document.createElement('button');
  b.className = 'spine';
  b.type = 'button';
  b.style.setProperty('--c', p.color);
  b.setAttribute('aria-label', `${p.title} kasetini seç`);
  b.title = p.title;
  b.innerHTML = `<span>${esc(p.short)}</span>`;
  b.addEventListener('click', () => selectProject(i));
  shelf.appendChild(b);
});

/* ------------------------------------------------------------------ */
/*  Mordecai                                                          */
/* ------------------------------------------------------------------ */
const ARM = { down: 0, hold: -75, up: -160, push: -115 };
const setArm = (a) => { armEl.style.transform = `rotate(${a}deg)`; };
const face = (right) => { mInner.style.transform = right ? 'scaleX(1)' : 'scaleX(-1)'; };
const mordX = () => rel(mord).x;

function placeMord(x) {
  mord.style.transitionDuration = '0ms';
  mord.style.left = (x / stageW() * 100) + '%';
}

async function walkTo(x) {
  const d = x - mordX();
  if (Math.abs(d) < 3) return;
  face(d > 0);
  const speed = 24 * u * (reduce ? 6 : 1);
  const dur = Math.abs(d) / speed * 1000;
  mord.classList.add('walking');
  mord.style.transitionDuration = dur + 'ms';
  mord.style.left = (x / stageW() * 100) + '%';
  await sleep(dur + 30);
  mord.classList.remove('walking');
}

const idleX = () => 9 * u;

async function jump(px, ms = 420) {
  mJump.style.transform = `translateY(${-px}px)`;
  await sleep(ms);
}
async function land(ms = 420) {
  mJump.style.transform = 'translateY(0)';
  await sleep(ms);
}

/* ------------------------------------------------------------------ */
/*  Havadaki kaset                                                    */
/* ------------------------------------------------------------------ */
const HOLD = 0.2;   // kaset elin ne kadar üstünde duruyor (kaset boyu cinsinden)
const ease = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;

function makeTape(p) {
  const el = document.createElement('div');
  el.className = 'tape';
  el.style.setProperty('--c', p.color);
  el.innerHTML = `<div class="lab"><b>${esc(p.short)}</b></div><div class="win"><i></i><i></i></div>`;
  tapeLayer.appendChild(el);
  return { el, x: 0, y: 0, r: 0, sy: 1, clip: false, follow: null, W: el.offsetWidth, H: el.offsetHeight };
}

function applyTape() {
  if (!T) return;
  const { el, x, y, r, sy, W, H } = T;
  el.style.transform = `translate(${x - W / 2}px,${y - H / 2}px) rotate(${r}deg) scale(1,${sy})`;
  if (T.clip) {
    const hidden = Math.max(0, y + H / 2 - cutY());
    el.style.clipPath = hidden > 0 ? `inset(0 0 ${hidden}px 0)` : 'none';
  } else {
    el.style.clipPath = 'none';
  }
}

function handPos() {
  const h = rel(handEl);
  return { x: h.x, y: h.y - T.H * HOLD, r: 0, sy: 1 };
}

function tick(now) {
  if (T && T.follow) {
    const f = T.follow, tg = handPos();
    const p = f.dur ? Math.min(1, (now - f.t0) / f.dur) : 1, e = ease(p);
    T.x = lerp(f.from.x, tg.x, e);
    T.y = lerp(f.from.y, tg.y, e);
    T.r = lerp(f.from.r, tg.r, e);
    T.sy = lerp(f.from.sy, tg.sy, e);
    applyTape();
  }
  requestAnimationFrame(tick);
}

function followHand(dur) {
  T.follow = { t0: performance.now(), dur: reduce ? 0 : dur, from: { x: T.x, y: T.y, r: T.r, sy: T.sy } };
}

function tweenTape(to, dur) {
  T.follow = null;
  const from = { x: T.x, y: T.y, r: T.r, sy: T.sy };
  const t0 = performance.now();
  dur = reduce ? 0 : dur;
  return new Promise((res) => {
    const step = (now) => {
      const p = dur ? Math.min(1, (now - t0) / dur) : 1, e = ease(p);
      for (const k of ['x', 'y', 'r', 'sy']) T[k] = lerp(from[k], to[k], e);
      applyTape();
      p < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
}

function spineState(i) {
  const s = rel(spineEl(i));
  return { x: s.x, y: s.y, r: -90, sy: s.w / (T ? T.H : 6.6 * u) };
}

function finalState() {
  return { x: slotX(), y: cutY() - 0.2 * T.H, r: 0, sy: 1 };
}

function placeFinal() {
  Object.assign(T, finalState());
  T.W = T.el.offsetWidth; T.H = T.el.offsetHeight;
  Object.assign(T, finalState());
  applyTape();
}

/* ------------------------------------------------------------------ */
/*  Ekran                                                             */
/* ------------------------------------------------------------------ */
const ctx = canvas.getContext('2d');
const img = ctx.createImageData(canvas.width, canvas.height);
const buf = new Uint32Array(img.data.buffer);
let lastNoise = 0;
function noiseLoop(now) {
  const st = screenEl.dataset.state;
  if ((st === 'static' || st === 'play') && now - lastNoise > 55) {
    lastNoise = now;
    for (let i = 0; i < buf.length; i++) {
      const v = (Math.random() * 255) | 0;
      buf[i] = 0xff000000 | (v << 16) | (v << 8) | v;
    }
    ctx.putImageData(img, 0, 0);
  }
  requestAnimationFrame(noiseLoop);
}

const setScreen = (s) => { screenEl.dataset.state = s; };

let typeToken = 0;
async function showProject(p, idx) {
  const my = ++typeToken;
  screenEl.style.setProperty('--c', p.color);
  content.style.setProperty('--c', p.color);
  const li = p.features.map((f) => `<li>${esc(f)}</li>`).join('');
  const chips = p.tech.map((t) => `<span>${esc(t)}</span>`).join('');
  const demo = p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Canlı demo ↗</a>` : '';
  content.innerHTML = `
    <div class="proj">
      <div class="kicker">Kaset ${idx + 1}/${PROJECTS.length} · ${esc(p.kicker)}</div>
      <h2 class="typing"></h2>
      <p class="tagline fade" style="animation-delay:.5s">${esc(p.tagline)}</p>
      <p class="fade" style="animation-delay:.8s">${esc(p.desc)}</p>
      <div class="fade" style="animation-delay:1.1s"><h3>NELER VAR?</h3><ul>${li}</ul></div>
      <div class="chips fade" style="animation-delay:1.4s">${chips}</div>
      <div class="links fade" style="animation-delay:1.7s">
        <a href="${p.repo}" target="_blank" rel="noopener">GitHub ↗</a>${demo}
      </div>
    </div>`;
  content.scrollTop = 0;
  setScreen('content');
  const h2 = content.querySelector('h2');
  for (let i = 1; i <= p.title.length; i++) {
    if (my !== typeToken) return;
    h2.textContent = p.title.slice(0, i);
    await sleep(34);
  }
  h2.classList.remove('typing');
}

/* ------------------------------------------------------------------ */
/*  Sahneler                                                          */
/* ------------------------------------------------------------------ */
async function fetchFromShelf(i) {
  const p = PROJECTS[i];
  const sp = spineEl(i);
  await walkTo(rel(sp).x - 2 * u);
  face(true);
  setArm(ARM.up);
  await sleep(380);
  T = makeTape(p);
  Object.assign(T, spineState(i));
  applyTape();
  sp.classList.add('out');
  followHand(520);
  await sleep(560);
  setArm(ARM.hold);
}

async function insertIntoTv(i) {
  await walkTo(slotX() - 1.3 * u);
  face(true);
  setArm(ARM.up);
  await sleep(320);
  // eli yuvanın hizasına çıkaracak kadar zıpla
  const targetHand = cutY() - 0.4 * u - (0.5 - HOLD) * T.H;
  const need = Math.max(0, rel(handEl).y - targetHand);
  await jump(need);
  T.clip = true;
  setArm(ARM.push);
  await tweenTape(finalState(), 480);
  T.follow = null;
  T.el.style.zIndex = 6;
  setArm(ARM.down);
  await land();
  loaded = i;
}

async function ejectFromTv() {
  const i = loaded;
  await walkTo(slotX() - 1.3 * u);
  face(true);
  setArm(ARM.up);
  await sleep(300);
  const targetHand = cutY() - 0.4 * u - (0.5 - HOLD) * T.H;
  const need = Math.max(0, rel(handEl).y - targetHand);
  T.el.style.zIndex = 40;
  jump(need);
  await sleep(120);
  followHand(500);
  await sleep(540);
  T.clip = false;
  await land();
  setArm(ARM.hold);
  loaded = -1;
  // rafa geri koy
  const sp = spineEl(i);
  await walkTo(rel(sp).x - 2 * u);
  face(true);
  setArm(ARM.up);
  await sleep(300);
  await tweenTape(spineState(i), 480);
  tapeLayer.removeChild(T.el);
  T = null;
  sp.classList.remove('out');
  setArm(ARM.down);
  await sleep(250);
}

async function selectProject(i) {
  if (busy || i === loaded) return;
  busy = true;
  stage.classList.add('busy');
  ejectBtn.disabled = true;
  try {
    if (loaded >= 0) {
      typeToken++;
      led.classList.remove('on');
      screenEl.classList.remove('loaded');
      setScreen('static');
      await ejectFromTv();
    }
    await fetchFromShelf(i);
    await insertIntoTv(i);
    walkTo(idleX());
    led.classList.add('on');
    screenEl.classList.add('loaded');
    setScreen('play');
    await sleep(1300);
    showProject(PROJECTS[i], i);
    await sleep(500);
  } finally {
    busy = false;
    stage.classList.remove('busy');
    ejectBtn.disabled = loaded < 0;
  }
}

async function ejectOnly() {
  if (busy || loaded < 0) return;
  busy = true;
  stage.classList.add('busy');
  ejectBtn.disabled = true;
  try {
    typeToken++;
    led.classList.remove('on');
    screenEl.classList.remove('loaded');
    setScreen('static');
    await ejectFromTv();
    await walkTo(idleX());
  } finally {
    busy = false;
    stage.classList.remove('busy');
    ejectBtn.disabled = loaded < 0;
  }
}
ejectBtn.addEventListener('click', ejectOnly);

/* ------------------------------------------------------------------ */
/*  Başlat                                                            */
/* ------------------------------------------------------------------ */
function init() {
  layout();
  face(true);
  setArm(ARM.down);
  placeMord(idleX());
  setScreen('static');
  requestAnimationFrame(tick);
  requestAnimationFrame(noiseLoop);
}
addEventListener('resize', () => {
  const before = mordX() / stageW();
  layout();
  placeMord(before * stageW());
});
document.fonts && document.fonts.ready.then(layout);
init();
})();
