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

test('lowercase mode uses phoneme and example without the letter name', async () => {
  const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
  const lowercaseBranch = source.match(/if \(lower\) \{[\s\S]*?\n  \}/)?.[0] || '';
  assert.match(lowercaseBranch, /item\.phoneme\.audio/);
  assert.match(lowercaseBranch, /item\.example\.audio/);
  assert.doesNotMatch(lowercaseBranch, /item\.name\.audio/);
});
