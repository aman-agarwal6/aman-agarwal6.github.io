# Aman Agarwal — Security and Applied AI Portfolio

[Live portfolio](https://aman-agarwal6.github.io/) · [Recruiter summary](https://aman-agarwal6.github.io/overview.html) · [Download summary PDF](https://aman-agarwal6.github.io/assets/docs/aman-agarwal-recruiter-summary.pdf) · [Project documentation](docs/PROJECTS.md) · [GitHub profile](https://github.com/aman-agarwal6)

I’m an Iowa State MIS senior with a Cybersecurity Engineering minor, CompTIA Security+ and cybersecurity internship experience at HNI Corporation. I graduate in December 2026 and am available for junior roles in January 2027.

This repository presents my software projects, their product goals and design decisions, and supporting code and test evidence. It includes a security workbench, AI-assisted web applications, an applied-AI research app and supporting offline-development work. Security reviews are documented as work performed on the applications.

| Project | Focus | Start here |
| --- | --- | --- |
| SignalBridge | Security operations and detection engineering | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge) |
| BetTail | AI-assisted full-stack web app development | [Case study](https://aman-agarwal6.github.io/projects/bettail.html) |
| Netted | Personal finance, accounting and budgeting | [Case study](https://aman-agarwal6.github.io/projects/netted.html) |
| Downfield | Applied-AI research, report validation and evaluation | [Case study](https://aman-agarwal6.github.io/projects/downfield.html) |
| Sailday | Price tracking, scheduled data collection, notifications and offline planning | [Supporting case study](https://aman-agarwal6.github.io/projects/sailday.html) |

## Reviewable evidence

- [AI security implementation and selected verification](proof/ai-security/README.md): source excerpts, access-denial tests, LLM controls, scoped publishing and Netted’s risk register.
- [Engineering evidence](proof/engineering/README.md): safe CSV exports, session configuration, forecast evaluation and partial financial-journal recovery.
- [Sailday engineering evidence](proof/sailday/README.md): [price collection, comparisons, historical graphs and notifications](proof/sailday/price-tracker.md), plus authorization on retries, field conflicts and bounded public requests.

Full source is public for SignalBridge. Other projects publish selected excerpts. AI coding agents wrote substantial portions of implementation under my direction. Case studies state my role, deployment status, recorded checks and open work; reviews are builder-led.

## Preview and maintenance

The site uses plain HTML, CSS and one local JavaScript file. No package installation or build is required.

```powershell
python -m http.server 4719 --bind 127.0.0.1
```

Open `http://127.0.0.1:4719/`. Projects, architecture stages and illustrative product examples remain readable without JavaScript. Optional enhancements include filters with shareable URLs, keyboard-accessible workflow tabs, an access-control comparison, ticket/accounting/price-check examples, screenshot inspection and themes. A native comparison table covers all five projects. Reduced-motion preferences are respected.

The recruiter summary is available as HTML and a downloadable PDF. Regenerate the PDF after changing the maintained public summary with `python scripts/build_recruiter_summary.py`; the builder requires ReportLab. Inspect every rendered page before publishing. See [presentation references and verification](docs/INSPIRATION-REVIEW.md) for the rationale behind the navigation and examples.

There are no trackers, external fonts, runtime model calls or browser data storage. The content security policy permits local scripts and styles only. Public examples contain synthetic data.

When updating a project, keep the homepage, case study and evidence index consistent. Retain dates on historical results and distinguish recorded checks from deployed behavior. Check local links, mobile/tablet/desktop layouts, keyboard navigation, dialogs, themes, reduced motion, printing and the fallback without JavaScript before publication. Do not publish application records, employer materials, credentials or operational configuration.
