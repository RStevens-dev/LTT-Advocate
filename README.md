# LTT-Advocate — Devil’s Advocate overlay

**v0.1.0-alpha · Experimental community project**

A compact, browser-based debate graphics system inspired by the Devil’s Advocate segment of the WAN Show. Designed to preserve the camera feed, make assigned arguments obvious and retain context in social clips.

This is an unofficial fan project. It is not affiliated with or endorsed by Linus Media Group, LTT or the WAN Show. No official logos, footage or proprietary assets are included.

## Online preview (GitHub Pages)

Expected demo URL after Pages is enabled: https://rstevens-dev.github.io/LTT-Advocate/

Repository administrators: open Settings → Pages, choose Deploy from a branch, select main and /(root), then Save. No build step is needed. The public preview uses browser-local state; open overlay tabs in the same browser profile. Use the local Python server for actual cross-browser OBS synchronization.

The producer preview includes an illustrative WAN-inspired camera mockup. Click **Transparent preview** to replace the mock set with a checkerboard, or **Mock camera preview** to restore it. Actual overlay URLs always render without the mock camera or checkerboard.

## Quick start

Requires a modern browser and Python 3 (for a local static HTTP server). No npm install, account or external service is required.

```sh
git clone https://github.com/RStevens-dev/LTT-Advocate.git
cd LTT-Advocate
python server.py
```

Open http://127.0.0.1:8765/ in a browser. Keep the server running. On Windows, use `py server.py` if necessary.

For a quick synchronization test, open http://127.0.0.1:8765/?overlay=wide in another tab of the same or a different browser profile. The overlay has a transparent background; the producer preview uses a colored placeholder, not a real camera feed.

## Five-stage workflow

| Stage | Producer action | Audience sees |
|---|---|---|
| 1 Setup | Enter topic, Heads and Tails positions, shared thinking time and each host’s time. Lock setup. | Topic and candidate positions |
| 2 Coin toss | Select caller, select their call, then Flip. | Small animated coin, call, outcome and assignments |
| 3 Thinking | Next starts the shared countdown. | Assigned positions and preparation timer |
| 4 First argument | Next cues the caller and starts their timer. | Active speaker highlight and countdown |
| 5 Second argument | Next cues the other host; Next again completes. | Second speaker highlight and countdown |

Timers stop visually at zero; they do not advance the stage. Producers may advance early, pause, resume, restart or adjust the time by ten seconds. Reset preserves setup values and layout preferences. End and emergency clear hide the graphics.

### Coin rule (provisional)

Heads maps to the first configured position and Tails to the second. The caller receives whichever face lands, and the other host receives the opposite position. The caller speaks first. The call itself is ceremonial in this alpha; it does not affect assignment. The final segment rules are still open to feedback. The random outcome uses the browser cryptographic random number generator.

## Layout and clip outputs

| URL suffix | Canvas | Intended use |
|---|---|---|
| ?overlay=wide | 1920 × 1080 | Main show |
| ?overlay=linus | 1080 × 1920 | Linus portrait clip |
| ?overlay=luke | 1080 × 1920 | Luke portrait clip |
| ?overlay=stack | 1080 × 1920 | Both hosts stacked |
| ?overlay=square | 1080 × 1080 | Square Linus clip (alpha default) |

All URLs are relative to the same server origin. The producer can preview these formats without changing the selected output URL. The alpha uses a shared layout configuration across outputs.

Header choices: full width, split headers, combined and minimal. Split repeats the topic above each participant, so horizontal crops retain context. Combined and minimal currently share rendering with split and full respectively; visual differentiation is planned.

Timer choices: center, per-host, inline, bottom and hidden. Per-host and inline currently use the same compact implementation. Themes: WAN-inspired orange, red versus blue, monochrome. Host order is configurable.

Portrait and square outputs contain graphics only. OBS must supply and crop the actual camera feed. The stacked layout is experimental and needs calibration; these are not automatic video clipping or recording tools.

## OBS setup

1. Start the local server.
2. Add a Browser Source to your scene, above the camera sources.
3. Enter the desired overlay URL from the table, with the local server prefix.
4. Set the matching width and height. Keep the source active and avoid unnecessary refreshes.
5. Position camera sources underneath the transparent graphics. For portrait outputs, create a portrait scene or separate recording workflow and crop the appropriate camera.
6. Verify state synchronization before going live.

****Important alpha limitation:** the local server now shares state across browser profiles using HTTP polling (250 ms). OBS integration has not yet been validated in a real installation. Keep one producer tab open and use the same local server URL. Static hosting alone falls back to browser-local synchronization.nchronization currently uses localStorage and BroadcastChannel, which are scoped to an origin and browser storage profile. OBS's embedded Chromium may not share storage with your desktop browser. For testing, open the producer and overlay in the same browser profile, or test both within OBS browser contexts if they share storage. Cross-process OBS synchronization is not guaranteed. A local WebSocket server is the planned production solution. Do not rely on this alpha for a live show without rehearsing the exact setup.

## Hotkeys

Click a binding to record a new combination. Escape cancels recording. Clear removes a binding. Duplicate combinations are rejected. Export/import JSON saves and restores the binding map. Disable shortcuts with the checkbox.

| Action | Default |
|---|---|
| Lock setup | Enter |
| Next stage / cue | Space |
| Previous stage | Shift+Space |
| Select Linus / Luke | 1 / 2 |
| Heads / Tails | H / T |
| Flip | F |
| Pause / resume | P |
| Restart | R |
| Add / subtract 10 seconds | = / - |
| Toggle overlay | O |
| Toggle timer | C |
| Emergency clear | Ctrl+Shift+X |
| End segment | Ctrl+Shift+E |

Shortcuts require focus in the producer page, outside form controls. Repeated keydown events are ignored. Browser or OS reserved shortcuts may not be available. A Stream Deck can send these keys when the producer page has focus; global hotkeys, native Stream Deck profiles and a direct action API are not implemented yet.

## Architecture

- `index.html`: producer controls, transparent output shell and styles.
- `app.js`: state machine, timer deadlines, coin animation, layouts, hotkey handling and browser synchronization.
- `server.py`: loopback-only HTTP server and in-memory shared state API.\n- `README.md`: installation and operating guide.

The query parameter `overlay` selects read-only output mode. The producer writes state to localStorage and publishes updates via BroadcastChannel. Outputs derive remaining time from an absolute timestamp, avoiding dependence on counting interval ticks. Reloading the same origin restores saved state. Use a single producer tab; concurrent writers are not supported. The optional local backend stores the latest snapshot in memory and exposes GET/POST /api/state. It binds to loopback only and is not intended for remote or untrusted users. There is no authentication or analytics.

## Manual acceptance checklist

- [ ] Start the server and load the producer without console errors.
- [ ] Open a wide overlay and verify setup changes after Lock setup.
- [ ] Test both callers and both calls; verify assignment and speaking order.
- [ ] Verify thinking and both argument timers, including zero and early cues.
- [ ] Test pause/resume, restart, time adjustments, previous stage and reset.
- [ ] Verify all five output formats and check long topic/position text for clipping.
- [ ] Remap a key, reject a duplicate, export and import a profile.
- [ ] Verify shortcuts do not trigger while typing.
- [ ] Verify emergency clear and restore via toggle.
- [ ] Test actual OBS browser-source transparency and synchronization.
- [ ] Rehearse a complete segment before using it on air.

This checklist is a test plan, not a claim that the tests have passed.

## Troubleshooting

**Blank or stale overlay:** verify the same scheme, hostname and port. Check the overlay visibility toggle. Reload both pages. Use python server.py rather than a static server for cross-profile synchronization.

**Hotkeys do not work:** enable shortcuts, focus the producer page outside input fields and check browser shortcut conflicts.

**Timer shows zero:** this is intentional; cue the next stage manually.

**Graphics cover a face:** adjust the underlying camera crop. Fine-grained safe-area positioning and text fitting are planned.

**Need to clear saved state:** use Reset for a new debate, or clear site data for the local origin to restore all defaults.

## Roadmap

- Upgrade polling transport to WebSockets and add an authenticated action endpoint.
- OBS-tested multi-output synchronization, reconnection and scene integration.
- Global hotkeys and Stream Deck profile/API.
- Distinct combined/minimal layouts and timer placement variants.
- Per-output layout settings, adjustable anchors, safe areas and text fitting.
- Actual camera-reference calibration and improved animations.
- Automated state-machine, browser and integration tests.
- GitHub Pages deployment verification, release packaging and accessibility review.

## Feedback and contributing

Open a GitHub issue with the browser/OBS version, steps to reproduce, expected behavior and actual behavior. Screenshots with private information removed are useful. Keep contributions dependency-light and avoid including copyrighted show footage or logos.

No license has been selected yet; public repository visibility does not itself grant permission to redistribute or modify the code. The repository owner should choose a license before accepting external contributions.

## Release status

This is the first source-code alpha, not a production-certified release. GitHub Pages activation and verification, formal release tagging, automated tests and real OBS validation are not included in this initial commit series.
