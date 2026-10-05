# aman-agarwal6.github.io

Source for **[aman-agarwal6.github.io](https://aman-agarwal6.github.io/)**, the portfolio of Aman Agarwal: identity security and security operations.

[Portfolio](https://aman-agarwal6.github.io/) · [Recruiter summary](https://aman-agarwal6.github.io/overview.html) · [Project index](docs/PROJECTS.md) · [GitHub profile](https://github.com/aman-agarwal6)

| Project | What it is | Start here |
| --- | --- | --- |
| AccessOps | Automated employee offboarding that proves access is gone | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [source](https://github.com/aman-agarwal6/AccessOps) |
| SignalBridge | Detection lab that catches access that should have ended | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [source](https://github.com/aman-agarwal6/signalbridge) |
| BetTail | Live web app with access control in the database | [Case study](https://aman-agarwal6.github.io/projects/bettail.html) |
| Netted | Personal-finance app with a security assessment and risk register | [Case study](https://aman-agarwal6.github.io/projects/netted.html) |
| Downfield | AI research agent with locked-down tools | [Case study](https://aman-agarwal6.github.io/projects/downfield.html) |

## Code excerpts in this repository

AccessOps and SignalBridge are public in their own repositories. The other projects are private; this repository publishes selected code and tests from them.

- [AI and application security](proof/ai-security/README.md): agent tool limits, output checks, a scoped publishing credential, access-denial tests and Netted's risk register.
- [Engineering](proof/engineering/README.md): safe CSV exports, session cookies, forecast integrity and a journal recovery drill.
- [Sailday](proof/sailday/README.md): price collection, notifications and offline sync.

## How the site is built

Plain HTML, one stylesheet ([`assets/css/main.css`](assets/css/main.css)) and one small optional script ([`assets/js/site.js`](assets/js/site.js)). No build step, frameworks, trackers, cookies or third-party requests. A Content-Security-Policy on every page allows only same-origin scripts, styles, fonts and images. Light and dark themes follow the system setting, and every page reads fully without JavaScript. Manrope is self-hosted under the OFL ([license](assets/fonts/manrope-OFL.txt)). Tool icons in [`assets/img/tools`](assets/img/tools) come from [Simple Icons](https://simpleicons.org/) (CC0); the logos are trademarks of their owners.

Preview locally:

```sh
python -m http.server 4719 --bind 127.0.0.1
```

Then open http://127.0.0.1:4719/.

Public examples use synthetic or fictional data.
