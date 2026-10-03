# CargoFlow Logistics

The reference is https://www.emons.de/en. Local fonts, transport footage, service illustrations, photos and globe assets are in `public/reference/`. Their source URLs are recorded in `public/reference/asset-sources.json`.

## Run

```sh
npm install
npm run dev
```

Production preview:

```sh
npm run build
npm run start -- --hostname 0.0.0.0 --port 3001
```

## Scroll behavior

The hero occupies one viewport. Each wheel or touch gesture advances one scene: Road, Logistics, Air & Sea, Rail, then Digital. Its overlays slide for one second while the original rendered video plays the corresponding camera transition. Scrolling stays at the top during these transitions; after Digital, the page resumes normal scrolling. Returning to the top and scrolling upward selects the earlier scenes. Numbered tabs select a scene directly. Keyboard arrows and Page Up/Down also work.

`JourneySection.tsx` controls the scene transitions and video loops. Frame ranges use the same 46/1103 conversion as the reference. `SmoothScrolling.tsx` provides the reference's 0.1 interpolation and 0.8 wheel multiplier, respecting gestures intercepted by the hero.

## Globe animation

`NetworkSection.tsx` pins its content inside a 200svh section. The globe rises from 100svh below its resting position, shrinks from 2× to 1× and rotates from −15° to 0°. Motion runs between the 15% and 70% scroll keyframes with the reference's easing and 90% smoothing. The original `planet-routes.json` Lottie asset draws routes and location dots over the globe; its frames follow the 30–100% timeline, ending at 65% of the animation. Scrolling back reverses both transforms and route drawing.

The page follows the live site's section order: hero, mission, globe statistics, services, company, news, call to action and footer.

## Reference and scope

The original footage includes Emons branding. The earlier procedural Three.js components remain in the source tree but are not mounted by this page. Lower-page descriptive copy is recreated locally. Service and news cards open native dialogs; search filters page sections. The original customer portal and shipment backend are not part of this project.

## Verification

Production build and TypeScript compilation pass. Browser checks compare the hero against actual wheel gestures and the globe at seven matching scroll offsets. They also cover reverse scrolling, transition locking, scene tabs, dialogs, mobile navigation and horizontal overflow. See `docs/reference-motion.md` for the measured motion settings.
