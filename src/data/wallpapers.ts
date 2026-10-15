import { Wallpaper } from '../types/wallpaper';

// Import high-resolution local images
import wpLionGold from '../assets/images/wp_lion_gold_1791025842964.jpg';
import wpOceanWave from '../assets/images/wp_ocean_wave_1791025856762.jpg';
import wpFalconSky from '../assets/images/wp_falcon_sky_1791025867985.jpg';
import wpFujiSakura from '../assets/images/wp_fuji_sakura_1791025880193.jpg';
import wpDesertAurora from '../assets/images/wp_desert_aurora_1791025306294.jpg';
import wpAmoledGold from '../assets/images/wp_amoled_gold_1791025318117.jpg';
import wpIslamicArch from '../assets/images/wp_islamic_arch_1791025329257.jpg';
import wpCyberRain from '../assets/images/wp_cyber_rain_1791025340663.jpg';
import callAuroraGlow from '../assets/images/call_bg_aurora_glow_1791023783677.jpg';
import callCyberNeon from '../assets/images/call_bg_cyber_neon_1791023807796.jpg';
import callLuxuryGold from '../assets/images/call_bg_luxury_gold_1791023795072.jpg';
import callSunsetDune from '../assets/images/call_bg_sunset_dune_1791023817399.jpg';

// Helper to create safe SVG data URLs
const createGradientSvgUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// Procedural vector ultra-high-definition wallpapers (1080x1920 scalable to 4K/8K)
const cosmosNebulaSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="neb1" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#4c1d95" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#090514" stop-opacity="1" />
    </radialGradient>
    <radialGradient id="neb2" cx="70%" cy="75%" r="55%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#0369a1" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="neb3" cx="30%" cy="85%" r="40%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="#04020a" />
  <rect width="1080" height="1920" fill="url(#neb1)" />
  <rect width="1080" height="1920" fill="url(#neb2)" />
  <rect width="1080" height="1920" fill="url(#neb3)" />
  <g fill="#ffffff">
    <circle cx="210" cy="340" r="3.5" opacity="0.9" />
    <circle cx="580" cy="180" r="4" opacity="0.95" />
    <circle cx="890" cy="420" r="2.5" opacity="0.8" />
    <circle cx="450" cy="850" r="5" opacity="1" fill="#fde047" />
    <circle cx="720" cy="990" r="3" opacity="0.85" />
    <circle cx="150" cy="1150" r="4" opacity="0.9" />
    <circle cx="880" cy="1420" r="3.5" opacity="0.95" />
    <circle cx="340" cy="1620" r="4.5" opacity="0.85" fill="#38bdf8" />
    <circle cx="950" cy="1780" r="2.5" opacity="0.7" />
  </g>
  <path d="M-50,700 Q300,500 600,850 T1150,800" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="4" stroke-dasharray="8 12" />
</svg>`);

const emeraldOasisSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="40%" stop-color="#064e3b" />
      <stop offset="70%" stop-color="#047857" />
      <stop offset="100%" stop-color="#052e16" />
    </linearGradient>
    <radialGradient id="emLight" cx="50%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#10b981" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#emGrad)" />
  <rect width="1080" height="1920" fill="url(#emLight)" />
  <path d="M-100,1200 Q200,900 600,1150 T1200,1050 L1200,1920 L-100,1920 Z" fill="#033d30" opacity="0.65" />
  <path d="M-100,1400 Q400,1200 800,1450 T1200,1350 L1200,1920 L-100,1920 Z" fill="#022c22" opacity="0.85" />
  <path d="M-100,1650 Q300,1500 700,1700 T1200,1620 L1200,1920 L-100,1920 Z" fill="#011c16" />
</svg>`);

const minimalCrimsonSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="darkCrim" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#180408" />
      <stop offset="50%" stop-color="#3b0813" />
      <stop offset="85%" stop-color="#881337" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <radialGradient id="sunOrb" cx="50%" cy="80%" r="45%">
      <stop offset="0%" stop-color="#fb7185" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#e11d48" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#darkCrim)" />
  <circle cx="540" cy="1450" r="420" fill="url(#sunOrb)" />
  <circle cx="540" cy="850" r="260" fill="none" stroke="#f43f5e" stroke-width="3" opacity="0.4" stroke-dasharray="6 8" />
  <circle cx="540" cy="850" r="180" fill="none" stroke="#fda4af" stroke-width="1.5" opacity="0.3" />
</svg>`);

const abstractPrismSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="prismBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
    <linearGradient id="ribbon2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="50%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#facc15" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#prismBg)" />
  <path d="M-100,600 C300,300 700,900 1180,700 L1180,950 C700,1150 300,550 -100,850 Z" fill="url(#ribbon1)" opacity="0.75" />
  <path d="M-100,800 C400,600 750,1300 1180,1100 L1180,1350 C750,1550 400,850 -100,1050 Z" fill="url(#ribbon2)" opacity="0.65" />
  <circle cx="540" cy="850" r="320" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
</svg>`);

const animeSunsetSkySvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="animeSky" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="30%" stop-color="#4338ca" />
      <stop offset="55%" stop-color="#be185d" />
      <stop offset="75%" stop-color="#f97316" />
      <stop offset="92%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#fef08a" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="78%" r="35%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="30%" stop-color="#fef08a" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#be185d" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#animeSky)" />
  <circle cx="540" cy="1480" r="220" fill="url(#sunGlow)" />
  <path d="M-50,1350 Q120,1280 280,1320 Q440,1260 620,1300 Q800,1250 980,1320 Q1120,1280 1180,1340 L1180,1920 L-50,1920 Z" fill="#31103f" opacity="0.8" />
  <path d="M-50,1500 Q200,1440 450,1480 Q700,1420 950,1470 Q1100,1430 1180,1510 L1180,1920 L-50,1920 Z" fill="#180521" />
</svg>`);

const supercarAmoledSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="carSpeed" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#050505" />
      <stop offset="50%" stop-color="#0a0a0f" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#carSpeed)" />
  <path d="M140,1180 L380,1150 L700,1150 L940,1180 L960,1205 L690,1175 L390,1175 L120,1205 Z" fill="#ff1e42" />
  <path d="M220,1240 L380,1225 L700,1225 L860,1240 L850,1255 L690,1240 L390,1240 L230,1255 Z" fill="#ff4d6d" opacity="0.8" />
  <line x1="540" y1="1350" x2="540" y2="1920" stroke="#ff1e42" stroke-width="4" opacity="0.4" stroke-dasharray="40 80" />
  <text x="540" y="820" font-family="sans-serif" font-weight="900" font-size="28" fill="#ffffff" opacity="0.3" text-anchor="middle" letter-spacing="12">G T  V E L O C I T Y</text>
</svg>`);

const islamicCalligraphyMoonSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="islamicGlow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#047857" stop-opacity="0.8" />
      <stop offset="45%" stop-color="#064e3b" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#021f18" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="goldHلال" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="#01140f" />
  <rect width="1080" height="1920" fill="url(#islamicGlow)" />
  <!-- Crescent Moon -->
  <path d="M540,550 A160,160 0 1,0 680,810 A140,140 0 1,1 540,550 Z" fill="url(#goldHلال)" filter="drop-shadow(0 0 18px rgba(251,191,36,0.6))" />
  <!-- Islamic geometric 8-point star -->
  <g fill="none" stroke="rgba(251,191,36,0.25)" stroke-width="2">
    <rect x="420" y="1100" width="240" height="240" transform="rotate(45 540 1220)" />
    <rect x="420" y="1100" width="240" height="240" />
    <circle cx="540" cy="1220" r="160" />
  </g>
  <text x="540" y="1235" font-family="'Cairo', sans-serif" font-size="34" font-weight="bold" fill="#fef08a" text-anchor="middle" letter-spacing="4">سُبْحَانَ اللهِ وَبِحَمْدِهِ</text>
</svg>`);

const blackHoleGravitySvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <radialGradient id="accretionDisk" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" />
      <stop offset="42%" stop-color="#000000" />
      <stop offset="48%" stop-color="#fb923c" />
      <stop offset="55%" stop-color="#ea580c" />
      <stop offset="70%" stop-color="#7c2d12" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="#000000" />
  <circle cx="540" cy="960" r="480" fill="url(#accretionDisk)" />
  <ellipse cx="540" cy="960" rx="420" ry="120" fill="none" stroke="#fdba74" stroke-width="8" opacity="0.8" transform="rotate(-15 540 960)" />
  <ellipse cx="540" cy="960" rx="430" ry="130" fill="none" stroke="#f97316" stroke-width="3" opacity="0.6" transform="rotate(-15 540 960)" />
  <circle cx="540" cy="960" r="170" fill="#000000" stroke="#fb923c" stroke-width="2" />
</svg>`);

const rainDropsAmoledSvg = createGradientSvgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="rainDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#030712" />
      <stop offset="50%" stop-color="#0b1329" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#rainDark)" />
  <!-- Condensation and glass water droplets -->
  <g fill="rgba(255,255,255,0.85)">
    <circle cx="320" cy="450" r="14" /><circle cx="323" cy="447" r="4" fill="#ffffff" />
    <circle cx="750" cy="620" r="18" /><circle cx="754" cy="616" r="5" fill="#ffffff" />
    <circle cx="180" cy="890" r="10" /><circle cx="540" cy="980" r="22" />
    <circle cx="820" cy="1150" r="12" /><circle cx="390" cy="1320" r="16" />
    <circle cx="680" cy="1540" r="11" /><circle cx="240" cy="1680" r="15" />
    <path d="M540,980 Q542,1050 540,1110" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-linecap="round" fill="none" />
  </g>
</svg>`);

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  // 1. Lion King Gold AMOLED
  {
    id: 'wp-lion-gold',
    titleAr: 'هيبة الأسد الملكي بالذهب أموليد',
    titleEn: 'Royal Lion AMOLED Gold',
    category: 'amoled',
    imageUrl: wpLionGold,
    dominantColor: '#d97706',
    colorCategory: 'gold',
    tags: ['أسد', 'أموليد', 'ذهب', 'فخامة', 'حيوانات', 'قوة', 'أسود نقي'],
    views: 31200,
    downloads: 14850,
    likes: 6720,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'بورتريه ملكي ساحر لأسد يطل من عتمة الأموليد النقية مع إضاءة ذهبية محيطة بملامحه.',
    descriptionEn: 'Majestic royal lion emerging from pure black darkness with golden fur rim lighting.',
    featured: true,
    credit: 'مجموعة رَوْنَق الملكية'
  },
  // 2. Crystal Ocean Wave Sunset
  {
    id: 'wp-ocean-wave',
    titleAr: 'موجة المحيط الفيروزية وغروب الشمس',
    titleEn: 'Turquoise Crystal Wave Sunset',
    category: 'nature',
    imageUrl: wpOceanWave,
    dominantColor: '#06b6d4',
    colorCategory: 'blue',
    tags: ['بحر', 'محيط', 'أمواج', 'طبيعة', 'فيروزي', 'غروب', 'انتعاش'],
    views: 29400,
    downloads: 13910,
    likes: 5890,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'موجة كريستالية فيروزية تخترقها أشعة الشمس الذهبية في مشهد طبيعي يأسر القلوب.',
    descriptionEn: 'Breathtaking crystal turquoise barrel wave bathed in golden hour sunset light.',
    featured: true,
    credit: 'رَوْنَق - استوديو الطبيعة'
  },
  // 3. Arabian Falcon Sunset Sky
  {
    id: 'wp-falcon-sky',
    titleAr: 'الصقر العربي وكبرياء الصحراء',
    titleEn: 'Arabian Falcon Dunes Twilight',
    category: 'nature',
    imageUrl: wpFalconSky,
    dominantColor: '#ea580c',
    colorCategory: 'sunset',
    tags: ['صقر', 'صحراء', 'أصالة', 'تراث', 'طيور', 'غروب', 'شموخ'],
    views: 27800,
    downloads: 12400,
    likes: 5410,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'صقر عربي شامخ بعينين ثاقبتين على قمة كثيب رملي تحت سماء الشفق الذهبي.',
    descriptionEn: 'Majestic Arabian falcon perched gracefully on a sand dune under twilight sky.',
    featured: true,
    credit: 'مجموعة رَوْنَق التراثية'
  },
  // 4. Mount Fuji Sakura Dawn
  {
    id: 'wp-fuji-sakura',
    titleAr: 'جبل فوجي وزهور الساكورا الفاتنة',
    titleEn: 'Mount Fuji Cherry Blossoms',
    category: 'nature',
    imageUrl: wpFujiSakura,
    dominantColor: '#f43f5e',
    colorCategory: 'crimson',
    tags: ['اليابان', 'جبل فوجي', 'ساكورا', 'وردي', 'طبيعة', 'هدوء', 'بحيرة'],
    views: 33100,
    downloads: 15600,
    likes: 7120,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'قمة جبل فوجي المكللة بالثلوج وانعكاسها على البحيرة مع بتلات الكرز الوردية المتفتحة.',
    descriptionEn: 'Serene Mount Fuji snowy peak framed by cherry blossoms and lake reflection.',
    featured: true,
    credit: 'رَوْنَق - الشرق الأقصى'
  },
  // 5. Desert Aurora
  {
    id: 'wp-desert-aurora',
    titleAr: 'شفق الصحراء الساحر',
    titleEn: 'Desert Aurora Dunes',
    category: 'nature',
    imageUrl: wpDesertAurora,
    dominantColor: '#8b5cf6',
    colorCategory: 'purple',
    tags: ['طبيعة', 'صحراء', 'شفق', 'كوزميك', 'سماء ليلية', 'رمال ذهبية'],
    views: 24500,
    downloads: 11210,
    likes: 4980,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'كثبان رملية ساحرة تحت سماء شفقية أرجوانية مرصعة بالنجوم اللامعة.',
    descriptionEn: 'Majestic desert dunes glowing under cosmic aurora borealis and starlight.',
    featured: true,
    credit: 'مجموعة رَوْنَق الملكية'
  },
  // 6. AMOLED Molten Gold
  {
    id: 'wp-amoled-gold',
    titleAr: 'سائل الذهب الخالص أموليد',
    titleEn: 'AMOLED Molten Gold Flow',
    category: 'amoled',
    imageUrl: wpAmoledGold,
    dominantColor: '#d97706',
    colorCategory: 'gold',
    tags: ['أموليد', 'ذهب', 'فخامة', 'أسود نقي', 'تجريدي', 'توفير البطارية'],
    views: 28390,
    downloads: 13450,
    likes: 6190,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'خلفية أموليد سوداء عميقة مع تدفقات ثلاثية الأبعاد من سائل الذهب الفاخر الموفر للطاقة.',
    descriptionEn: 'True black AMOLED luxury wallpaper with liquid gold ribbon refractions.',
    featured: true,
    credit: 'مجموعة رَوْنَق الملكية'
  },
  // 7. Islamic Archway
  {
    id: 'wp-islamic-arch',
    titleAr: 'محراب أندلسي ونور هلالي',
    titleEn: 'Andalusian Archway Serenity',
    category: 'islamic',
    imageUrl: wpIslamicArch,
    dominantColor: '#0f766e',
    colorCategory: 'emerald',
    tags: ['إسلامية', 'عمارة', 'أندلسية', 'محراب', 'قوس', 'هلال', 'روحانية'],
    views: 25820,
    downloads: 11730,
    likes: 5270,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'قوس معماري أندلسي بنقوش هندسية دقيقة يطل على باحة هادئة تضيئها قناديل دافئة ونور الهلال.',
    descriptionEn: 'Intricate Islamic geometric archway overlooking a serene courtyard under moonlit sky.',
    featured: true,
    credit: 'مجموعة رَوْنَق الملكية'
  },
  // 8. Cyberpunk Rain
  {
    id: 'wp-cyber-rain',
    titleAr: 'مطر السايبر ونيون المدينة',
    titleEn: 'Cyberpunk Tokyo Rain',
    category: 'cyberpunk',
    imageUrl: wpCyberRain,
    dominantColor: '#06b6d4',
    colorCategory: 'blue',
    tags: ['سايبربنك', 'نيون', 'مطر', 'شوارع ليلية', 'انعكاسات', 'سينمائي'],
    views: 26100,
    downloads: 12890,
    likes: 5630,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'شوارع مستقبلية تبللها قطرات المطر مع انعكاسات نيون زرقاء ووردية خلابة.',
    descriptionEn: 'Atmospheric rainy cyberpunk avenue with soft neon reflections in wet pavement.',
    featured: true,
    credit: 'مجموعة رَوْنَق الملكية'
  },
  // 9. Islamic Calligraphy & Moon
  {
    id: 'wp-islamic-moon',
    titleAr: 'تسبيح وهلال الفجر الزمردي',
    titleEn: 'Subhanallah Moon Serenity',
    category: 'islamic',
    imageUrl: islamicCalligraphyMoonSvg,
    dominantColor: '#047857',
    colorCategory: 'emerald',
    tags: ['إسلامية', 'تسبيح', 'هلال', 'ذكر', 'زمرد', 'ذهب'],
    views: 21400,
    downloads: 9800,
    likes: 4620,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'عبارة «سبحان الله وبحمده» بنقش كوفي وهلال ذهبي مشع على خلفية زمردية مريحة للعين.',
    descriptionEn: 'Elegant Islamic calligraphy with glowing gold crescent on emerald background.',
    featured: true,
    credit: 'رَوْنَق - الفن الإسلامي'
  },
  // 10. Polar Aurora Glow
  {
    id: 'wp-aurora-glow',
    titleAr: 'أضواء الشفق القطبي الكوني',
    titleEn: 'Polar Aurora Borealis',
    category: 'nature',
    imageUrl: callAuroraGlow,
    dominantColor: '#10b981',
    colorCategory: 'emerald',
    tags: ['شفق قطبي', 'طبيعة', 'سماء خضراء', 'جبال ثلجية', 'سحر'],
    views: 18400,
    downloads: 8540,
    likes: 3980,
    resolution: 'QHD+ (1440x2560)',
    aspectRatio: '9:16',
    descriptionAr: 'تموجات الشفق القطبي الزمردي المتلألئ فوق قمم الجبال الساحرة.',
    descriptionEn: 'Shimmering emerald aurora borealis over snowy mountain peaks.',
    featured: false,
    credit: 'رَوْنَق - استوديو الطبيعة'
  },
  // 11. Cyber Neon
  {
    id: 'wp-cyber-neon',
    titleAr: 'بوابة النيون السيبرانية',
    titleEn: 'Cyber Neon Gateway',
    category: 'cyberpunk',
    imageUrl: callCyberNeon,
    dominantColor: '#ec4899',
    colorCategory: 'purple',
    tags: ['نيون', 'بوابة', 'أرجواني', 'سايبر', 'مستقبل'],
    views: 17300,
    downloads: 7980,
    likes: 3450,
    resolution: 'QHD+ (1440x2560)',
    aspectRatio: '9:16',
    descriptionAr: 'أطواق نيون متوهجة بألوان الفوشيا والبنفسجي المستقبلي.',
    descriptionEn: 'Futuristic glowing magenta and purple neon rings corridor.',
    featured: false,
    credit: 'رَوْنَق - الفن الرقمي'
  },
  // 12. Royal Luxury Gold Marble
  {
    id: 'wp-luxury-gold',
    titleAr: 'بريق الذهب الرخامي الملكي',
    titleEn: 'Royal Black & Gold Marble',
    category: 'amoled',
    imageUrl: callLuxuryGold,
    dominantColor: '#b45309',
    colorCategory: 'gold',
    tags: ['رخام', 'ذهب', 'فخامة', 'أسود', 'ملكي', 'أناقة'],
    views: 24900,
    downloads: 12200,
    likes: 5610,
    resolution: '4K Ultra HD (2160x3840)',
    aspectRatio: '9:16',
    descriptionAr: 'عروق ذهبية مشعة تتخلل رخاماً أسوداً ناعماً تعكس الرقي المطلق.',
    descriptionEn: 'Gleaming gold veins weaving through midnight black imperial marble.',
    featured: true,
    credit: 'رَوْنَق - كولكشن الفخامة'
  },
  // 13. Oasis Sunset Dune
  {
    id: 'wp-sunset-dune',
    titleAr: 'غروب الواحة والكثبان الحالمة',
    titleEn: 'Oasis Sunset Mirage',
    category: 'nature',
    imageUrl: callSunsetDune,
    dominantColor: '#ea580c',
    colorCategory: 'sunset',
    tags: ['غروب', 'رمال', 'أفق', 'دفء', 'ألوان برتقالية', 'هدوء'],
    views: 19700,
    downloads: 8340,
    likes: 3890,
    resolution: 'QHD+ (1440x2560)',
    aspectRatio: '9:16',
    descriptionAr: 'دفء شمس المغيب وهي تودع الكثبان الرملية الذهبية في مشهد استرخاء بديع.',
    descriptionEn: 'Warm sunset casting gentle gradients across undulating sandy horizons.',
    featured: false,
    credit: 'رَوْنَق - استوديو الطبيعة'
  },
  // 14. Cosmos Nebula
  {
    id: 'wp-cosmos-nebula',
    titleAr: 'سديم النجوم الكونية العميق',
    titleEn: 'Deep Nebula Starfield',
    category: 'space',
    imageUrl: cosmosNebulaSvg,
    dominantColor: '#7c3aed',
    colorCategory: 'purple',
    tags: ['فضاء', 'سديم', 'مجرة', 'نجوم', 'كون', 'غامض'],
    views: 22800,
    downloads: 10890,
    likes: 4710,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'سديم كوني متدرج بالأرجواني والأزرق الفلكي مع غبار النجوم البراقة.',
    descriptionEn: 'Rich purple galaxy nebula sprinkled with bright distant celestial stars.',
    featured: true,
    credit: 'رَوْنَق - الفضاء والكون'
  },
  // 15. Black Hole Singularity
  {
    id: 'wp-black-hole',
    titleAr: 'أفق الحدث والثقب الأسود العظيم',
    titleEn: 'Black Hole Event Horizon',
    category: 'space',
    imageUrl: blackHoleGravitySvg,
    dominantColor: '#ea580c',
    colorCategory: 'sunset',
    tags: ['ثقب أسود', 'جاذبية', 'فضاء', 'أموليد', 'فيزياء'],
    views: 25100,
    downloads: 11950,
    likes: 5490,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'قرص التراكم الناري الملتف حول أفق الحدث لثقب أسود فائق الكتلة في قلب المجرة.',
    descriptionEn: 'Fiery accretion disk bending light around supermassive black hole horizon.',
    featured: true,
    credit: 'رَوْنَق - علوم الفضاء'
  },
  // 16. Rain Drops on Glass AMOLED
  {
    id: 'wp-rain-drops',
    titleAr: 'قطرات المطر الصامتة على الزجاج',
    titleEn: 'Midnight Raindrops on Glass',
    category: 'amoled',
    imageUrl: rainDropsAmoledSvg,
    dominantColor: '#0284c7',
    colorCategory: 'blue',
    tags: ['مطر', 'زجاج', 'أموليد', 'استرخاء', 'قطرات', 'ليل'],
    views: 23600,
    downloads: 11200,
    likes: 5100,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'قطرات ماء متكثفة على نافذة زجاجية في ليلة شتوية ممطرة تبعث على السكينة.',
    descriptionEn: 'Crisp condensation droplets on glass against deep AMOLED midnight backdrop.',
    featured: false,
    credit: 'رَوْنَق - الهدوء'
  },
  // 17. Emerald Oasis
  {
    id: 'wp-emerald-oasis',
    titleAr: 'الزمرد النقي وغابات السرور',
    titleEn: 'Emerald Forest Mist',
    category: 'nature',
    imageUrl: emeraldOasisSvg,
    dominantColor: '#059669',
    colorCategory: 'emerald',
    tags: ['زمرد', 'طبيعة', 'أخضر', 'راحة للعين', 'مينيمال', 'أوراق'],
    views: 16900,
    downloads: 7890,
    likes: 3450,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'تدرجات الزمرد المريحة للنظر مستوحاة من أعماق غابات الأمازون والواحات الخضراء.',
    descriptionEn: 'Calming deep emerald gradients that soothe the eye and optimize OLED efficiency.',
    featured: false,
    credit: 'رَوْنَق - إلهام الطبيعة'
  },
  // 18. Minimalist Crimson
  {
    id: 'wp-minimal-crimson',
    titleAr: 'شمس المينيماليزم القرمزية',
    titleEn: 'Minimalist Crimson Horizon',
    category: 'minimal',
    imageUrl: minimalCrimsonSvg,
    dominantColor: '#e11d48',
    colorCategory: 'crimson',
    tags: ['مينيمال', 'قرمزي', 'ياباني', 'بساطة', 'أفق', 'هدوء'],
    views: 18500,
    downloads: 8120,
    likes: 3780,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'تصميم بسيط مستوحى من فلسفة الزن اليابانية مع دائرة شمس قرمزية ناعمة.',
    descriptionEn: 'Zen-inspired minimalist composition featuring a subtle crimson sun aura.',
    featured: false,
    credit: 'رَوْنَق - بساطة'
  },
  // 19. Abstract Prism 3D
  {
    id: 'wp-abstract-prism',
    titleAr: 'منشور الألوان الكريستالي 3D',
    titleEn: '3D Prismatic Ribbon Flow',
    category: 'abstract',
    imageUrl: abstractPrismSvg,
    dominantColor: '#3b82f6',
    colorCategory: 'blue',
    tags: ['تجريدي', 'ثلاثي الأبعاد', 'منشور', 'ألوان زاهية', 'حداثة'],
    views: 21100,
    downloads: 9890,
    likes: 4500,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'أشرطة انسيابية ثلاثية الأبعاد تعكس درجات الطيف الضوئي في فضاء ليلي عميق.',
    descriptionEn: 'Flowing 3D iridescent ribbons refracting radiant spectrum colors on dark canvas.',
    featured: true,
    credit: 'رَوْنَق - فن حديث'
  },
  // 20. Anime Golden Sunset Sky
  {
    id: 'wp-anime-sunset',
    titleAr: 'سماء الأنمي والغروب الأبدي',
    titleEn: 'Anime Golden Hour Horizon',
    category: 'anime',
    imageUrl: animeSunsetSkySvg,
    dominantColor: '#f97316',
    colorCategory: 'sunset',
    tags: ['أنمي', 'غروب', 'غيوم', 'سماء دافئة', 'طيور', 'حنين'],
    views: 31800,
    downloads: 15890,
    likes: 7270,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'مشهد مستوحى من أعظم أفلام استوديو جيبلي وماكوتو شينكاي بألوان الغروب الذهبية.',
    descriptionEn: 'Nostalgic anime aesthetic golden hour clouds with silhouettes of birds in flight.',
    featured: true,
    credit: 'رَوْنَق - أنمي وفن ياباني'
  },
  // 21. Supercar GT Speed
  {
    id: 'wp-supercar-gt',
    titleAr: 'سرعة الظلام وخط النيون GT',
    titleEn: 'Midnight Supercar Lightbar',
    category: 'cars',
    imageUrl: supercarAmoledSvg,
    dominantColor: '#ff1e42',
    colorCategory: 'crimson',
    tags: ['سيارات', 'سرعة', 'أموليد', 'أحمر', 'رياضي', 'محركات'],
    views: 24900,
    downloads: 11450,
    likes: 5150,
    resolution: 'Vector UHD 4K',
    aspectRatio: '9:16',
    descriptionAr: 'شفرة ضوئية حمراء حادة لسيارة خارقة في سكون الليل، لعشاق السرعة والأداء الرياضي.',
    descriptionEn: 'Aggressive supercar LED taillight blade slicing through midnight darkness.',
    featured: false,
    credit: 'رَوْنَق - سرعة وسيارات'
  }
];

export const CATEGORIES_LIST: { id: Wallpaper['category']; nameAr: string; nameEn: string; icon: string }[] = [
  { id: 'all', nameAr: 'كل الخلفيات', nameEn: 'All', icon: 'Sparkles' },
  { id: 'amoled', nameAr: 'أموليد وسوداء', nameEn: 'AMOLED Dark', icon: 'Moon' },
  { id: 'nature', nameAr: 'طبيعة ومناظر', nameEn: 'Nature', icon: 'Trees' },
  { id: 'islamic', nameAr: 'إسلامية وتراث', nameEn: 'Islamic', icon: 'Compass' },
  { id: 'cyberpunk', nameAr: 'سايبر ونيون', nameEn: 'Cyberpunk', icon: 'Zap' },
  { id: 'space', nameAr: 'فضاء ومجرات', nameEn: 'Space', icon: 'Globe' },
  { id: 'abstract', nameAr: 'تجريدي و3D', nameEn: 'Abstract', icon: 'Layers' },
  { id: 'minimal', nameAr: 'بساطة مينيمال', nameEn: 'Minimal', icon: 'Maximize2' },
  { id: 'anime', nameAr: 'أنمي وفن ياباني', nameEn: 'Anime', icon: 'Palette' },
  { id: 'cars', nameAr: 'سيارات وسرعة', nameEn: 'Cars', icon: 'Flame' }
];

export const COLOR_FILTERS: { id: Wallpaper['colorCategory']; nameAr: string; hex: string }[] = [
  { id: 'all', nameAr: 'الكل', hex: '#64748b' },
  { id: 'dark', nameAr: 'أسود', hex: '#0f172a' },
  { id: 'gold', nameAr: 'ذهبي', hex: '#f59e0b' },
  { id: 'blue', nameAr: 'أزرق', hex: '#0284c7' },
  { id: 'emerald', nameAr: 'زمردي', hex: '#10b981' },
  { id: 'purple', nameAr: 'أرجواني', hex: '#8b5cf6' },
  { id: 'sunset', nameAr: 'غروب', hex: '#f97316' },
  { id: 'crimson', nameAr: 'قرمزي', hex: '#e11d48' }
];
