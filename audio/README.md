# Required pronunciation recordings

Do not synthesize these paths from IPA text. Supply clean, child-friendly recordings with no music and no added schwa. MP3 is used here for broad browser and installed-PWA compatibility.

## English phonics — required for accurate sounds

All 26 are currently missing:

```text
audio/en/phonics/a-sound.mp3
audio/en/phonics/b-sound.mp3
audio/en/phonics/c-sound.mp3
audio/en/phonics/d-sound.mp3
audio/en/phonics/e-sound.mp3
audio/en/phonics/f-sound.mp3
audio/en/phonics/g-sound.mp3
audio/en/phonics/h-sound.mp3
audio/en/phonics/i-sound.mp3
audio/en/phonics/j-sound.mp3
audio/en/phonics/k-sound.mp3
audio/en/phonics/l-sound.mp3
audio/en/phonics/m-sound.mp3
audio/en/phonics/n-sound.mp3
audio/en/phonics/o-sound.mp3
audio/en/phonics/p-sound.mp3
audio/en/phonics/q-sound.mp3
audio/en/phonics/r-sound.mp3
audio/en/phonics/s-sound.mp3
audio/en/phonics/t-sound.mp3
audio/en/phonics/u-sound.mp3
audio/en/phonics/v-sound.mp3
audio/en/phonics/w-sound.mp3
audio/en/phonics/x-sound.mp3
audio/en/phonics/y-sound.mp3
audio/en/phonics/z-sound.mp3
```

The exact target sound for every file is defined by `phoneme.ipa` in `alphabet-data.js`. In particular: C `/k/`, G `/g/`, Q `/kw/`, X `/ks/`, and Z `/z/`.

## Optional recording replacements for TTS fallbacks

- English letter names: `audio/en/letters/a-name.mp3` through `z-name.mp3`.
- English examples: `audio/en/examples/<lowercase-word>.mp3`, using the exact `example.audio` path in `alphabet-data.js`.
- Arabic letter names: use each exact `name.audio` path in `alphabet-data.js`.
- Arabic examples: use each exact `example.audio` path in `alphabet-data.js`.

For Arabic, these native-speaker recordings are the priority missing files because TTS quality varies most for the emphatic/throat letters:

```text
audio/ar/letters/haa_deep.mp3
audio/ar/letters/khaa.mp3
audio/ar/letters/ayn.mp3
audio/ar/letters/ghayn.mp3
audio/ar/letters/qaaf.mp3
audio/ar/letters/saad.mp3
audio/ar/letters/daad.mp3
audio/ar/letters/taa_heavy.mp3
audio/ar/letters/zaa_heavy.mp3
```

The runtime falls back to an Arabic (`ar-SA`) system voice when an Arabic recording is absent. Every other exact Arabic name and example path is declared directly beside its letter in `alphabet-data.js`.
