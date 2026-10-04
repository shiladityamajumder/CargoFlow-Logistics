# Internal page reference and verification

Reference: https://www.emons.de/en, inspected October 4, 2026.

The sitemap's current English pages are stored locally as reviewed, script-free content templates. A shared navigation and footer avoid duplicating chrome in each route. Next.js generates the routes and page metadata from the checked-in manifest. Unknown routes return 404; legacy freight form URLs redirect to the current form selection page. There is no runtime dependency on the original website for page content, images or fonts.

The source CSS and embedded styles are compiled into selectors scoped to `.reference-page`. Conditional `html:has(.reference-page)` rules reproduce the reference's responsive rem scale. Full document links ensure that returning to the homepage starts its existing scroll/video lifecycle with the original 16 px root font size. The hero scene logic, video frame ranges, GSAP transitions, Lenis settings and globe implementation are untouched.

Measured reference and local heading rectangles were identical at 1440 × 900 and 390 × 844 for road service, freight selection and contact pages. The reference and local road form also had identical section dimensions (1440 × 873.03125) at a matching scroll position. Visual comparison used the same published artwork and fonts.

Forms retain the original five modes, step layouts and fields. Local interactions provide required-field checks, country choices, optional addresses, delivery instructions, dangerous-goods fields, repeatable cargo rows, summaries and back navigation. Country options were read from the rendered reference. Browser checks exercise the flows, including edits and disconnected delivery. The third-party contact widget is implemented as a local accessible form; its hosting service and private backend are not replicated.

The delivery handler accepts same-origin multipart requests, validates email and privacy consent, enforces a total size limit, and forwards to an explicitly configured endpoint. Without configuration it returns 503 and offers a client-side inquiry download. It does not claim that an inquiry was sent. Live tracking, customer accounts, careers, map embeds and public PDF documents use their original external services.
