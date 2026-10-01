# Portfolio visual design review

Reviewed October 1, 2026. This revision changes the visual system, homepage composition and interaction feedback while preserving the project evidence and professional record.

## Collection coverage

The snapshot of [Emma Bostian’s developer portfolio directory](https://github.com/emmabostian/developer-portfolios) contained **2,005 unique portfolio URLs**. The directory’s displayed count and JSON feed contained 2,003; the README included two additional URLs. Coverage follows the actual README links, rather than the smaller advertised count.

Every URL received an anonymous, bounded HTML/CSS retrieval attempt. The results were 1,962 retrieved HTML pages, 20 HTML shells, 11 HTTP errors and 12 unavailable responses. Screening captured public headings, professional routes, project structure, typography, color and motion signals. Requests were limited to 512 KiB of HTML and the first two public stylesheets, at most 256 KiB each. This source screening is distinct from rendering or manually inspecting a screenshot.

Browser screening also recorded initial visible headings, link labels and computed styles where available. Selected references received screenshot inspection. Initial DOM results can include placeholders, incomplete loading states or error pages; they are not endorsements or comprehensive visual reviews. Browser errors do not establish that a portfolio is offline. Per-URL working records remain outside this public repository; no reference-site assets, prose or implementation were copied.

The final browser ledger records **1,666 unique browser attempts**. Its latest record for every inventory entry is accounted for below. The 316 unattempted entries received source screening only after the remaining research tab failed; they were not silently counted as rendered pages.

| Browser screening result | URLs |
| --- | ---: |
| Readable DOM and computed styles | 1,434 |
| Sparse/loading DOM and computed styles | 87 |
| Browser accessibility/content only | 131 |
| Browser errors | 14 |
| Skipped after source/HTTP retrieval result | 23 |
| Unattempted after browser failure | 316 |
| **Total inventory** | **2,005** |

This is complete source-attempt coverage and a bounded browser pass, not manual visual inspection of all 2,005 portfolios. Screenshot inspection was limited to selected references. Design decisions below draw on those inspected references and recurring structural patterns in the collection.

## References and design decisions

| Reference | Pattern examined | Application here |
| --- | --- | --- |
| [Marco Bellingeri](https://marcobellingeri.dev/en/) | Editorial typography, warm background, clear rules between sections | A prominent name, serif/sans contrast and an ivory, graphite and teal identity |
| [Hamish Williams](https://hamishw.com/) | Strong visual hierarchy and distinct project presentation | Numbered work with an obvious project purpose and a direct case-study route |
| [Nathan Simpson](https://nathansimpson.design/) | Large image stages and concise project framing | Larger product screenshots, tinted image backgrounds and open text rows |
| [Ethan Lanting](https://ethanlanting.dev/) | Immediate career context, contact routes and concrete product examples | Clear introduction, availability near the introduction and accessible contact links |

The palette was selected by the portfolio owner. Manrope and Instrument Serif are served locally; their SIL Open Font Licenses and original source URLs are included in [the font directory](../assets/fonts/). The layout uses ordinary HTML and CSS and requires no new runtime dependency.

The homepage presents five projects in consistent rows. Filters include Sailday, and the five-project comparison opens when requested. Sailday’s price-history illustration is explicitly fictional; its case study explains the real collectors, comparison rules, graphs and notification infrastructure. BetTail remains an AI-assisted web-development project and Netted a finance/accounting product. Cortex XSIAM is emphasized in the HNI experience section.

## Motion and access

Entrances last 380 ms and move at most 10 pixels. Tab changes use 160 ms feedback, demo changes 200 ms, disclosures 140 ms and the theme icon 220 ms. Content, selection, accessibility attributes and focus decisions update immediately. Repeated selection of the same demo preset does not replay feedback.

Nothing waits in a hidden state for an observer or script. System and manual reduced-motion settings cancel transient effects, stop decorative hover movement and disable smooth scrolling. Initial entrances do not replay when motion is re-enabled. Native links, disclosures and readable examples remain available without JavaScript.

## Verification and limits

- All eight pages passed local link/fragment, duplicate-ID, image-description, primary-heading, restrictive-CSP and inline-code checks. JavaScript syntax and diff whitespace checks passed.
- The published release was verified against all eight local HTML pages and nine design assets: stylesheets, script, fonts, logo and social image. All 17 public responses returned HTTP 200 and matched the reviewed local files, allowing only text line-ending normalization. The live homepage reported the ivory background, loaded local fonts, five project rows and no PDF links.
- Final browser layout checks covered all eight pages at observed widths of 320, 376, 768 and 1440 pixels without page-level horizontal overflow. Tables and wide diagrams scroll inside their own containers. Important labels were increased to 12 px; chart labels sit outside the scaling SVG.
- Twenty reviewed foreground/background token combinations exceeded 4.5:1 contrast. This is a color check, not a claim of full accessibility conformance.
- Script-free previews confirmed the light palette, all five project rows, hidden enhancement controls, visible BetTail workflow stages and readable static ticket values.
- The full script executed against all eight actual HTML fixtures in a private, limited DOM adapter. Checks covered five-project filter counts and visibility, workflow keyboard handlers, themes, every fixed demo preset, same-preset behavior and reduced-motion cleanup. Focus calls, history and event delivery were simulated; native browser behavior is outside that adapter.
- During the original visual design review (`400f247`), browser automation did not activate JavaScript inputs, including an independent minimal local input probe. Consequently, native keyboard activation, modal focus trapping and Escape behavior were not reverified at that time. Screenshot capture also became unreliable during the extended collection review. These historical tool limits are separate from the passed source, layout and handler checks.

### Screenshot viewer follow-up

The October 1 screenshot viewer revision (`0c60ad1`) was checked with working native browser interactions. All ten screenshot locations across the homepage and three case studies opened the correct loaded image, closed with the visible control and returned focus to their own links. Enter, Escape, Tab and Shift+Tab were checked, including focus wrapping inside the viewer. Full-resolution scrolling and fit-view reset were verified; a 320 px phone viewport opened the 1600 px sample image at its original width, with the close control visible and no page-level overflow. Light and dark phone views were checked. A script-free case-study link opened the original image directly. All eight published HTML pages, the shared script and the interaction stylesheet matched the reviewed local release. A screenshot of the live viewer was captured and inspected. This follow-up verifies the image viewer; it does not extend native interaction claims to unrelated workflow controls.

Application test counts in the case studies are historical records and were not rerun for this presentation change. No private application data, employer records, credentials or new downloadable résumé document were added.
