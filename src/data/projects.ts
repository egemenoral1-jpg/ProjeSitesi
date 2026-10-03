/** Snapshot of the GitHub repository (fetched 2026-10-03). Stars/updated date are refreshed live when shown. */
export interface RepoInfo {
  /** owner/name on GitHub */
  fullName: string;
  defaultBranch: string;
  /** bytes per language, as reported by the GitHub API */
  languages: Record<string, number>;
  commits: number;
  stars: number;
  forks: number;
  sizeKb: number;
  createdAt: string;
  pushedAt: string;
  /** top-level files and folders (folders end with "/") */
  structure: string[];
}

export interface Project {
  id: string;
  title: string;
  /** Text printed on the cassette label (ASCII: the label font has no Turkish glyphs) */
  cassetteLabel: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl: string;
  /** Optional: only projects that are deployed get a live link button. */
  liveUrl?: string;
  /** Label colour of the cassette */
  color: string;
  repo: RepoInfo;
}

/**
 * Add a project by appending an object here. A cassette is created for it
 * automatically (see data/tapes.ts) and appears in a stack next to the TV.
 */
export const projects: Project[] = [
  {
    id: 'computer-hardware',
    title: 'Computer-Hardware',
    cassetteLabel: 'COMPUTER-HARDWARE',
    tagline: 'ParçaParça: bilgisayar donanımını izleyerek ve deneyerek öğren.',
    description:
      'Bilgisayar parçalarını anlatan Türkçe, etkileşimli bir öğrenme sitesi. Her parçanın kendi sayfası var; anlatımın yanında animasyonlar, simülasyonlar ve hesaplayıcılar bulunuyor. Build gerektirmeyen düz HTML/CSS/JS.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    features: [
      'İşlemci: fetch-decode-execute animasyonu, register gezgini, mini ALU, cache piramidi, pipeline, Amdahl yasası',
      'Ekran kartı: CPU–GPU yarışı, warp sapması, render hattı, VRAM bant genişliği, ışın izleme',
      'RAM: DRAM hücresi, DDR nesilleri, hız/gecikme hesaplayıcı, dual channel',
      'Depolama, anakart, güç kaynağı ve soğutma sayfaları: HDD kafa simülasyonu, PCIe hat bütçesi, watt hesaplayıcı',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/Computer-Hardware',
    color: '#1f7a6a',
    repo: {
      fullName: 'egemenoral1-jpg/Computer-Hardware',
      defaultBranch: 'main',
      languages: { JavaScript: 169405, HTML: 138362, CSS: 86612 },
      commits: 18,
      stars: 0,
      forks: 0,
      sizeKb: 286,
      createdAt: '2026-09-30',
      pushedAt: '2026-09-30',
      structure: ['index.html', 'cpu.html', 'gpu.html', 'ram.html', 'depolama.html', 'anakart.html', 'psu.html', 'sogutma.html', 'css/', 'js/', 'README.md'],
    },
  },
  {
    id: 'hisse-takip-ai',
    title: 'hisse-takip-ai',
    cassetteLabel: 'HISSE-TAKIP-AI',
    tagline: 'Hisseleri takip et, riskini hesapla, yapay zekâya yorumlat.',
    description:
      'Hisse fiyatlarını ve geçmiş verilerini yfinance ile çeken bir FastAPI arka ucu ve Next.js ön yüzünden oluşan full-stack uygulama. Getirilerin volatilitesinden günlük ve yıllık risk hesaplıyor, Google Gemini ile yorum üretiyor.',
    technologies: ['Python', 'FastAPI', 'yfinance', 'pandas', 'NumPy', 'Gemini', 'Next.js', 'TypeScript', 'Tailwind', 'lightweight-charts'],
    features: [
      'Anlık fiyat, geçmiş fiyat grafiği ve 52 haftalık aralık',
      'Piyasa açık/kapalı durumu',
      'Volatiliteye dayalı risk motoru: düşük / orta / yüksek ve açıklaması',
      'Gemini ile yapay zekâ yorumu',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/hisse-takip-ai',
    color: '#8a5a12',
    repo: {
      fullName: 'egemenoral1-jpg/hisse-takip-ai',
      defaultBranch: 'main',
      languages: { TypeScript: 34145, Python: 8611, CSS: 4903, JavaScript: 559 },
      commits: 38,
      stars: 2,
      forks: 0,
      sizeKb: 243,
      createdAt: '2026-09-03',
      pushedAt: '2026-09-03',
      structure: ['backend/', 'frontend/', '.gitignore'],
    },
  },
  {
    id: 'amazon-shopping-assistant',
    title: 'amazon-shopping-assistant',
    cassetteLabel: 'AMAZON ASSISTANT',
    tagline: 'Ürün sayfasını oku, yorumları özetle, ürünleri karşılaştır.',
    description:
      'Amazon, Trendyol ve Hepsiburada ürün sayfalarını tarayıcıda okuyup Google Gemini ile analiz eden bir Chrome eklentisi (Manifest V3, sürüm 1.6.0).',
    technologies: ['JavaScript', 'Chrome Extension MV3', 'Gemini API', 'HTML', 'CSS'],
    features: [
      'Tek ürün analizi: özet, artılar, eksiler, tavsiye',
      'Sayfadan alınan gerçek kullanıcı yorumları panelde',
      '2–4 ürünü ayrı sekmede puanlayıp karşılaştırma',
      'Türkçe / İngilizce arayüz ve analiz dili, geçmiş ve ayarlar sayfası',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/amazon-shopping-assistant',
    color: '#a5481c',
    repo: {
      fullName: 'egemenoral1-jpg/amazon-shopping-assistant',
      defaultBranch: 'main',
      languages: { JavaScript: 49474, CSS: 9103, HTML: 3532 },
      commits: 24,
      stars: 1,
      forks: 0,
      sizeKb: 50,
      createdAt: '2026-08-17',
      pushedAt: '2026-08-19',
      structure: ['manifest.json', 'background/', 'content/', 'popup/', 'compare/', 'history/', 'options/', 'lib/', 'icons/', 'README.md'],
    },
  },
  {
    id: 'kutuphane',
    title: 'Kütüphane',
    cassetteLabel: 'KUTUPHANE',
    tagline: 'Kitap takibi ve okuma alışkanlığı uygulaması.',
    description:
      'Kitaplarını ekle, okuma süreni tut, notlar al, puanla ve günlük okuma serini koru. Giriş sistemi, PostgreSQL veritabanı ve karanlık mod içeren bir Next.js uygulaması.',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL (Neon)', 'NextAuth', 'Zod', 'Tailwind'],
    features: [
      'Kitap ekleme ve yönetme',
      'Okuma süresi takibi ve detaylı istatistikler',
      'Not alma, puanlama, okuma streak\'i',
      'Karanlık mod',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/kutuphane',
    color: '#5a2a7a',
    repo: {
      fullName: 'egemenoral1-jpg/kutuphane',
      defaultBranch: 'master',
      languages: { TypeScript: 106616, JavaScript: 605, CSS: 309 },
      commits: 1,
      stars: 1,
      forks: 0,
      sizeKb: 92,
      createdAt: '2025-12-25',
      pushedAt: '2025-12-25',
      structure: ['app/', 'prisma/', 'public/', 'middleware.ts', 'next.config.ts', 'package.json', 'tsconfig.json', 'README.md'],
    },
  },
  {
    id: 'snake-ai',
    title: 'snake-ai',
    cassetteLabel: 'SNAKE-AI',
    tagline: 'Kendi kendine Snake oynamayı öğrenen yapay zekâ.',
    description:
      'Deep Q-Learning (DQN) ile eğitilen bir ajan. Başta rastgele hareket ediyor; birkaç yüz oyun sonra elmaları bulmayı, birkaç bin oyun sonra iyi oynamayı öğreniyor. En iyi model otomatik kaydediliyor.',
    technologies: ['Python', 'PyTorch', 'Pygame', 'NumPy', 'Matplotlib'],
    features: [
      'Oyun ortamı, sinir ağı, ajan ve eğitim döngüsü ayrı modüller',
      'Durum 11 sayıya indirgeniyor: tehlike, yön, elma konumu',
      'Epsilon-greedy keşif, hafızadan örnekleyip Bellman denklemiyle güncelleme',
      'Eğitim sırasında canlı skor grafiği',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/snake-ai',
    color: '#3f7a1a',
    repo: {
      fullName: 'egemenoral1-jpg/snake-ai',
      defaultBranch: 'main',
      languages: { Python: 18459 },
      commits: 1,
      stars: 2,
      forks: 0,
      sizeKb: 35,
      createdAt: '2026-08-16',
      pushedAt: '2026-08-16',
      structure: ['agent.py', 'game.py', 'model.py', 'train.py', 'helper.py', 'model/', 'requirements.txt', 'README.md'],
    },
  },
  {
    id: 'cv-site',
    title: 'Egemen Oral — CV',
    cassetteLabel: 'EGEMEN ORAL CV',
    tagline: 'Kişisel CV ve portfolyo sitem.',
    description:
      'Trakya Üniversitesi Bilgisayar Mühendisliği öğrencisi olarak kendimi, becerilerimi, projelerimi ve eğitimimi anlattığım tek sayfalık site. CV’m PDF olarak indirilebiliyor; site Netlify üzerinde yayında.',
    technologies: ['HTML', 'Tailwind CSS', 'JavaScript', 'AOS', 'Font Awesome', 'Netlify'],
    features: [
      'Hakkımda, Beceriler, Projeler, Eğitim ve İletişim bölümleri',
      'İndirilebilir PDF CV',
      'Kaydırdıkça beliren animasyonlar (AOS)',
      'Mobil uyumlu tasarım',
    ],
    githubUrl: 'https://github.com/egemenoral1-jpg/egemenoral',
    liveUrl: 'https://egemenoral.netlify.app/',
    color: '#24508f',
    repo: {
      fullName: 'egemenoral1-jpg/egemenoral',
      defaultBranch: 'master',
      languages: { HTML: 62841 },
      commits: 3,
      stars: 1,
      forks: 0,
      sizeKb: 82,
      createdAt: '2025-10-20',
      pushedAt: '2026-08-05',
      structure: ['index.html', 'Egemen_Oral_CV.pdf'],
    },
  },
];
