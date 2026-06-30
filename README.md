# chatgpt-read-aloud

A Firefox userscript that restores and enhances ChatGPT's **Read Aloud**
experience: it injects a visible speaker button next to every assistant
response, reuses ChatGPT's native playback, and can optionally auto-start
narration as soon as a reply is ready.

Running as a userscript (via Tampermonkey / Violentmonkey) means there's no
add-on signing, no packaging, and one-click install that persists across
restarts.

> Based on [`3choff/ChatGPT_ReadAloud`](https://github.com/3choff/ChatGPT_ReadAloud),
> a Chrome extension. This repo ports that behavior to a Firefox-friendly
> userscript.

## Features
- **Speaker shortcut** – Adds a visible read-aloud button for every ChatGPT message, avoiding the hidden overflow menu.
- **Invisible overflow menu** – Temporarily hides the contextual menu while triggering the native read-aloud control, preventing UI flicker.
- **Smart state handling** – Toggles the button between play/stop and respects manual stops and completed playback.
- **Auto-play toggle** – Choose whether new assistant responses start reading automatically.
- **Hide feedback buttons** – Optionally hide the thumbs up/down buttons.

## Install

1. Install a userscript manager from Firefox Add-ons:
   - [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) (recommended), or
   - [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
2. Open the raw userscript — the manager detects the `.user.js` file and shows
   an install prompt:
   **[chatgpt-read-aloud.user.js](https://github.com/mnoukhov/chatgpt-read-aloud/raw/main/chatgpt-read-aloud.user.js)**
3. Click **Install**.
4. Open [chatgpt.com](https://chatgpt.com) and start a conversation. A speaker
   button appears next to each assistant response — click it to play or stop.

## Settings

Userscripts have no toolbar popup, so the toggles live in the userscript
manager's menu. While on ChatGPT, click the **Tampermonkey** toolbar icon:

- **✅ / ⬜ Auto-play new responses** – start playback automatically when a reply finishes.
- **✅ / ⬜ Hide feedback buttons** – hide the thumbs up/down buttons.

The check/empty box shows the current state; clicking flips it. Choices are
saved with `GM_setValue` and remembered next time.

## Updating

The script declares `@updateURL`/`@downloadURL`, so Tampermonkey/Violentmonkey
will auto-update it from this repo. You can also force a check from the manager,
or re-open the raw file to reinstall.

## Development notes

All logic lives in [`chatgpt-read-aloud.user.js`](./chatgpt-read-aloud.user.js).
It relies on ChatGPT's DOM (the `aria-label="More actions"` button and the
`div[role="menuitem"]` entries) — if ChatGPT changes its markup, update the
selectors and timing there.

## Credits

Original Chrome extension by [3choff](https://github.com/3choff) —
[`3choff/ChatGPT_ReadAloud`](https://github.com/3choff/ChatGPT_ReadAloud).
Licensed under [Apache-2.0](./LICENSE).
