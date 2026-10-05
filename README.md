# Aman Agarwal — Security and Applied AI Portfolio

[Live portfolio](https://aman-agarwal6.github.io/) · [Recruiter summary](https://aman-agarwal6.github.io/overview.html) · [Project documentation](docs/PROJECTS.md) · [GitHub profile](https://github.com/aman-agarwal6)

I’m an Iowa State MIS senior with a Cybersecurity Engineering minor, CompTIA Security+ and cybersecurity internship experience at HNI Corporation. I graduate in December 2026 and am available for junior roles in January 2027.

This repository presents my software projects, their product goals and design decisions, and supporting code and test evidence. It includes a security workbench, an identity offboarding system, AI-assisted web applications, an applied-AI research app and supporting offline-development work. Security reviews are documented as work performed on the applications.

| Project | Focus | Start here |
| --- | --- | --- |
| SignalBridge | Security operations and detection engineering | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge) |
| AccessOps | Identity and access management: employee offboarding | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [public source](https://github.com/aman-agarwal6/AccessOps) |
| BetTail | AI-assisted full-stack web app development | [Case study](https://aman-agarwal6.github.io/projects/bettail.html) |
| Netted | Personal finance, accounting and budgeting | [Case study](https://aman-agarwal6.github.io/projects/netted.html) |
| Downfield | Applied-AI research, report validation and evaluation | [Case study](https://aman-agarwal6.github.io/projects/downfield.html) |
| Sailday | Price tracking, scheduled data collection, notifications and offline planning | [Supporting case study](https://aman-agarwal6.github.io/projects/sailday.html) |

## Reviewable evidence

- [AI security implementation and selected verification](proof/ai-security/README.md): source excerpts, access-denial tests, LLM controls, scoped publishing and Netted’s risk register.
- [Engineering evidence](proof/engineering/README.md): safe CSV exports, session configuration, forecast evaluation and partial financial-journal recovery.
- [Sailday engineering evidence](proof/sailday/README.md): [price collection, comparisons, historical graphs and notifications](proof/sailday/price-tracker.md), plus authorization on retries, field conflicts and bounded public requests.

Full source is public for SignalBridge and AccessOps. Other projects publish selected excerpts. AI coding agents wrote substantial portions of implementation under my direction. Case studies state my role, deployment status, recorded checks and open work; reviews are builder-led.

## Preview and maintenance

The site uses plain HTML, CSS and one local JavaScript file. No package installation or build is required.

```powershell
python -m http.server 4719 --bind 127.0.0.1
```

Open `http://127.0.0.1:4719/`. Projects, architecture stages and illustrative product examples remain readable without JavaScript. Optional enhancements include six-project filters with shareable URLs, keyboard-accessible workflow tabs, ticket/accounting/price-check examples, screenshot inspection and themes. A native comparison table covers all six projects. The homepage also shows how AccessOps and SignalBridge connect through signed leaver events, and summarizes a reproduced access-control failure, its fix and recorded regression results, with direct links to the implementation, tests and before/after record.

The default design uses warm ivory, graphite and teal, with locally hosted Manrope and Instrument Serif. `assets/css/design.css` defines the presentation over the shared content and control styles. Entrances run once; control feedback is brief. System and page-level reduced-motion preferences disable animation, decorative movement and smooth scrolling.

The recruiter summary is available as HTML. See [the visual design review](docs/VISUAL-DESIGN-REVIEW.md) for collection coverage, design references and verification boundaries, and [the earlier content review](docs/INSPIRATION-REVIEW.md) for the navigation and product examples.

Every app screenshot on the homepage and case studies is clickable. A near-full-screen viewer offers a fit view, full-resolution inspection with scrolling, an original-image link and a visible close control. Phones start at full resolution so small text is readable immediately. Escape closes the native dialog and returns focus to the screenshot link. Without JavaScript, the same links open the original image directly.

There are no trackers, external font requests, runtime model calls or browser data storage. Scripts, styles, fonts and images are served locally under the content security policy. Font licenses and original source metadata are included in `assets/fonts/`. Public examples contain synthetic data.

When updating a project, keep the homepage, case study and evidence index consistent. Retain dates on historical results and distinguish recorded checks from deployed behavior. Check local links, mobile/tablet/desktop layouts, keyboard navigation, dialogs, themes, reduced motion, printing and the fallback without JavaScript before publication. Do not publish application records, employer materials, credentials or operational configuration.
