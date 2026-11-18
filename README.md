# LTT-Advocate — Devil’s Advocate overlay

**v0.2.0-alpha · Experimental community project**

A compact, browser-based debate graphics system inspired by the Devil’s Advocate segment of the WAN Show. Designed to preserve the camera feed, make assigned arguments obvious and retain context in social clips.

This is an unofficial fan project. It is not affiliated with or endorsed by Linus Media Group, LTT or the WAN Show. No official logos, footage or proprietary assets are included.

## Quick start — browser only

Open https://rstevens-dev.github.io/LTT-Advocate/ after GitHub Pages is enabled. No local server, Python, npm, account, or backend is required. GitHub Pages serves static assets only.

Repository administrators: Settings → Pages → Deploy from a branch → main → /(root) → Save.

The producer page includes a WAN-inspired mock camera preview and a transparent checkerboard toggle. Display pages always use a transparent background.

### Same browser profile

Open a display link from the producer. BroadcastChannel and localStorage synchronize tabs on the same origin and storage partition automatically. Keep one producer open.

### Different browsers / OBS

1. In the producer, click **Pair another display**, then **Generate offer**.
2. Open the matching **Pair wide**, **Pair linus**, etc. link in the other browser or OBS Browser Source. It ends in `&pair=1`.
3. On the display, click **Pair with producer**, paste the producer offer and click **Accept offer / generate response**.
4. Copy the generated response back to the producer's response field and click **Accept response**.
5. Wait for Connected on both ends, then click **Hide pairing panel / go on air** on the display. Escape toggles the pairing panel for troubleshooting; never do this on a live output.
6. Repeat for each additional display. Each requires its own offer/answer pair.

In OBS use Interact to paste the codes and hide the panel before taking the source live. Do not refresh or unload a paired source; reloading destroys the connection and requires pairing again. Pairing codes contain local network connection metadata; exchange only with trusted operators.

WebRTC uses host ICE candidates only, with no STUN, TURN or signaling server. Browser privacy policies, mDNS, firewalls or OBS Chromium support can prevent connections. A disconnected display retains its last state and its timer continues locally; emergency clear cannot reach a disconnected display. Verify connections before going live.

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
| display.html?overlay=wide | 1920 × 1080 | Main show |
| display.html?overlay=linus | 1080 × 1920 | Linus portrait clip |
| display.html?overlay=luke | 1080 × 1920 | Luke portrait clip |
| display.html?overlay=stack | 1080 × 1920 | Both hosts stacked |
| display.html?overlay=square | 1080 × 1080 | Square Linus clip (alpha default) |

All URLs are relative to the same static website. The producer can preview these formats without changing the selected output URL. The alpha uses a shared layout configuration across outputs.

Header choices: full width, split headers, combined and minimal. Split repeats the topic above each participant, so horizontal crops retain context. Combined and minimal currently share rendering with split and full respectively; visual differentiation is planned.

Timer choices: center, per-host, inline, bottom and hidden. Per-host and inline currently use the same compact implementation. Themes: WAN-inspired orange, red versus blue, monochrome. Host order is configurable.

Portrait and square outputs contain graphics only. OBS must supply and crop the actual camera feed. The stacked layout is experimental and needs calibration; these are not automatic video clipping or recording tools.

## OBS setup

1. Add a Browser Source above your cameras.
2. Enter the full Pages display URL with the desired overlay format and `&pair=1`.
3. Set the dimensions from the table.
4. Use Interact to complete pairing, then hide the pairing panel before going live.
5. Disable shutdown when not visible and refresh when scene becomes active to preserve the connection.
6. Verify every output, including emergency clear, before broadcast.

OBS compatibility has not been verified. If direct pairing fails, test in two desktop browsers first. There is no server fallback.

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

- `index.html`: producer controls and preview.
- `display.html`: dedicated read-only transparent display entry.
- `app.js`: state machine, timers, layouts, hotkeys and local synchronization.
- `peer.js`: WebRTC DataChannel transport and manual offer/answer pairing.
- `README.md`: operating guide.

The producer is the sole state writer. It publishes full snapshots over BroadcastChannel and each open peer channel. Displays render timers using absolute deadlines; clocks should be synchronized if using different computers. No backend, analytics, external signaling, or media permissions are required. Static hosting is needed to load the site; opening local files directly is not supported. Refreshing the producer or display requires re-pairing WebRTC connections.

## Manual acceptance checklist

- [ ] Load the Pages producer without console errors.
- [ ] Open a wide overlay and verify setup changes after Lock setup.
- [ ] Pair two different browsers, then multiple displays; verify all receive the same state.
- [ ] Disconnect a display, verify its timer continues, and re-pair.
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

**Blank or stale overlay:** verify the same scheme, hostname and port. Check the overlay visibility toggle. Reload both pages. For separate browsers, complete WebRTC pairing and check the connection state.

**Hotkeys do not work:** enable shortcuts, focus the producer page outside input fields and check browser shortcut conflicts.

**Timer shows zero:** this is intentional; cue the next stage manually.

**Graphics cover a face:** adjust the underlying camera crop. Fine-grained safe-area positioning and text fitting are planned.

**Need to clear saved state:** use Reset for a new debate, or clear site data for the local origin to restore all defaults.

## Roadmap

- Improve pairing UX, connection health and recovery without a backend.
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

This is the browser-only source-code alpha, not a production-certified release. GitHub Pages activation and verification, formal release tagging, automated tests and real OBS validation are not included in this initial commit series.
