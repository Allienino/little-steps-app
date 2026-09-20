import test from 'node:test';
import assert from 'node:assert/strict';

let speechCancels = 0;
globalThis.speechSynthesis = {
  addEventListener() {}, getVoices() { return []; }, cancel() { speechCancels += 1; }
};
await import('../audio-controller.js');

test('muting stops active media and cancels queued speech', () => {
  const controller = new globalThis.LittleStepsAudioController();
  let paused = 0;
  let loaded = 0;
  controller.activeAudio = { pause() { paused += 1; }, removeAttribute() {}, load() { loaded += 1; } };
  controller.setEnabled(false);
  assert.equal(controller.enabled, false);
  assert.equal(paused, 1);
  assert.equal(loaded, 1);
  assert.ok(speechCancels >= 1);
});

test('a new sequence invalidates the previous request', async () => {
  const controller = new globalThis.LittleStepsAudioController();
  const ids = [];
  controller.playAsset = async (_src, id) => { ids.push(id); return true; };
  controller.pause = async () => true;
  await controller.playSequence([{ audio: 'first.mp3' }], 'en-GB');
  await controller.playSequence([{ audio: 'second.mp3' }], 'en-GB');
  assert.equal(ids.length, 2);
  assert.ok(ids[1] > ids[0]);
});

test('missing phoneme audio never falls back to TTS', async () => {
  const controller = new globalThis.LittleStepsAudioController();
  let spoken = 0;
  controller.playAsset = async () => false;
  controller.speakText = async () => { spoken += 1; return true; };
  controller.pause = async () => true;
  await controller.playSequence([{ audio: 'missing.mp3', fallbackText: 'fake phoneme', allowTts: false }], 'en-GB');
  assert.equal(spoken, 0);
});

test('one sequence visits each requested segment only once', async () => {
  const controller = new globalThis.LittleStepsAudioController();
  const visited = [];
  controller.playAsset = async source => { visited.push(source); return true; };
  controller.pause = async () => true;
  await controller.playSequence([
    { audio: 'name.mp3' },
    { audio: 'sound.mp3', allowTts: false },
    { audio: 'example.mp3' }
  ], 'en-GB');
  assert.deepEqual(visited, ['name.mp3', 'sound.mp3', 'example.mp3']);
});
