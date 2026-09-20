# Little Steps

A calm, installable alphabet and number learning web app for young children.

## Included

- English and Arabic alphabets
- English numbers and Arabic-Indic numerals from 0 to 10
- Centralized, interruption-safe spoken pronunciation and gentle feedback sounds
- No background music
- Number counting and matching activities
- Installable on supported phones, tablets, and computers
- Offline support after the first visit

## Pronunciation audio

The alphabet metadata is centralized in `alphabet-data.js`, and all playback is controlled by `audio-controller.js`. The app prefers recorded files. English letter names and example words may fall back to British English browser speech; Arabic names and examples may fall back to `ar-SA` browser speech.

English phonemes deliberately have **no TTS fallback**. Browser speech engines do not reliably pronounce isolated phonemes and often add a schwa. Until the real recordings listed in `audio/README.md` are supplied, the app will say the letter name and example word but skip the missing phoneme segment.

Uppercase mode teaches the letter name, sound, and example. Lowercase mode is phonics-only: it plays the sound and example without saying the letter name.

The old flat `.wav` files are not used: an audio audit found that they contain zero audio bytes.

## Open in VS Code

1. Extract `little-steps-app.zip`.
2. Open Visual Studio Code.
3. Choose **File → Open Folder**.
4. Select the extracted `little-steps-app` folder.

## Preview locally

From the VS Code terminal, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploy

This is a static web app with no build step. Upload all files in this folder to the root of a static host such as GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

For GitHub Pages, create a repository, add these files at its root, commit and push them, then enable Pages in the repository settings using the root of the main branch.
