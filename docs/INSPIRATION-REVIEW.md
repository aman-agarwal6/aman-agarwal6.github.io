# Portfolio presentation review

This review used a representative selection from [Emma Bostian’s developer portfolio directory](https://github.com/emmabostian/developer-portfolios). It did not assess every listed site. Public page content and linked project pages informed the content review; Brittany Chiang’s layout was also inspected in the browser.

## Patterns adopted

| Reference | Useful pattern | Application in this portfolio |
| --- | --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) and her [project archive](https://brittanychiang.com/archive) | Prominent identity, direct professional links and a compact alternative to featured projects | Name-led homepage, email and LinkedIn links, downloadable recruiter summary and a five-project comparison |
| [Adham Dannaway’s Qantas case study](https://www.adhamdannaway.com/portfolio/qantas-map-search) and [design-system case study](https://www.adhamdannaway.com/portfolio/creating-a-lean-design-system) | Explain the problem, the contributor’s decisions and the result through a concrete case | One consequential decision near the top of each case and product examples before deeper implementation detail |
| [Lee Robinson’s Pixo project](https://leerob.com/pixo) | Explain the product, development approach and available demonstration candidly | Product workflows and explicit AI-assisted implementation disclosure, with deployment and evidence limits retained |
| [Lee Warrick](https://leewarrick.com/) | Describe projects through what visitors can do and make professional contact easy to find | Share/follow/settle/review flow, accounting example, price-check example and contextual email links |
| [Liran Tal](https://lirantal.com/) | Connect a professional focus to specific technical work | Keep HNI and Cortex XSIAM prominent; connect security and AI interests to evidence rather than relabeling unrelated products |
| [Joshua Paul](https://www.joshuapaul.me/) | Concise introduction and purpose-led featured work | Clear name, career direction, availability and project purpose at the first reading level |
| [Bruno Simon](https://bruno-simon.com/) | Let visitors explore an interaction with clear controls | Lightweight product examples that explain decisions without an account or an external service |
| [Anandhu Sajan](https://www.anandhusajan.com/) | Distinguish different kinds of work and provide direct professional routes | Retain project-type filters and make product status and source availability easy to compare |

These are adapted information and interaction patterns. No reference-site assets, prose or layout code were copied. The existing palette, project screenshots and case-study evidence remain specific to this work.

## Product examples and boundaries

- **BetTail:** a four-stage product walkthrough and two fixed follower tickets. The original pick remains separate from each follower’s stake and odds. Winning-ticket profit and return update together.
- **Netted:** fixed gain and loss examples show fees, allocated cost basis, realized profit and purchase-date contribution splits. This illustrates the application’s chosen convention, not NAV-based accounting.
- **Sailday:** fixed eligible-rate, guarantee-rate and failed-check examples explain comparability and preservation of saved observations. Hourly collection, graphs, booking comparison and notifications remain described in the full case.

All examples use invented values. They do not call application APIs, read user accounts, collect prices, place bets, trade, send notifications or store visitor data. Static examples remain readable without JavaScript. Each case offers a project-specific email subject through a normal mail link; the portfolio sends no message itself.

The downloadable document is labeled **recruiter summary**, rather than résumé. Its builder reads maintained public HTML, including all five projects, HNI experience, education, credentials and the implementation disclosure.

## Publication checks

- All eight HTML pages passed local destination, fragment, duplicate-ID, image-description, primary-heading and content-security-policy checks.
- All eight pages were inspected at 320, 768 and 1440 pixels without page-level horizontal overflow. The expanded comparison scrolls within its own container on a phone. Desktop, phone and product-example screenshots were reviewed.
- BetTail ticket values, manual keyboard tab activation, Netted gain/loss allocations and all three Sailday scenarios were checked. Pure fixture checks covered expected values, accounting conservation and rejection of unsupported cases. Outcome updates use polite live regions.
- Script-free previews confirmed that all four featured cards, every BetTail product stage and the static accounting/price examples remain available; optional controls stay hidden. The native comparison opens without scripts.
- Existing project filtering, browser back navigation, screenshot-dialog Escape/focus return and theme switching were checked after integration. Sticky case navigation and anchor visibility were checked around the desktop breakpoint.
- The recruiter summary PDF was rendered and visually inspected: one page, all five projects, embedded fonts, text at least 10 points and 10 clickable links. Repeated builds produced the same file hash. Browser-native print pagination remains separate from this verified PDF.
- JavaScript syntax and diff whitespace checks passed. Edited presentation files and the public PDF were reviewed for unintended private content; a targeted private-data pattern check found no matches.
- A separate agent performed a static recruiter-oriented review. Its broken-fragment and missing-ticket-announcement findings were corrected and rechecked. This was an agent review, rather than human recruiter feedback.

Historical application test counts in case studies were not rerun by this presentation revision. The examples explain product behavior; they do not establish production behavior or application-security certification.
