# Cabeza de Vaca's Journey

**Unit 2 · 7th Grade Texas History · Age of Contact & Spanish Colonial**
TEKS **7.2B, 7.2A** (Cabeza de Vaca and exploration; the peoples he lived among), with the journey map giving **7.9A** (regions) at headline level.

A solo survival journey: shipwrecked on a Texas island in November 1528 with
nothing — not even shoes — you play **Álvar Núñez Cabeza de Vaca** through
eight years among peoples whose languages you don't speak, becoming a servant,
a trader, a healer, and finally a legend who walks all the way to Mexico. The
first European account of Texas is a story where the explorer survives only by
**learning from and depending on Native peoples** — the game flips the
conqueror script. **Estevanico is named and honored.** Every run ends with the
debrief carrying his report's double legacy: an argument for kindness, and the
garbled gold rumors that launched Coronado.

It runs on the same shared **Socket.IO game engine** as Chronos Protocol,
Survive the Season, Claim the Land, and Hold the Line: a server-authoritative
Node + Express + Socket.IO backend and a thin React + Vite client, deployed as
one Render web service. **All session state lives in server memory — no
database.** Ending a session (or the idle sweep, or a Render spin-down) erases
it. The teacher's PDF is the only lasting record.

## How it plays

- **6 chapters** of the journey (1528–1536): Malhado → the hard years → the
  trader → the escape west → the healer's road → the slavers. Each chapter: an
  event card, then **two decisions** (3 choices each). **12 graded actions** total.
- **Three meters** (start 50): **Health ❤️**, **Standing 🤝** (trust with the
  peoples he lives among — the game's engine), **Hope 🌅**.
  **Journey Score** = the three added up (max 300).
- **Endings** by Journey Score: *The Long Walk Home* (≥220), *Survivor of
  Malhado* (≥150), *Lost to the Island* (<150). Finishing with Health at 0
  tells the low ending in its collapse voice. (The run always plays all 12
  actions, so the teacher's grade stays honest — no early termination.)
- A passive **journey map** (inline SVG, no image needed) unrolls a stop per
  chapter from Isla de Malhado to Mexico City, naming the regions it crosses.
- **Accuracy** (the grade the teacher sees) = right 1 / partial 0.5 / wrong 0,
  over 12 actions, computed **server-side** — the client never holds the answer key.

## Project layout

```
server/          Shared Socket.IO engine + games/cabezaDeVaca.js (+ _stepGame.js factory)
client/          React 18 + Vite (Datapad game view + JourneyMap + CommandCenter)
assets/images/   place Higgsfield art here (also copy into client/public/assets/images)
render.yaml      Render web-service template
package.json     root: postinstall installs server/ + client/; build compiles client
```

The engine is single-role solo for this game (`sides: ['cabeza']`): everyone
walks the same road, so the class is one group ("The Castaways").
`server/src/games/_stepGame.js` is the reusable factory that turns the chapter
content in `cabezaDeVaca.js` into the adapter the `GameManager` drives.

## Run locally

```bash
npm install          # cascades installs into server/ and client/
npm test             # server tests (scoring, content/balance, GameManager)
npm run build        # build the client into client/dist
npm start            # serve the whole app at http://localhost:4000
```

For hot-reload dev, run `npm run dev:server` and `npm run dev:client` in two
terminals (Vite proxies `/socket.io` to the server on :4000).

- **Students:** open the base URL. Enter the class code + a first name.
- **Teacher Command Center:** open the base URL with `#teacher`
  (e.g. `http://localhost:4000/#teacher`). Create a session (4-digit PIN),
  approve names, watch live status + class accuracy, download the PDF, End Session.

## Deploy (Render) & embed (Wix)

1. Push to GitHub. On **Render**, create a **Web Service** from the repo
   (`buildCommand: npm install && npm run build`, `startCommand: node server/src/index.js`,
   free plan). Live at e.g. `https://cabeza-de-vaca-journey.onrender.com`.
2. In **Wix**: embed the Render **student URL** on a public page; embed the
   **`#teacher`** URL on a **password-protected** page (the in-app PIN is a second
   layer). Use the `https://` URL; push to GitHub to redeploy.

## Art

Images resolve through `client/public/assets/images/`. Missing files degrade to
a styled placeholder, so the game is playable art-or-no-art. Priority assets
(semi-realistic, cinematic, respectful — Native peoples with dignity and agency,
no gore): `title_hero.jpg`, the six chapter scenes
(`event_malhado/hardyears/trader/escape/healers/slavers.jpg`), and `ending.jpg`.
The journey map is inline SVG — no image needed.

## Sensitivity notes honored (from the build spec)

- Native peoples are rescuers, teachers, and hosts with full agency; the
  hardship years are told without villainizing any people.
- Estevanico is named and honored (Chapter 4 and the debrief).
- The slaver scene is the moral spine, told at headline level, no gore.
- The debrief closes on the report's double legacy (humane argument + gold
  rumors → Coronado), TEKS 7.2B's cause-and-effect.
