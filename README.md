# chatgpt-read-aloud

Restores and enhances ChatGPT's **Read Aloud** experience: it injects a visible
speaker button next to every assistant response, reuses ChatGPT's native
playback, and can optionally auto-start narration as soon as a reply is ready.

This repo packages that behavior as a **Firefox userscript** (Tampermonkey /
Violentmonkey) so there's no add-on signing, no packaging, and one-click
install. The original **Chrome extension** source is still included under
[`src/`](./src).

> Based on [`3choff/ChatGPT_ReadAloud`](https://github.com/3choff/ChatGPT_ReadAloud)
> — this repo ports that Chrome extension to a Firefox-friendly userscript and
> keeps the extension source alongside it.

## Features
- **Speaker shortcut** – Adds a visible read-aloud button for every ChatGPT message, avoiding the hidden overflow menu.
- **Invisible overflow menu** – Temporarily hides the contextual menu while triggering the native read-aloud control, preventing UI flicker.
- **Smart state handling** – Toggles the button between play/stop and respects manual stops and completed playback.
- **Auto-play toggle** – Choose whether new assistant responses start reading automatically.
- **Hide feedback buttons** – Optionally hide the thumbs up/down buttons.

## Install (Firefox — userscript)

1. Install a userscript manager from Firefox Add-ons:
   - [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) (recommended), or
   - [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
2. Open the raw userscript:
   [`userscript/chatgpt-read-aloud.user.js`](./userscript/chatgpt-read-aloud.user.js)
   (use GitHub's **Raw** button). Tampermonkey detects the `.user.js` file and
   shows an install prompt.
3. Click **Install**.
4. Open [chatgpt.com](https://chatgpt.com) and start a conversation. A speaker
   button appears next to each assistant response — click it to play or stop.

### Settings (Tampermonkey menu)

Userscripts have no toolbar popup, so the toggles live in the userscript
manager's menu. While on ChatGPT, click the **Tampermonkey** toolbar icon:

- **✅ / ⬜ Auto-play new responses** – start playback automatically when a reply finishes.
- **✅ / ⬜ Hide feedback buttons** – hide the thumbs up/down buttons.

The check/empty box shows the current state; clicking flips it. Choices are
saved with `GM_setValue` and remembered next time.

## Install (Chrome — extension)

The original extension still works if you prefer Chrome:

1. Clone or download this repository.
2. Go to `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the project directory (it loads
   [`manifest.json`](./manifest.json) and [`src/`](./src)).

In Chrome, the same settings appear in the extension's toolbar popup instead of
the Tampermonkey menu.

## Development notes
- Userscript logic lives in [`userscript/chatgpt-read-aloud.user.js`](./userscript/chatgpt-read-aloud.user.js);
  the Chrome content script is [`src/content/content.js`](./src/content/content.js).
  They share the same DOM selectors and timing — if ChatGPT changes its markup,
  update the selectors in both.
- The speaker SVG path used by the script lives in the content/userscript files.
- Chrome icons are declared in `manifest.json`; PNGs are under `src/assets/icons/`.

## Credits

Original Chrome extension by [3choff](https://github.com/3choff) —
[`3choff/ChatGPT_ReadAloud`](https://github.com/3choff/ChatGPT_ReadAloud).
Licensed under [Apache-2.0](./LICENSE).
