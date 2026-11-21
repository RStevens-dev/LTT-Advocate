# LTT-Advocate — Devil's Advocate broadcast overlay

**v0.6.0 · Unofficial community prototype · Not production-certified**

A static, browser-only producer interface and graphics package for a WAN Show-style Devil's Advocate debate. The producer controls a coin toss, 30-second thinking and argument timers, optional rebuttals (enabled by default), optional closings, and transparent graphics for OBS and social clips.

**[Open producer](https://rstevens-dev.github.io/LTT-Advocate/)** · **[Wide display](https://rstevens-dev.github.io/LTT-Advocate/display.html?overlay=wide)**

> This is an unofficial fan project, not affiliated with, endorsed by, or approved by Linus Media Group, Linus Tech Tips, Floatplane, or the WAN Show. Brand marks are used for identification in the prototype; the repository's code license does not grant trademark rights. Obtain permission or replace branded artwork before official use.

## Fast demonstration

1. Open the producer link in a modern desktop browser.
2. Set the topic and two positions. Defaults are **30 seconds** for thinking, each argument, each rebuttal, and each optional closing.
3. Choose **Lock setup**. Rebuttals are on by default; closing statements are off.
4. In the **Coin toss** stage, select Linus or Luke as caller, select Heads or Tails, then **Flip**.
5. Advance through thinking, both arguments, and both rebuttals using **Next** or **Space**.
6. Use **Emergency clear** (Ctrl+Shift+X) to remove broadcast graphics immediately *from connected displays*.

### Display formats

| Format | Link suffix | Intended canvas |
| --- | --- | --- |
| Wide | `display.html?overlay=wide` | 16:9 broadcast |
| Linus | `display.html?overlay=linus` | 9:16 |
| Luke | `display.html?overlay=luke` | 9:16 |
| Stacked | `display.html?overlay=stack` | 9:16 both hosts |
| Square | `display.html?overlay=square` | 1:1 |

Use **Launch wide display** and the other launch buttons in the producer to open session-matched windows. These windows synchronize through BroadcastChannel when opened under the same origin and browser profile. A separate browser, computer, or isolated OBS Browser Source may require the manual WebRTC offer/answer pairing flow. There is no server-side signaling, STUN, or TURN; some network environments will not support direct pairing.

### OBS instructions — experimental

1. Add a Browser Source using a session-matched display URL. Set dimensions to 1920×1080 for wide, 1080×1920 for portrait, or 1080×1080 for square.
2. Ensure **Shutdown source when not visible** and **Refresh browser when scene becomes active** are disabled.
3. Keep the producer open. Verify the output actually receives changes; a browser dock and OBS Browser Source may not share storage.
4. If automatic synchronization fails, use the producer's direct WebRTC pairing instructions or capture the launched display window (window capture may not preserve alpha).
5. Test emergency clear and disconnection behavior before live use. A disconnected output cannot receive a clear command until it reconnects; the timeout fail-safe defaults to 15 seconds.

**Do not assume OBS integration has been verified.** Actual OBS testing, alpha blending, camera framing, and real-world multi-browser pairing require operator hardware.

### Coin behavior

Heads uses the bundled LTT-style orange mark; Tails uses the bundled Floatplane mark. Normal flips use `crypto.getRandomValues`. The producer also has Force LTT, Force Floatplane and Reflip controls; forced flips are logged in producer event history. A small highlight appears on the coin rim after each flip. Forced results use a fixed 225° location; random results use other locations. This is an intentionally detectable tell, **not a guarantee of an unbiased coin**. Never describe the forced mode as a fair random flip.

The default landed-face rule assigns the landed position to the caller, regardless of their call. An alternative call-wins rule is configurable. The caller speaks first by default.

### Keyboard controls

| Key | Action |
| --- | --- |
| Enter | Lock setup |
| Space / Shift+Space | Next / previous |
| 1 / 2 | Select Linus / Luke |
| H / T / F | Heads / Tails / flip |
| P / R | Pause-resume / restart timer |
| = / - | Add / subtract 10 seconds |
| O / C | Toggle graphics / timer |
| Ctrl+Shift+X | Emergency clear |
| Ctrl+Shift+E | End debate |

Hotkeys are configurable and require focus in the producer window outside input fields. Some shortcuts are reserved by browsers or operating systems.

### Development and automated tests

This is a static site. No backend, account, analytics, or runtime build process is required.

```bash
python3 -m http.server 8000
# Open http://localhost:8000/
node --test tests/core.test.mjs
node --input-type=module --check < app.js
node --input-type=module --check < peer.js

# Optional Chromium integration test:
npm install --no-save playwright
npx playwright install chromium
node tests/browser-smoke.mjs
```

GitHub Actions is configured to run unit checks, syntax checks, and a Chromium smoke test. **The presence of a test or workflow is not evidence that its run has passed.** The smoke test checks that the wide display retains the same graphics nodes through heartbeats, forced coin result highlighting, timer continuity, and emergency clear.

### Before sharing with a production team

- [ ] Verify GitHub Pages serves the current release and no console errors occur.
- [ ] Confirm a wide display does not flash after 5+ minutes of heartbeats.
- [ ] Rehearse a complete debate including rebuttals and optional closings.
- [ ] Test all five formats, long topics, and transparency.
- [ ] Test a normal coin flip, both forced faces, and the fixed tell.
- [ ] Verify refresh, reconnect, disconnected output timeout, and emergency clear.
- [ ] Test an actual OBS Browser Source, not just a browser window.
- [ ] Test manual pairing across different browsers/computers.
- [ ] Record a short real capture of the working workflow.
- [ ] Confirm branding/trademark permissions and obtain operator approval.

### Known limitations

- Automatic synchronization is restricted to same-origin, same-profile browser contexts.
- WebRTC pairing is manual, can fail due to network policies, and does not survive reload.
- A disconnected display cannot receive commands. The default fail-safe hides graphics after 15 seconds without producer messages.
- Remote countdowns estimate producer clock offset using message arrival; network delay can affect accuracy.
- Browser overlays do not contain or automatically crop live video.
- OBS and cross-browser operation have **not** been independently certified.
- Saved settings can preserve older defaults; open a fresh session to test current defaults.

### Project structure

`index.html` producer, `display.html` transparent display, `app.js` application, `core.mjs` pure helpers, `peer.js` manual WebRTC, `assets/` bundled artwork, `tests/` unit and browser smoke checks.

For bugs, include the browser version, output format, whether it was a launched window or OBS Browser Source, and steps to reproduce. The project is a community prototype and is provided without warranty.
