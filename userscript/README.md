# ChatGPT Read Aloud — Firefox userscript

A userscript port of the Chrome extension. It does the same thing — injects a
visible Read Aloud button next to every ChatGPT response and can auto-start
narration — but runs through a userscript manager instead of being a packaged
extension. This avoids Mozilla's add-on signing requirement, so it installs in
one click and persists across restarts.

## Install

1. Install a userscript manager from Firefox Add-ons:
   - [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or
   - [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
2. Open [`chatgpt-read-aloud.user.js`](./chatgpt-read-aloud.user.js) — the
   manager detects the `.user.js` file and shows an install prompt. (Use the
   "Raw" view if you're browsing on GitHub.)
3. Click **Install**.
4. Open [chatgpt.com](https://chatgpt.com) and start a conversation. A speaker
   button appears next to each assistant response — click it to play or stop.

## Settings

The Chrome version used a toolbar popup; userscripts have no popup, so the two
toggles live in the userscript manager's menu instead. Click the
Tampermonkey/Violentmonkey toolbar icon while on ChatGPT and you'll see:

- **Auto-play new responses** — start playback automatically when a reply finishes.
- **Hide feedback buttons** — hide the thumbs up/down buttons.

A ✅ / ⬜ next to each label shows whether it's on. Selecting it flips the
setting; the choice is saved with `GM_setValue` and remembered next time.

## Updating

The script header carries a `@version`. If you host the raw file somewhere with
`@updateURL`/`@downloadURL`, the manager can auto-update; otherwise re-open the
`.user.js` file to install a newer version over the old one.
