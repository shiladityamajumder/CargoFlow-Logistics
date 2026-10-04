# Animation guide

[Documentation index](README.md) · Related: [Customization](customization.md), [Reference measurements](reference-motion.md)

## Active animation modules

| Module | Responsibility |
| --- | --- |
| `src/components/journey/JourneySection.tsx` | Video scene selection, looping, transitions, hotspots and hero input interception. |
| `src/components/layout/SmoothScrolling.tsx` | Homepage Lenis instance and document scrolling after the hero releases input. |
| `src/components/sections/NetworkSection.tsx` | Globe transforms and Lottie route frame selection from scroll progress. |
| `src/lib/motion.ts` | Bézier easing functions for globe and route drawing. |
| `src/styles/globals.css` | Full-screen hero geometry, overlay positioning, sticky globe layout and responsive rules. |

The rendered homepage uses a video for its transport scene. The files in `src/three/` implement an earlier procedural scene and are inactive in the current route composition.

## Hero interaction model

The hero fills one viewport. While it is at the document top, downward wheel or touch gestures select the next scene: Road → Logistics → Air & Sea → Rail → Digital. The four scene changes keep the document at the top; after Digital, further downward input scrolls the page normally.

Returning to the top and scrolling upward selects earlier scenes. Numbered tabs select a scene directly. Arrow keys and Page Up/Page Down also navigate scenes; space behavior depends on direction and focused controls.

Scene changes translate the outgoing and incoming overlays in opposite directions over one second. A transition lock prevents another gesture from skipping a scene during that interval. Video entry clips and loop ranges are defined per scene in `JourneySection.tsx`.

Inputs inside the existing hotspot/search/mobile-menu/form controls are excluded from the hero's interception checks. If you add a new interactive overlay, review those target selectors so its scrolling and keyboard input have the intended owner.

## Relationship with smooth scrolling

`SmoothScrolling.tsx` configures Lenis with `lerp: 0.1`, `wheelMultiplier: 0.8`, vertical gestures and automatic animation frames. Its `virtualScroll` callback respects events already prevented by the hero. It also allows native scrolling in selected overlays.

This coordination keeps one gesture from both changing a hero scene and moving the document. If you replace Lenis or register new wheel/touch handlers, test transition locking and the release into normal scrolling explicitly.

For automated reverse-scroll checks, return to the top using normal wheel input and wait for scrolling to settle. A direct `window.scrollTo()` while Lenis is still interpolating can leave its target out of sync with the temporary browser position.

## Replace the video

The active assets are `/reference/journey.mp4` and `/reference/hero-poster.webp`. The frame map uses a conversion of `46 / 1103` seconds per mapped frame. This is the project's reference conversion, not a universal video frame rate.

Replacing the video requires updating its poster and recalculating the `start`, `end`, `entry` and `entryEnd` values in the scene records. Simply replacing the file under the same name can make the existing ranges seek to the wrong shots or loop incorrectly.

Preserve the scene IDs if you want existing labels, hotspot routes and tabs to remain compatible. If you introduce different scenes, update those relationships together. Then check loading, every loop boundary, transition timing, backward selection and behavior when the video is paused or unavailable.

The poster stays visible until video data is ready. The current hero does not have a procedural WebGL fallback mounted underneath it.

## Globe timeline

The globe lives inside a `200svh` section with a `100svh` sticky area. The section's position determines normalized progress:

```text
progress = clamp(
  (viewportHeight - sectionTop) / (viewportHeight + sectionHeight),
  0,
  1
)
```

The implementation smooths progress using time-adjusted convergence equivalent to 10% per frame at 60 Hz. Globe transforms run from progress 0.15 to 0.70, moving from 100svh below the resting position, scale 2 and rotation −15° to the resting transform.

Route drawing uses progress 0.30 to 1.00 and reaches 65% of the Lottie animation's frame span. `/reference/planet-routes.json` supplies the vector routes; `/reference/planet.webp` supplies the planet image. Scrolling backward reverses both changes.

Changing section height, sticky offsets or container dimensions changes the visible timeline even if the easing code stays the same. Edit the section's CSS and animation expectations together.

## Reduced motion and lifecycle

The active modules observe `prefers-reduced-motion`. The hero pauses video and removes its animated transition duration; the globe suppresses the moving/scaling remainder, and the styles remove supported transitions/animations. Lenis is configured to respect reduced motion too.

The components also clean up their listeners, animation callbacks or scrolling instances when unmounted. `ReferencePage` uses a separate interaction lifecycle for internal pages. Internal document navigation lets the homepage start fresh when returning from another page.

## Safe customization boundaries

Changing text, a service destination or a hotspot link does not require altering the scene controller. To preserve the existing motion while rebranding, keep the hero structure, section geometry, scene mapping and event ownership intact until you deliberately test an animation change.

Before changing scroll behavior, verify:

1. Forward scene changes occur once per gesture and remain locked during transitions.
2. After Digital, wheel input advances the document with smooth scrolling.
3. Returning to the top allows reverse scene changes.
4. Tabs, hotspots, mobile navigation and form inputs respond without conflicting gestures.
5. Globe transforms/routes respond at corresponding scroll positions in both directions.
6. Mobile and reduced-motion views remain usable.

The existing browser suite automates the main wheel-transition regression checks. The detailed [reference measurements](reference-motion.md) provide a separate baseline for matching frame positions and easing.
