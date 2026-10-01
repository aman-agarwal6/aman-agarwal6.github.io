# Aman Agarwal — Security and Applied AI Portfolio

[Live portfolio](https://aman-agarwal6.github.io/) · [Recruiter summary](https://aman-agarwal6.github.io/overview.html) · [Project documentation](docs/PROJECTS.md) · [GitHub profile](https://github.com/aman-agarwal6)

I’m an Iowa State MIS senior with a Cybersecurity Engineering minor, CompTIA Security+ and cybersecurity internship experience at HNI Corporation. I graduate in December 2026 and am available for junior roles in January 2027.

This repository presents my security and AI projects, their design decisions, and supporting code and test evidence. It includes four primary projects and one supporting application-security case study.

| Project | Focus | Start here |
| --- | --- | --- |
| SignalBridge | Security operations and detection engineering | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge) |
| BetTail | Application security and transactional data | [Case study](https://aman-agarwal6.github.io/projects/bettail.html) |
| Netted | Data security, accounting requirements and risk | [Case study](https://aman-agarwal6.github.io/projects/netted.html) |
| Downfield | AI workflow controls, provenance and evaluation | [Case study](https://aman-agarwal6.github.io/projects/downfield.html) |
| Sailday | Private collaboration and offline synchronization | [Supporting case study](https://aman-agarwal6.github.io/projects/sailday.html) |

## Reviewable evidence

- [AI security implementation and selected verification](proof/ai-security/README.md): source excerpts, access-denial tests, LLM controls, scoped publishing and Netted’s risk register.
- [Engineering evidence](proof/engineering/README.md): safe CSV exports, session configuration, forecast evaluation and partial financial-journal recovery.
- [Sailday source evidence](proof/sailday/README.md): authorization on retries, field conflicts and bounded public requests.

Full source is public for SignalBridge. Other projects publish selected excerpts. AI coding agents wrote substantial portions of implementation under my direction. Case studies state my role, deployment status, recorded checks and open work; reviews are builder-led.

## Preview and maintenance

The site uses plain HTML, CSS and one local JavaScript file. No package installation or build is required.

```powershell
python -m http.server 4719 --bind 127.0.0.1
```

Open `http://127.0.0.1:4719/`. Projects and architecture stages remain readable without JavaScript. Optional enhancements include focus filters with shareable URLs, keyboard-accessible architecture tabs, an explanatory access-control comparison, screenshot inspection, themes and a printable summary. Reduced-motion preferences are respected.

There are no trackers, external fonts, runtime model calls or browser data storage. The content security policy permits local scripts and styles only. Public examples contain synthetic data.

When updating a project, keep the homepage, case study and evidence index consistent. Retain dates on historical results and distinguish recorded checks from deployed behavior. Check local links, mobile/tablet/desktop layouts, keyboard navigation, dialogs, themes, reduced motion, printing and the fallback without JavaScript before publication. Do not publish application records, employer materials, credentials or operational configuration.
