# aman-agarwal6.github.io

Source for **[aman-agarwal6.github.io](https://aman-agarwal6.github.io/)**, the portfolio of Aman Agarwal: identity security, security operations and applied AI.

[Portfolio](https://aman-agarwal6.github.io/) · [Recruiter summary](https://aman-agarwal6.github.io/overview.html) · [Project index and evidence](docs/PROJECTS.md) · [GitHub profile](https://github.com/aman-agarwal6)

| Project | What it is | Start here |
| --- | --- | --- |
| AccessOps | Identity and access management: leaver automation | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [public source](https://github.com/aman-agarwal6/AccessOps) |
| SignalBridge | Security operations and detection engineering | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge) |
| BetTail | Full-stack web app for private sports-pick groups | [Case study](https://aman-agarwal6.github.io/projects/bettail.html) |
| Netted | Personal-finance web app: realized profit, pooled funds and budgeting | [Case study](https://aman-agarwal6.github.io/projects/netted.html) |
| Downfield | Applied AI: LLM research reports with traceable inputs | [Case study](https://aman-agarwal6.github.io/projects/downfield.html) |
| Sailday | Cruise price tracking and offline trip planning | [Case study](https://aman-agarwal6.github.io/projects/sailday.html) |

## Evidence in this repository

AccessOps and SignalBridge are fully public in their own repositories. The other projects stay private; this repository publishes selected source excerpts and synthetic tests instead.

- [AI security evidence](proof/ai-security/README.md): restricted LLM tools, output validation, scoped publishing, access-denial tests and Netted's risk register.
- [Engineering evidence](proof/engineering/README.md): safe CSV exports, session cookies, forecast integrity and a journal recovery drill.
- [Sailday evidence](proof/sailday/README.md): price collection, comparisons, graphs, notifications and offline sync.

## How the site is built

Plain HTML, one stylesheet ([`assets/css/main.css`](assets/css/main.css)) and one optional script ([`assets/js/site.js`](assets/js/site.js)). No build step, frameworks, trackers, cookies or third-party requests. A Content-Security-Policy on every page allows only same-origin scripts, styles, fonts and images. Light and dark themes follow the system setting, and every page reads fully without JavaScript. Manrope is self-hosted under the OFL ([license](assets/fonts/manrope-OFL.txt)).

Preview locally:

```sh
python -m http.server 4719 --bind 127.0.0.1
```

Then open http://127.0.0.1:4719/.

AI coding agents wrote substantial portions of the implementation under my direction. Each case study states my role, deployment status, recorded checks and open work; reviews are builder-led. Public examples use synthetic or fictional data.
