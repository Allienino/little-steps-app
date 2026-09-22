import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
await import('../alphabet-data.js');

const { englishAlphabet, arabicAlphabet } = globalThis.LITTLE_STEPS_DATA;

test('English alphabet has 26 unique complete records', () => {
  assert.equal(englishAlphabet.length, 26);
  assert.equal(new Set(englishAlphabet.map(item => item.letter)).size, 26);
  for (const item of englishAlphabet) {
    assert.ok(item.name.ipa && item.name.spoken && item.name.audio);
    assert.ok(item.phoneme.ipa && item.phoneme.audio);
    assert.ok(item.example.word && item.example.audio);
  }
});

test('required British and primary phonics values are exact', () => {
  const byLetter = Object.fromEntries(englishAlphabet.map(item => [item.letter, item]));
  assert.deepEqual([byLetter.Z.name.ipa, byLetter.Z.name.spoken, byLetter.Z.phoneme.ipa], ['/zɛd/', 'zed', '/z/']);
  assert.equal(byLetter.C.phoneme.ipa, '/k/');
  assert.equal(byLetter.G.phoneme.ipa, '/g/');
  assert.equal(byLetter.Q.phoneme.ipa, '/kw/');
  assert.equal(byLetter.X.phoneme.ipa, '/ks/');
});

test('Arabic alphabet is the exact 28-letter sequence with unique records', () => {
  const expected = [...'ابتثجحخدذرزسشصضطظعغفقكلمن'].concat(['هـ','و','ي']);
  assert.equal(arabicAlphabet.length, 28);
  assert.deepEqual(arabicAlphabet.map(item => item.letter), expected);
  assert.equal(new Set(arabicAlphabet.map(item => item.letter)).size, 28);
  for (const item of arabicAlphabet) {
    assert.ok(item.name.label && item.name.spoken && item.name.audio);
    assert.ok(item.example.word && item.example.audio);
  }
});

test('Arabic Laam and Ghayn use explicit final sukun for TTS', () => {
  const byLetter = Object.fromEntries(arabicAlphabet.map(item => [item.letter, item]));
  assert.equal(byLetter['ل'].name.spoken, 'لَامْ');
  assert.equal(byLetter['غ'].name.spoken, 'غَيْنْ');
  assert.equal(byLetter['ل'].name.label, 'Laam');
  assert.equal(byLetter['غ'].name.label, 'Ghayn');
  assert.equal(byLetter['ل'].name.audio, 'audio/ar/letters/laam.m4a');
  assert.equal(byLetter['غ'].name.audio, 'audio/ar/letters/ghayn.m4a');
});

test('lowercase mode uses phoneme and example without the letter name', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  const lowercaseBranch = source.match(/if \(lower\) \{[\s\S]*?\n  \}/)?.[0] || '';
  assert.match(lowercaseBranch, /item\.phoneme\.audio/);
  assert.match(lowercaseBranch, /item\.example\.audio/);
  assert.doesNotMatch(lowercaseBranch, /item\.name\.audio/);
});

test('install button is always present and not initially hidden', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const button = html.match(/<button class="install-button"[^>]*>/)?.[0] || '';
  assert.match(button, /id="installButton"/);
  assert.doesNotMatch(button, /\shidden(?:\s|>|=)/);
});

test('Arabic matching completion uses Jameel and hides the bottom note', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(source, /★ ★ ★  جَمِيل!/);
  assert.match(source, /fallbackText: language === 'ar' \? 'جَمِيل'/);
  assert.match(source, /byId\('quietNote'\)\.hidden = arabic/);
  assert.doesNotMatch(source, /نطق لطيف دون موسيقى أو صور متحركة/);
});

test('letter instructions do not describe letters as big', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  const visibleCopy = `${html.match(/<p class="prompt" id="lettersPrompt">([^<]*)<\/p>/)?.[1] || ''}\n${source}`;
  assert.doesNotMatch(visibleCopy, /\bbig letter\b/i);
  assert.doesNotMatch(visibleCopy, /حرف(?:ًا)?\s+كبير/);
});
