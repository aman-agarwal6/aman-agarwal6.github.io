/* Small, self-contained enhancements. All substantive content lives in HTML. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reducedPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkPreference = window.matchMedia("(prefers-color-scheme: dark)");
  let manualReduction = false;
  let manualTheme = false;
  const reduced = () => manualReduction || reducedPreference.matches;
  const motionButton = document.querySelector(".motion-control");

  function applyMotion() {
    root.dataset.motion = reduced() ? "reduce" : "full";
    if (motionButton) {
      motionButton.textContent = reducedPreference.matches
        ? "Motion: reduced by system"
        : reduced()
          ? "Motion: off"
          : "Motion: on";
      motionButton.setAttribute("aria-pressed", String(reduced()));
      motionButton.disabled = reducedPreference.matches;
    }
    if (reduced())
      document
        .querySelectorAll(".reveal.is-pending")
        .forEach((el) => el.classList.remove("is-pending"));
  }
  motionButton?.addEventListener("click", () => {
    manualReduction = !manualReduction;
    applyMotion();
  });
  reducedPreference.addEventListener("change", applyMotion);
  applyMotion();

  const themeButton = document.querySelector(".theme-toggle");
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton?.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    );
    themeButton?.setAttribute("title", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  }
  setTheme(darkPreference.matches ? "dark" : "light");
  themeButton?.addEventListener("click", () => {
    manualTheme = true;
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  darkPreference.addEventListener("change", (e) => {
    if (!manualTheme) setTheme(e.matches ? "dark" : "light");
  });

  // Manual-activation tabs: arrows move focus; Enter/Space chooses a panel.
  function tabKeyboard(tabs, activate) {
    tabs.forEach((tab, index) =>
      tab.addEventListener("keydown", (event) => {
        let target;
        if (event.key === "ArrowRight" || event.key === "ArrowDown")
          target = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp")
          target = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = tabs.length - 1;
        if (target !== undefined) {
          event.preventDefault();
          tabs[target].focus();
        }
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          activate(index);
        }
      }),
    );
  }
  const flowActivations = new Map();
  document.querySelectorAll("[data-flow-explorer]").forEach((explorer) => {
    const tabs = [...explorer.querySelectorAll("[data-flow-tab]")];
    const panels = [...explorer.querySelectorAll("[data-flow-panel]")];
    explorer.querySelector(".flow-tabs").setAttribute("role", "tablist");
    explorer
      .querySelectorAll(".flow-tabs > li")
      .forEach((li) => li.setAttribute("role", "presentation"));
    const activate = (index) => {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(selected));
        tab.setAttribute("aria-controls", panels[i].id);
        tab.tabIndex = selected ? 0 : -1;
        if (!tab.id) tab.id = `${panels[i].id}-tab`;
        panels[i].setAttribute("role", "tabpanel");
        panels[i].setAttribute("aria-labelledby", tab.id);
        panels[i].tabIndex = 0;
        panels[i].hidden = !selected;
      });
    };
    tabs.forEach((tab, i) =>
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        activate(i);
      }),
    );
    tabKeyboard(tabs, activate);
    panels.forEach((panel, index) => flowActivations.set(panel.id, () => activate(index)));
    const initial = panels.findIndex((p) => `#${p.id}` === location.hash);
    activate(initial >= 0 ? initial : 0);
  });

  addEventListener("hashchange", () => {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    flowActivations.get(id)?.();
  });
  const projectTabs = [...document.querySelectorAll("[data-project-tab]")];
  const projectPanels = [...document.querySelectorAll("[data-project-panel]")];
  if (projectTabs.length) {
    const tablist = document.querySelector(".project-selectors");
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Project walkthroughs");
    const orientation = () =>
      tablist.setAttribute("aria-orientation", innerWidth > 950 ? "vertical" : "horizontal");
    orientation();
    addEventListener("resize", orientation);
    function selectProject(index, history = false) {
      projectTabs.forEach((tab, i) => {
        const selected = i === index;
        tab.id = `project-tab-${tab.dataset.projectTab}`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(selected));
        tab.setAttribute("aria-controls", projectPanels[i].id);
        tab.tabIndex = selected ? 0 : -1;
        projectPanels[i].setAttribute("role", "tabpanel");
        projectPanels[i].setAttribute("aria-labelledby", tab.id);
        projectPanels[i].hidden = !selected;
        projectPanels[i].classList.remove("is-entering");
      });
      if (!reduced()) projectPanels[index].classList.add("is-entering");
      if (history && location.hash !== `#${projectPanels[index].id}`)
        window.history.pushState(null, "", `#${projectPanels[index].id}`);
    }
    function fromHash() {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        id = "";
      }
      const target = document.getElementById(id);
      const panel = target?.closest("[data-project-panel]");
      const index = projectPanels.indexOf(panel);
      if (index >= 0) selectProject(index);
      else if (!id || !projectPanels.some((p) => !p.hidden)) selectProject(0);
    }
    projectTabs.forEach((tab, i) =>
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        selectProject(i, true);
      }),
    );
    tabKeyboard(projectTabs, (i) => selectProject(i, true));
    selectProject(0);
    fromHash();
    window.addEventListener("popstate", fromHash);
    window.addEventListener("hashchange", fromHash);
  }

  const scenario = document.querySelector("[data-scenario]");
  if (scenario) {
    let step = 0;
    let mode = "after";
    const steps = [
      [
        "Role check",
        "A valid role check passes.",
        "A user has access when the request begins. The important question is whether that earlier check still authorizes the later write.",
        "Request begins",
      ],
      [
        "Membership changes",
        "Membership is removed.",
        "Access changes after the first check. A retained request can still reach the write path; an earlier permission decision is now stale.",
        "Authority changed",
      ],
      [
        "Write boundary",
        "The write reaches its decision point.",
        "This is where the two designs diverge: trust the earlier role check, or re-check current membership inside the transaction.",
        "Compare the boundary",
      ],
    ];
    const next = scenario.querySelector("[data-scenario-next]");
    const reset = scenario.querySelector("[data-scenario-reset]");
    function renderScenario() {
      let entry = steps[step];
      if (step === 3)
        entry =
          mode === "after"
            ? [
                "Transaction re-check",
                "The write is blocked.",
                "The illustrated fixed path checks account and role inside the write transaction. Revoked access cannot authorize this write in the demonstrated local workflow.",
                "Illustrated outcome: blocked",
              ]
            : [
                "Original check",
                "The stale decision allows the write.",
                "The illustrated original path relies on its earlier check. The recorded local test allowed four writes after revocation; that observation motivated the transaction-level re-check.",
                "Illustrated outcome: accepted",
              ];
      scenario.querySelector("[data-scenario-counter]").textContent =
        `Step ${step + 1} of 4 / ${entry[0]}`;
      scenario.querySelector("[data-scenario-title]").textContent = entry[1];
      scenario.querySelector("[data-scenario-description]").textContent = entry[2];
      const status = scenario.querySelector("[data-scenario-status]");
      status.textContent = entry[3];
      status.dataset.outcome = step === 3 ? (mode === "after" ? "blocked" : "accepted") : "pending";
      scenario
        .querySelectorAll("[data-scenario-mode]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.scenarioMode === mode)));
      scenario
        .querySelectorAll("[data-scenario-node]")
        .forEach((node, i) => node.classList.toggle("is-current", i === Math.min(step, 2)));
      next.firstChild.textContent = step === 3 ? "Replay sequence " : "Trace next event ";
      reset.disabled = step === 0;
    }
    next.addEventListener("click", () => {
      step = (step + 1) % 4;
      renderScenario();
    });
    reset.addEventListener("click", () => {
      step = 0;
      renderScenario();
    });
    scenario.querySelectorAll("[data-scenario-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        mode = b.dataset.scenarioMode;
        renderScenario();
      }),
    );
    renderScenario();
  }

  // Native dialogs supply Escape, background inertness and keyboard focus trapping.
  const openers = new WeakMap();
  function openDialog(dialog, opener) {
    if (!dialog || dialog.open) return;
    openers.set(dialog, opener);
    dialog.showModal();
    root.classList.add("modal-open");
    dialog.querySelector("[data-close-dialog]")?.focus();
  }
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const items = [
        ...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]'),
      ].filter((el) => el.getClientRects().length);
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.querySelectorAll('a[href^="#"]').forEach((link) =>
      link.addEventListener("click", () => {
        const destination = document.getElementById(link.getAttribute("href").slice(1));
        dialog.close();
        if (destination) {
          destination.tabIndex = -1;
          requestAnimationFrame(() => destination.focus({ preventScroll: true }));
        }
      }),
    );
    dialog
      .querySelectorAll("[data-close-dialog]")
      .forEach((b) => b.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) root.classList.remove("modal-open");
      const opener = openers.get(dialog);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  });
  document
    .querySelectorAll("[data-open-brief]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openDialog(document.getElementById("recruiter-brief"), button),
      ),
    );
  document.querySelectorAll("[data-image]").forEach((button) =>
    button.addEventListener("click", () => {
      const url = new URL(button.dataset.image, location.href);
      if (url.origin !== location.origin || !url.pathname.includes("/assets/img/")) return;
      const image = document.getElementById("inspected-image");
      image.src = url.href;
      image.alt = button.dataset.caption;
      document.getElementById("inspected-caption").textContent = button.dataset.caption;
      openDialog(document.getElementById("image-viewer"), button);
    }),
  );

  if ("IntersectionObserver" in window && !reduced()) {
    const reveals = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-pending");
          entry.target.classList.add("is-visible");
          reveals.unobserve(entry.target);
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) el.classList.add("is-pending");
      reveals.observe(el);
    });
  }
  if ("IntersectionObserver" in window) {
    const nav = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll(".nav-links a").forEach((a) => {
            if (a.getAttribute("href") === `#${entry.target.id}`)
              a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document.querySelectorAll("main > section[id]").forEach((section) => nav.observe(section));
  }
  const progress = document.querySelector(".reading-progress span");
  let scheduled = false;
  function readProgress() {
    scheduled = false;
    const extent = root.scrollHeight - innerHeight;
    if (progress)
      progress.style.transform = `scaleX(${extent > 0 ? Math.min(1, Math.max(0, scrollY / extent)) : 0})`;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(readProgress);
      }
    },
    { passive: true },
  );
  addEventListener("resize", readProgress);
  readProgress();
  root.classList.add("js");
})();
