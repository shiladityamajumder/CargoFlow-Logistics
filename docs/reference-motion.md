# Reference motion measurements

Reference: https://www.emons.de/en, inspected October 3, 2026 in Chromium at 1440 × 900.

## Hero

- Document remains at scrollY 0 for four forward wheel gestures.
- Hero and rendered video occupy exactly one viewport.
- Overlays translate by ±100% over 1000ms, with `power1.out` easing.
- A gesture received during that transition cannot skip a scene.
- After Digital, a wheel delta of 450 moves the page by 360px with eased scrolling.
- Backward gestures at the top select the prior scene's loop.
- Video frame conversion: 46 seconds / 1103 frames.

| Scene | Loop frames | Entry frames | Entry duration |
| --- | --- | --- | --- |
| Road | 0–216 | — | — |
| Logistics | 258–403 | 220–254 | 34/24 seconds |
| Air & Sea | 470–614 | 410–467 | 57/24 seconds |
| Rail | 662–788 | 622–652 | 30/24 seconds |
| Digital | 827–1091 | 795–824 | 29/24 seconds |

Loop endpoints include the original 0.1-second guard.

## Globe

- Section: 200svh, sticky content: 100svh.
- Scroll progress covers the section entering and leaving the viewport: `(viewportHeight − sectionTop) / (viewportHeight + sectionHeight)`.
- Smoothing: 90%, equivalent to 10% convergence per frame at 60Hz.
- At keyframe 15: translateY 100svh, scale 2, rotation −15°.
- At keyframe 70: translateY 0, scale 1, rotation 0°.
- Transform easing: CSS cubic Bézier (0.42, 0, 0.58, 1).
- Route drawing: keyframes 30–100, easing (0.25, 0.1, 0.25, 1), Lottie values 0–65%.
- Original vector asset: 1920 × 1920, 25fps, 81 frames, no external images.
- Sticky top at the measured desktop viewport: 41.8px.

| Offset relative to section top | Reference route frame | Local route frame |
| --- | ---: | ---: |
| −500px | 0 | 0 |
| −250px | 0 | 0 |
| 0px | 1.618 | 1.611 |
| 250px | 13.149 | 13.132 |
| 500px | 28.264 | 28.250 |
| 750px | 39.020 | 39.011 |
| 1000px | 45.735 | 45.730 |

These samples differ slightly because native scroll positions round to whole pixels while the two sections have different fractional document offsets. The implementation uses the same normalized keyframes rather than hardcoding these samples.

## Checks

Verified in the browser: forward and backward wheel and touch gestures, one-second transition locking, tabs, 0.8 wheel scaling after release, sticky globe layout, original route SVG rendering, reverse route frames, service dialogs, mobile menu, reduced motion and absence of horizontal overflow. Mobile checks use a 390 × 844 viewport and actual touch events. Browser runtime errors: none in the recorded passes. Production compilation and TypeScript checking pass.
