const { englishAlphabet, arabicAlphabet, englishNumbers, arabicNumbers, arabicDigits } = globalThis.LITTLE_STEPS_DATA;
const audio = new globalThis.LittleStepsAudioController();
let language = 'en';
let lower = false;
let number = 1;
let chosen = null;
let completed = 0;
let activeLetterKey = null;

const byId = id => document.getElementById(id);
const grid = byId('letterGrid');
const soundButton = byId('soundToggle');
const currentLetters = () => language === 'ar' ? arabicAlphabet : englishAlphabet;
const currentWords = () => language === 'ar' ? arabicNumbers : englishNumbers;
const digit = value => language === 'ar' ? arabicDigits[value] : String(value);

soundButton.addEventListener('click', () => {
  audio.setEnabled(!audio.enabled);
  soundButton.textContent = audio.enabled ? '🔊 Sound' : '🔇 Muted';
  soundButton.setAttribute('aria-pressed', String(audio.enabled));
  soundButton.setAttribute('aria-label', audio.enabled ? 'Turn sound off' : 'Turn sound on');
});

function drawLetters() {
  grid.dir = language === 'ar' ? 'rtl' : 'ltr';
  grid.innerHTML = currentLetters().map((item, index) => {
    const glyph = language === 'ar' ? item.letter : (lower ? item.letter.toLowerCase() : item.letter);
    const label = language === 'ar'
      ? `حرف ${item.name.spoken}`
      : lower
        ? `Sound ${item.phoneme.ipa}, as in ${item.example.word}`
        : `Letter ${item.name.spoken}, sound ${item.phoneme.ipa}, ${item.example.word}`;
    return `<button class="tile" data-index="${index}" data-glyph="${glyph}" aria-label="${label}">${glyph}</button>`;
  }).join('');
}

function playLetter(item) {
  if (language === 'ar') {
    return audio.playSequence([
      { audio: item.name.audio, fallbackText: item.name.spoken },
      { audio: item.example.audio, fallbackText: item.example.word }
    ], 'ar-SA');
    return;
  }
  if (lower) {
    return audio.playSequence([
      { audio: item.phoneme.audio, allowTts: false },
      { audio: item.example.audio, fallbackText: item.example.word }
    ], 'en-GB');
  }
  return audio.playSequence([
    { audio: item.name.audio, fallbackText: item.name.spoken },
    // Browser TTS must never synthesize an isolated phoneme; it commonly adds a schwa.
    { audio: item.phoneme.audio, allowTts: false },
    { audio: item.example.audio, fallbackText: item.example.word }
  ], 'en-GB');
}

grid.addEventListener('click', event => {
  const tile = event.target.closest('.tile');
  if (!tile) return;
  grid.querySelectorAll('.tile').forEach(item => item.classList.remove('chosen'));
  tile.classList.add('chosen');
  const item = currentLetters()[Number(tile.dataset.index)];
  const letterKey = `${language}:${item.letter}`;
  if (activeLetterKey === letterKey) return;
  activeLetterKey = letterKey;
  byId('letterInfo').innerHTML = language === 'ar'
    ? `<strong>${item.letter} — ${item.name.spoken} (${item.name.label})</strong>مثال: ${item.example.word}`
    : lower
      ? `<strong>${item.letter.toLowerCase()} — Sound ${item.phoneme.ipa}</strong>as in <em>${item.example.word}</em>`
      : `<strong>${item.letter} — Name ${item.name.ipa} (${item.name.spoken})</strong>Sound ${item.phoneme.ipa} as in <em>${item.example.word}</em>`;
  playLetter(item).finally(() => {
    if (activeLetterKey === letterKey) activeLetterKey = null;
  });
});

byId('letterCase').addEventListener('click', () => {
  audio.stop();
  activeLetterKey = null;
  lower = !lower;
  byId('lettersPrompt').textContent = lower
    ? 'Tap a lowercase letter to hear its sound and example word.'
    : 'Tap a letter to hear its name, sound, and example word.';
  byId('letterInfo').textContent = lower
    ? 'Tap a lowercase letter to see its phonics sound.'
    : 'Tap a letter to see its exact pronunciation.';
  drawLetters();
});

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  audio.stop();
  document.querySelectorAll('.tab').forEach(item => item.setAttribute('aria-selected', 'false'));
  document.querySelectorAll('.panel').forEach(item => item.classList.remove('active'));
  tab.setAttribute('aria-selected', 'true');
  byId(tab.dataset.tab).classList.add('active');
}));

function drawNumber() {
  byId('numberSymbol').textContent = digit(number);
  byId('numberWord').textContent = currentWords()[number];
  byId('countLabel').textContent = language === 'ar' ? `${digit(number)} ${number === 1 ? 'شكل' : 'أشكال'}` : (number === 1 ? '1 shape' : `${number} shapes`);
  byId('shapes').innerHTML = number === 0
    ? `<span style="color:var(--muted)">${language === 'ar' ? 'لا أشكال' : 'No shapes'}</span>`
    : Array.from({ length: number }, (_, index) => `<i class="shape ${index % 3 === 0 ? 'circle' : index % 3 === 1 ? '' : 'diamond'}"></i>`).join('');
}

function speakNumber(value) {
  audio.playSequence([{ fallbackText: currentWords()[value] }], language === 'ar' ? 'ar-SA' : 'en-GB');
}

byId('prevNum').addEventListener('click', () => { number = (number + 10) % 11; drawNumber(); speakNumber(number); });
byId('nextNum').addEventListener('click', () => { number = (number + 1) % 11; drawNumber(); speakNumber(number); });
byId('numberSymbol').parentElement.addEventListener('click', () => speakNumber(number));

function dots(value) {
  return `<div class="shape-row" aria-label="${value} shapes">${Array.from({ length: value }, () => '<i class="shape circle"></i>').join('')}</div>`;
}
function shuffle(values) { return values.sort(() => Math.random() - 0.5); }
function newGame() {
  chosen = null;
  completed = 0;
  byId('stars').textContent = '';
  const set = shuffle([1,2,3,4,5]).slice(0,3).sort();
  byId('matchNums').innerHTML = set.map(value => `<button class="match" data-n="${value}">${digit(value)}</button>`).join('');
  byId('matchShapes').innerHTML = shuffle(set.slice()).map(value => `<button class="match" data-n="${value}" aria-label="${value} shapes">${dots(value)}</button>`).join('');
}

byId('newMatch').addEventListener('click', () => { newGame(); audio.playTone(); });
byId('matchNums').addEventListener('click', event => {
  const button = event.target.closest('.match');
  if (!button || button.classList.contains('done')) return;
  byId('matchNums').querySelectorAll('.match').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  chosen = button;
  speakNumber(Number(button.dataset.n));
});
byId('matchShapes').addEventListener('click', event => {
  const button = event.target.closest('.match');
  if (!button || !chosen || button.classList.contains('done')) return;
  if (button.dataset.n === chosen.dataset.n) {
    button.classList.add('done');
    chosen.classList.add('done');
    chosen.classList.remove('selected');
    chosen = null;
    completed += 1;
    byId('stars').textContent = '★'.repeat(completed);
    audio.playTone('good');
    if (completed === 3) {
      byId('stars').textContent = language === 'ar' ? '★ ★ ★  جَمِيل!' : '★ ★ ★  Well done!';
      setTimeout(() => audio.playSequence([{ fallbackText: language === 'ar' ? 'جَمِيل' : 'Well done!' }], language === 'ar' ? 'ar-SA' : 'en-GB'), 550);
    }
  } else {
    audio.playTone('try');
    button.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], { duration: 180 });
  }
});

function applyLanguage() {
  audio.stop();
  activeLetterKey = null;
  const arabic = language === 'ar';
  if (arabic) lower = false;
  document.documentElement.lang = language;
  byId('letterCase').hidden = arabic;
  byId('lettersTab').textContent = arabic ? 'أ ب ج' : 'ABC';
  byId('numbersTab').textContent = arabic ? '١٢٣' : '123';
  byId('matchTab').textContent = arabic ? 'طابق' : 'Match';
  byId('lettersTitle').textContent = arabic ? 'اختر حرفًا' : 'Choose a letter';
  byId('lettersPrompt').textContent = arabic ? 'اضغط على أي حرف لسماع اسمه وكلمة مثال.' : 'Tap a letter to hear its name, sound, and example word.';
  byId('letterInfo').textContent = arabic ? 'اضغط على حرف لرؤية اسمه ومثال.' : 'Tap a letter to see its exact pronunciation.';
  byId('numbersTitle').textContent = arabic ? 'اختر رقمًا' : 'Choose a number';
  byId('numbersPrompt').textContent = arabic ? 'اضغط وانظر وعدّ الأشكال.' : 'Tap, look, and count the shapes.';
  byId('matchTitle').textContent = arabic ? 'طابق الأزواج' : 'Match the pairs';
  byId('matchPrompt').textContent = arabic ? 'اضغط رقمًا، ثم اضغط المجموعة المطابقة.' : 'Tap a number, then tap the same group.';
  byId('newMatch').textContent = arabic ? 'مجموعة جديدة' : 'New set';
  byId('prevNum').textContent = arabic ? 'السابق ←' : '← Back';
  byId('nextNum').textContent = arabic ? '→ التالي' : 'Next →';
  byId('quietNote').hidden = arabic;
  byId('quietNote').textContent = 'Spoken words and gentle feedback. No music or moving pictures.';
  byId('languageToggle').setAttribute('aria-label', arabic ? 'Switch to English' : 'Switch to Arabic');
  drawLetters();
  drawNumber();
  newGame();
}

byId('languageToggle').addEventListener('click', () => { language = language === 'en' ? 'ar' : 'en'; applyLanguage(); });

let installPrompt;
const installButton = byId('installButton');
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
installButton.addEventListener('click', async () => {
  if (installPrompt) {
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    installPrompt = null;
    if (choice.outcome === 'accepted') installButton.textContent = 'Installing…';
  } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
    alert('To install Little Steps: tap Share, then Add to Home Screen.');
  } else {
    alert('To install Little Steps, use the install icon in the address bar or open your browser menu and choose “Install Little Steps” or “Add to Home Screen”.');
  }
});
if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
  installButton.textContent = 'Installed ✓';
  installButton.disabled = true;
}
window.addEventListener('appinstalled', () => {
  installButton.textContent = 'Installed ✓';
  installButton.disabled = true;
});
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));

drawLetters();
drawNumber();
newGame();
