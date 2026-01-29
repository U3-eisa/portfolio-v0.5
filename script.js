/* ============================================================
   Prince Portfolio – Shared Script (Home / About / Settings)
   - Theme + Language persistence (localStorage)
   - Bottom nav active indicator ball
   - Gallery (Home) active card behavior
   ============================================================ */

const STORAGE_THEME = 'pp_theme';
const STORAGE_LANG = 'pp_lang';

const I18N = {
  en: {
    nav_home: 'Home',
    nav_about: 'About',
    nav_settings: 'Settings',

    settingsTitle: 'Settings',
    settingsDesc: 'Choose a theme color and language.',
    themeTitle: 'Theme',
    themeDefault: 'Default',
    themeDark: 'Dark',
    themeOcean: 'Ocean',
    langTitle: 'Language',
    langNote: 'Language changes the text on the pages.',

    aboutTitle: 'About',
    aboutDesc: 'Welcome to my art portfolio. Here you can see selected drawings and portraits.',
    socialsTitle: 'Socials',

    // Gallery items (keep your existing text)
    zenitsuTitle: 'Zenitsu',
    zenitsuDesc: 'An anime character – Zenitsu Agatsuma. Calm strength and lightning energy.'
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_about: 'عني',
    nav_settings: 'الإعدادات',
    
    main_name: 'بشير عيسى بشير',
    info_main:'مهندس كهرباء',
    settingsTitle: 'الإعدادات',
    settingsDesc: 'اختار الثيم واللغة.',
    themeTitle: 'الثيم',
    themeDefault: 'الافتراضي',
    themeDark: 'داكن',
    themeOcean: 'محيط',
    langTitle: 'اللغة',
    langNote: 'تغيير اللغة يغيّر النصوص في الصفحات.',

    aboutTitle: 'عني',
    aboutDesc: 'أهلاً بك في معرض أعمالي. هنا ستجد بعض الرسومات والبورتريهات المختارة.',
    socialsTitle: 'روابط التواصل',

    zenitsuTitle: 'زينيتسو',
    zenitsuDesc: 'شخصية أنمي – زينيتسو أغاتسوما. هدوء وقوة وطاقة البرق.',

    milesTiltle: 'مايلز مورالِس',
    milesDis:'رسمة مستوحاة من عالم سبايدر-فيرس، تعبّر عن الحركة والقوة والطاقة الشبابية بأسلوب جريء وتباين لوني واضح.',

    ahmedsalimTiltle:'احمد سالم',
    ahmedsalimDis:'بورتريه واقعي يُبرز ملامح الثقة والهدوء، مع تركيز على التعبير الوجهي والطاقة الإيجابية في النظرة.',

    freckTiltle:'جمال النمش الصامت',
    freckDis:'دراسة بورتريه مقرّبة تُظهر نعومة التظليل، تفاصيل البشرة، وعمق النظرة مع إحساس هادئ وطبيعي.',

    urlieTiltle:'كذبتك في ابريل',
    urlieDis:'كولاج فني مستوحى من أنمي كذبتك في ابريل ، يجسّد اللحظات العاطفية بأسلوب ناعم وخطوط نظيفة وألوان هادئة.',

    jonyTiltle:'جوني ديب',
    jonyDis:'بورتريه تكريمي للممثل العالمي جوني ديب، مستوحى من شخصية الكابتن جاك سبارو، مع اهتمام بالتفاصيل والعمق التعبيري.',
  }
};

function getLang() {
  return localStorage.getItem(STORAGE_LANG) || 'en';
}

function getTheme() {
  return localStorage.getItem(STORAGE_THEME) || 'default';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_THEME, theme);
  updateThemeButtons(theme);
}

function applyLang(lang) {
  const dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem(STORAGE_LANG, lang);
  translatePage(lang);
  updateLangButtons(lang);

  // Ball positioning can change with RTL/text length, so update after layout
  requestAnimationFrame(() => requestAnimationFrame(updateBallPosition));
}

function translatePage(lang) {
  const dict = I18N[lang] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] != null) el.textContent = dict[key];
  });
}

function updateThemeButtons(activeTheme) {
  document.querySelectorAll('[data-set-theme]').forEach((btn) => {
    const isActive = btn.getAttribute('data-set-theme') === activeTheme;
    btn.classList.toggle('selected', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function updateLangButtons(activeLang) {
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    const isActive = btn.getAttribute('data-set-lang') === activeLang;
    btn.classList.toggle('selected', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/* ----------------- Bottom nav ball ----------------- */
function setActiveNavByPage() {
  const page = document.body.getAttribute('data-page') || 'home';
  const items = document.querySelectorAll('.bottom-nav li.navi');
  items.forEach((li) => li.classList.remove('clicked'));

  const active = document.querySelector(`.bottom-nav li.navi[data-page="${page}"]`);
  if (active) active.classList.add('clicked');
}

function updateBallPosition() {
  const nav = document.querySelector('.bottom-nav');
  const list = document.querySelector('.bottom-nav ul');
  const ball = document.querySelector('.bottom-nav .ball');
  const active = document.querySelector('.bottom-nav li.navi.clicked');

  if (!nav || !list || !ball || !active) return;

  const activeRect = active.getBoundingClientRect();
  const listRect = list.getBoundingClientRect();

  // Center the ball above the active item
  const ballSize = ball.getBoundingClientRect().width || 64;
  const left = (activeRect.left - listRect.left) + (activeRect.width / 2) - (ballSize / 2);
  ball.style.left = `${Math.round(left)}px`;
}

function enableNavClicks() {
  const items = document.querySelectorAll('.bottom-nav li.navi');
  items.forEach((li) => {
    li.addEventListener('click', () => {
      items.forEach((x) => x.classList.remove('clicked'));
      li.classList.add('clicked');
      updateBallPosition();
    });
  });
}

/* ----------------- Gallery (Home) ----------------- */
function enableGallery() {
  const sliders = document.querySelectorAll('.contaner2 .slider');
  if (!sliders.length) return;

  const setActive = (el) => {
    sliders.forEach((s) => s.classList.remove('active'));
    el.classList.add('active');
    // Make sure the active card is visible
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  sliders.forEach((slider) => {
    slider.addEventListener('click', () => setActive(slider));
  });

  // Ensure one is active on load
  const existing = document.querySelector('.contaner2 .slider.active');
  if (!existing) setActive(sliders[0]);
}

/* ----------------- Settings page buttons ----------------- */
function enableSettingsControls() {
  document.querySelectorAll('[data-set-theme]').forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-set-theme')));
  });

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-set-lang')));
  });
}

/* ----------------- Init ----------------- */
(function init() {
  // Apply saved settings first
  applyTheme(getTheme());
  applyLang(getLang());

  setActiveNavByPage();
  enableNavClicks();
  enableGallery();
  enableSettingsControls();

  // Position the ball after everything is laid out
  window.addEventListener('load', updateBallPosition);
  window.addEventListener('resize', updateBallPosition);
})();
