<div align="center">

# 🎙️ LTT-Advocate
### A Devil’s Advocate production companion

**Coin toss · Debate timers · Speaker cues · Broadcast overlays · Clip-ready layouts**

An unofficial, browser-based production tool inspired by the WAN Show’s Devil’s Advocate segment.

[**🎬 Try the guided walkthrough**](https://rstevens-dev.github.io/LTT-Advocate/?walkthrough=1) · [**🎛️ Open the producer**](https://rstevens-dev.github.io/LTT-Advocate/) · [**📺 View the wide display**](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=wide)

![Version](https://img.shields.io/badge/version-0.6.2-orange) ![Platform](https://img.shields.io/badge/platform-browser--only-333333) ![Status](https://img.shields.io/badge/status-experimental-yellow)

</div>

> [!IMPORTANT]
> **Unofficial community prototype.** Not affiliated with, endorsed by, or approved by Linus Media Group, Linus Tech Tips, Floatplane, or the WAN Show. Branded artwork is included for demonstration; its presence does not grant trademark rights. Seek permission or replace the artwork before official use. OBS and cross-browser compatibility have not been independently certified.

---

## The idea

A Devil’s Advocate debate moves quickly: someone has to set the topic, assign positions, track the clock, cue each speaker, and keep the audience oriented. **LTT-Advocate puts those tasks into one producer interface** while generating separate, transparent graphics for the main show and social clips.

**No backend. No account. No installation.** Just a modern browser and a static website.

### At a glance

| 🎛️ For the producer | 📺 For the audience |
| --- | --- |
| Topic and position setup | Topic and position banners |
| Animated branded coin toss | Coin result and assignments |
| Caller selection and speaker order | Active speaker identification |
| Thinking, arguments, rebuttals and closings | Compact countdown timer |
| Pause, restart, time adjustments and emergency clear | Transparent graphics suitable for video compositing |
| Session history, hotkeys and output layouts | Landscape, portrait and square outputs |

## Start here: the interactive walkthrough

### [▶ Launch the automatic guided tour](https://rstevens-dev.github.io/LTT-Advocate/?walkthrough=1)

The tour opens **on top of the actual producer interface**, spotlights the relevant controls, and automatically demonstrates an entire example debate. It explains what is happening and what the producer would do next.

It covers setup → caller and call → coin toss → thinking → opening arguments → rebuttals → optional closings → finish → emergency clear.

Use **Pause**, **Next**, **Back**, or **Exit tour** to control the presentation. The tour fast-forwards the 30-second stages.

> [!NOTE]
> The walkthrough uses isolated sample data. It does **not** overwrite saved show settings, claim the live producer lock, or send updates to broadcast displays. Its coin result is illustrative, not a real random toss.

Direct URL: `https://rstevens-dev.github.io/LTT-Advocate/?walkthrough=1`

## Run your first debate

1. [Open the producer](https://rstevens-dev.github.io/LTT-Advocate/).
2. Enter a **topic** and two opposing **positions**.
3. Confirm the durations, then **Lock setup**. Fresh sessions default to **30 seconds** for every timed segment, with rebuttals enabled and closings disabled.
4. Select **Linus** or **Luke** as the caller and record **Heads** or **Tails**.
5. Click **Flip**. Once the result lands, review the assignments.
6. Press **Next** (or **Space**) to start thinking, then cue the opening arguments and rebuttals. If enabled, closing statements follow.
7. Use **Emergency clear** (Ctrl+Shift+X) to hide graphics on connected outputs.

The producer remains the only live control surface. **Only one active producer window is allowed per browser origin**, while multiple display windows may stay open. A second producer sees a blocked-access message and can retry after the first closes. This does not enforce exclusivity across different computers or browser profiles.

### Debate flow

```text
SETUP
  ↓ Lock setup
COIN TOSS
  ↓ Caller → Call → Flip
THINKING · 30s
  ↓ Cue speaker
OPENING ARGUMENT 1 · 30s
  ↓ Cue other speaker
OPENING ARGUMENT 2 · 30s
  ↓ If rebuttals enabled
REBUTTAL 1 · 30s
  ↓
REBUTTAL 2 · 30s
  ↓ If closings enabled
CLOSING 1 · 30s
  ↓
CLOSING 2 · 30s
  ↓
FINISH / CLEAR
```

All durations can be configured. Timers can be paused, resumed, restarted or adjusted. Optional rebuttal order, closing statements, overtime and time banking are configurable.

## Broadcast and clip outputs

| Output | Aspect ratio | Intended use | URL |
| --- | --- | --- | --- |
| **Wide** | 16:9 | Main broadcast | [Open](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=wide) |
| **Linus** | 9:16 | Linus-focused vertical clip | [Open](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=linus) |
| **Luke** | 9:16 | Luke-focused vertical clip | [Open](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=luke) |
| **Stacked** | 9:16 | Both hosts stacked | [Open](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=stack) |
| **Square** | 1:1 | Square clip | [Open](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=square) |

**Recommended:** launch displays using the producer’s **Launch [format] display** buttons. They automatically include the current debate session in the URL. Opening a bare display link above uses the default session.

Displays show **graphics only**. They do not capture, crop, record or transmit camera video.

### Connecting displays

- **Same browser profile and origin:** launched windows use `BroadcastChannel` for automatic synchronization.
- **Separate browser, isolated OBS source or different computer:** use the manual WebRTC offer/answer pairing panel where supported.
- **No central server:** there is no hosted signaling, STUN or TURN service. Some networks cannot establish direct connections, and manual connections must be paired again after reload.

A display that loses contact cannot receive a new clear command. Its **default 15-second fail-safe** hides the graphics if producer updates stop. Set up and test this behavior before a live broadcast.

## OBS setup (experimental)

1. Add a **Browser Source** and use the session-matched display URL.
2. Set the source size to **1920 × 1080** (wide), **1080 × 1920** (portrait), or **1080 × 1080** (square).
3. Disable **Shutdown source when not visible** and **Refresh browser when scene becomes active**.
4. Open the producer and verify that topic, coin, speaker and timer changes reach the OBS source. OBS browser contexts may not share storage with your regular browser.
5. If automatic sync fails, use the manual WebRTC pairing flow or capture a launched display window. Window capture may not preserve transparency.
6. Rehearse a complete segment, including emergency clear, before going on air.

> [!WARNING]
> **OBS integration has not been independently verified.** Test actual alpha blending, browser-source rendering, pairing, timer continuity and disconnected-display behavior on the intended production machine.

## Coin toss and producer overrides

- **Heads:** bundled orange LTT-style logo.
- **Tails:** bundled Floatplane logo.
- **Normal flip:** uses the browser’s `crypto.getRandomValues` random number generator.
- **Producer controls:** Force LTT, Force Floatplane and Reflip are available in the coin stage. **Their intended use is to mirror the outcome of a real, physical coin toss on the broadcast graphics**, so the hosts can flip an actual coin on camera while the producer displays the matching result. They can also be used for rehearsals and demonstrations.
- **Visual tell:** after a forced result, a subtle rim highlight appears at **225°**. Random results use other highlight locations.
- **Audit trail:** forced results are recorded in the producer’s event history.

By default, the caller receives the **landed** position, regardless of what they called. A configurable **call-wins** alternative awards Heads on a correct call and Tails otherwise. The caller speaks first by default.

**A forced digital outcome is not randomly generated by the app.** For a fair on-air toss, flip a real coin and have the producer select the matching result; the physical toss determines the outcome, and the overlay simply reproduces it. If no physical toss occurred, do not present a producer-selected result as a fair random flip.

## Keyboard shortcuts

| Shortcut | Action | Shortcut | Action |
| --- | --- | --- | --- |
| `Enter` | Lock setup | `Space` | Next stage |
| `Shift+Space` | Previous stage | `1` / `2` | Linus / Luke |
| `H` / `T` | Heads / Tails | `F` | Flip |
| `P` | Pause / resume | `R` | Restart timer |
| `=` / `-` | Add / subtract 10 seconds | `O` | Toggle overlay |
| `C` | Toggle timer | `Ctrl+Shift+X` | Emergency clear |
| `Ctrl+Shift+E` | End debate | | |

Bindings are configurable. Shortcuts work when the producer has focus and a form control is not active. Browser and OS shortcuts can take precedence.

## Reliability and known limitations

This is an **experimental community prototype**, not a certified broadcast system.

- One-producer enforcement uses a browser Web Lock with a local-storage lease fallback. It cannot coordinate isolated profiles or separate computers.
- Automatic display sync requires the same origin and browser storage environment.
- Manual WebRTC pairing is network-dependent and must be repeated after a reload.
- Disconnected displays cannot receive producer commands until they reconnect; the default fail-safe hides their graphics after 15 seconds.
- Remote timers estimate the producer clock offset from message arrival, so network delays can affect accuracy.
- Saved sessions may retain older timer or rebuttal settings; use a fresh session to inspect current defaults.
- The wide-display flashing fix and guided walkthrough still require full real-browser acceptance testing.
- OBS Browser Sources, transparency and cross-browser operation remain unverified on production hardware.

### Pre-show acceptance checklist

- [ ] The deployed producer and launched displays load without console errors.
- [ ] The wide display stays stable through at least **five minutes** of heartbeats.
- [ ] Normal and forced coin tosses animate and display the correct results.
- [ ] Thinking, both arguments, rebuttals and closings work end to end.
- [ ] All five output formats fit the intended video frame.
- [ ] Actual OBS Browser Sources preserve transparency and receive state.
- [ ] Emergency clear works on connected outputs; disconnected timeout is understood.
- [ ] A second producer window is blocked.
- [ ] The guided walkthrough runs from start to finish.
- [ ] Any required permission to use branded artwork has been obtained.

## Development

The project is a static site using browser JavaScript modules. No production backend, login, analytics service or build step is required.

```bash
# Serve locally (opening index.html as a file is not supported)
python3 -m http.server 8000
# Then visit http://localhost:8000/

# Unit tests and syntax checks
node --test tests/core.test.mjs
node --input-type=module --check < app.js
node --input-type=module --check < peer.js

# Optional Chromium smoke test
npm install --no-save playwright
npx playwright install chromium
node tests/browser-smoke.mjs
```

GitHub Actions is configured to run unit tests, syntax checks and a Chromium smoke test. **Configuration is not proof of a successful run.** The smoke test covers wide-display DOM stability, forced coin highlighting, timer continuity, emergency clear and duplicate producer blocking.

### Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Producer interface and preview |
| `display.html` | Transparent output entry point |
| `app.js` | Debate flow, rendering, tour and synchronization |
| `core.mjs` | Shared pure logic |
| `peer.js` | Manual WebRTC connection |
| `assets/` | Bundled coin artwork |
| `tests/` | Unit and browser smoke tests |
| `CHANGELOG.md` | Release notes |

### Reporting issues

Please include the browser and version, whether you used a launched window or OBS Browser Source, the display format, and the steps needed to reproduce the issue.

---

<div align="center">

**Made as a community experiment for better debate production and more readable clips.**

[Guided walkthrough](https://rstevens-dev.github.io/LTT-Advocate/?walkthrough=1) · [Producer](https://rstevens-dev.github.io/LTT-Advocate/) · [Changelog](CHANGELOG.md)

*Unofficial fan project · Experimental · Provided without warranty*

</div>
