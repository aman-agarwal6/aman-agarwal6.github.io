/* Optional enhancements. Project content and evidence remain in the HTML. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const motionButton = document.querySelector(".motion-control");
  const themeButton = document.querySelector(".theme-toggle");
  let manualReduction = false;
  let manualTheme = false;
  const reduced = () => manualReduction || reducedPreference.matches;

  function watchPreference(preference, handler) {
    if (preference.addEventListener) preference.addEventListener("change", handler);
    else preference.addListener(handler);
  }

  function applyMotion() {
    root.dataset.motion = reduced() ? "reduce" : "full";
    if (motionButton) {
      motionButton.textContent = reducedPreference.matches
        ? "Motion: reduced by system"
        : reduced() ? "Motion: off" : "Motion: on";
      motionButton.setAttribute("aria-pressed", String(reduced()));
      motionButton.disabled = reducedPreference.matches;
    }
    if (reduced()) {
      document.querySelectorAll(".reveal.is-pending").forEach((element) => {
        element.classList.remove("is-pending");
      });
    }
  }

  motionButton?.addEventListener("click", () => {
    manualReduction = !manualReduction;
    applyMotion();
  });
  watchPreference(reducedPreference, applyMotion);
  applyMotion();

  function setTheme(theme) {
    root.dataset.theme = theme;
    const label = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
    themeButton?.setAttribute("aria-label", label);
    themeButton?.setAttribute("title", label);
  }

  setTheme(darkPreference.matches ? "dark" : "light");
  themeButton?.addEventListener("click", () => {
    manualTheme = true;
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  watchPreference(darkPreference, (event) => {
    if (!manualTheme) setTheme(event.matches ? "dark" : "light");
  });

  function fragmentTarget(hash = location.hash) {
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  }

  // Manual activation: arrows move focus, then Enter/Space selects the stage.
  const flowActivations = new Map();
  document.querySelectorAll("[data-flow-explorer]").forEach((explorer) => {
    const tablist = explorer.querySelector(".flow-tabs");
    const tabs = [...explorer.querySelectorAll("[data-flow-tab]")];
    const panels = tabs.map((tab) => {
      return [...explorer.querySelectorAll("[data-flow-panel]")].find(
        (panel) => panel.dataset.flowPanel === tab.dataset.flowTab,
      );
    });
    // Leave the ordinary anchor links intact if a stage is incomplete.
    if (!tablist || !tabs.length || panels.some((panel) => !panel?.id)) return;

    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Architecture stages");
    tablist.querySelectorAll(":scope > li").forEach((item) => {
      item.setAttribute("role", "presentation");
    });

    function activate(index) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
    }

    tabs.forEach((tab, index) => {
      const panel = panels[index];
      if (!tab.id) tab.id = `${panel.id}-tab`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.tabIndex = 0;
      flowActivations.set(panel, () => activate(index));
      tab.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        activate(index);
      });
      tab.addEventListener("keydown", (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        let target;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          target = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          target = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") target = 0;
        else if (event.key === "End") target = tabs.length - 1;

        if (target !== undefined) {
          event.preventDefault();
          tabs.forEach((item, i) => { item.tabIndex = i === target ? 0 : -1; });
          tabs[target].focus();
        } else if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          activate(index);
        }
      });
    });

    const target = fragmentTarget()?.closest("[data-flow-panel]");
    const initial = panels.indexOf(target);
    activate(initial >= 0 ? initial : 0);
  });

  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-project-card]")];
  const count = document.querySelector("[data-filter-count]");
  const allowedFilters = new Set(["all", "soc", "web", "ai"]);
  let activeFilter = "all";

  function updateHistory(url, replace = false) {
    // Browsers that disallow history changes can still use every control.
    try {
      window.history[replace ? "replaceState" : "pushState"](null, "", url);
    } catch {
      // No persisted state, tracking or fallback network request is needed.
    }
  }

  function applyFilter(filter) {
    // Older application-security filter links now show the web applications.
    if (filter === "appsec") filter = "web";
    activeFilter = allowedFilters.has(filter) ? filter : "all";
    let visible = 0;
    cards.forEach((card) => {
      const focuses = (card.dataset.focus || "").split(/\s+/);
      card.hidden = activeFilter !== "all" && !focuses.includes(activeFilter);
      if (!card.hidden) visible += 1;
    });
    filters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? "project" : "projects"}`;
  }

  function revealProjectTarget(target) {
    const card = target?.closest("[data-project-card]");
    if (!card?.hidden) return false;
    applyFilter("all");
    const url = new URL(location.href);
    url.searchParams.delete("focus");
    updateHistory(url, true);
    return true;
  }

  function restoreLocation(scrollToRevealed = false) {
    if (filters.length && cards.length) {
      const url = new URL(location.href);
      applyFilter(url.searchParams.get("focus"));
    }
    const target = fragmentTarget();
    const wasHidden = revealProjectTarget(target);
    const panel = target?.closest("[data-flow-panel]");
    const panelWasHidden = panel?.hidden;
    flowActivations.get(panel)?.();
    if ((wasHidden || panelWasHidden) && scrollToRevealed) {
      // Recover native fragment navigation when its destination was filtered out.
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }
  }

  if (filters.length && cards.length) {
    filters.forEach((button) => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (!allowedFilters.has(filter) || filter === activeFilter) return;
      applyFilter(filter);
      const url = new URL(location.href);
      if (filter === "all") url.searchParams.delete("focus");
      else url.searchParams.set("focus", filter);
      // A permalink must not point to a project hidden by its own filter.
      if (fragmentTarget()?.closest("[data-project-card]")?.hidden) url.hash = "";
      updateHistory(url);
    }));

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      revealProjectTarget(fragmentTarget(url.hash));
    });
  }

  window.addEventListener("popstate", () => restoreLocation(true));
  window.addEventListener("hashchange", () => restoreLocation(true));
  restoreLocation();

  const scenario = document.querySelector("[data-scenario]");
  if (scenario) {
    let step = 0;
    let mode = "after";
    const next = scenario.querySelector("[data-scenario-next]");
    const reset = scenario.querySelector("[data-scenario-reset]");
    const counter = scenario.querySelector("[data-scenario-counter]");
    const title = scenario.querySelector("[data-scenario-title]");
    const description = scenario.querySelector("[data-scenario-description]");
    const status = scenario.querySelector("[data-scenario-status]");
    const modes = [...scenario.querySelectorAll("[data-scenario-mode]")];
    const steps = [
      ["Role check", "A valid role check passes.",
        "A user has access when the request begins. The important question is whether that earlier check still authorizes the later write.", "Request begins"],
      ["Membership changes", "Membership is removed.",
        "Access changes after the first check. A retained request can still reach the write path; an earlier permission decision is now stale.", "Authority changed"],
      ["Write boundary", "The write reaches its decision point.",
        "This is where the two designs diverge: trust the earlier role check, or re-check current membership inside the transaction.", "Compare the boundary"],
    ];

    function renderScenario() {
      const entry = step < 3 ? steps[step] : mode === "after"
        ? ["Transaction re-check", "The write is blocked.",
          "The illustrated fixed path checks account and role inside the write transaction. Revoked access cannot authorize this write in the demonstrated local workflow.", "Illustrated outcome: blocked"]
        : ["Original check", "The stale decision allows the write.",
          "The illustrated original path relies on its earlier check. The recorded local test allowed four writes after revocation; that observation motivated the transaction-level re-check.", "Illustrated outcome: accepted"];
      counter.textContent = `Step ${step + 1} of 4 / ${entry[0]}`;
      title.textContent = entry[1];
      description.textContent = entry[2];
      status.textContent = entry[3];
      status.dataset.outcome = step === 3 ? (mode === "after" ? "blocked" : "accepted") : "pending";
      modes.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.scenarioMode === mode));
      });
      scenario.querySelectorAll("[data-scenario-node]").forEach((node, index) => {
        node.classList.toggle("is-current", index === Math.min(step, 2));
      });
      next.firstChild.textContent = step === 3 ? "Replay sequence " : "Trace next event ";
      reset.disabled = step === 0;
    }

    if (next && reset && counter && title && description && status) {
      next.addEventListener("click", () => {
        step = (step + 1) % 4;
        renderScenario();
      });
      reset.addEventListener("click", () => {
        step = 0;
        renderScenario();
      });
      modes.forEach((button) => button.addEventListener("click", () => {
        if (!["before", "after"].includes(button.dataset.scenarioMode)) return;
        mode = button.dataset.scenarioMode;
        renderScenario();
      }));
      renderScenario();
    }
  }

  // Native modal dialogs provide Escape handling, focus trapping and inertness.
  const viewer = document.getElementById("image-viewer");
  const image = document.getElementById("inspected-image");
  const caption = document.getElementById("inspected-caption");
  const imageButtons = [...document.querySelectorAll("[data-image]")];
  let imageOpener;
  if (viewer && image && caption && typeof viewer.showModal === "function") {
    imageButtons.forEach((button) => button.addEventListener("click", () => {
      let url;
      try {
        url = new URL(button.dataset.image, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.search || url.hash || url.username || url.password ||
        !/\/assets\/img\/[a-z0-9][a-z0-9._-]*\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) return;
      if (viewer.open) return;
      image.src = url.href;
      image.alt = button.dataset.caption || "Project screenshot";
      caption.textContent = button.dataset.caption || "Project screenshot";
      imageOpener = button;
      viewer.showModal();
      root.classList.add("modal-open");
      viewer.querySelector("[data-close-dialog]")?.focus();
    }));
    viewer.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => viewer.close());
    });
    viewer.addEventListener("click", (event) => {
      if (event.target !== viewer) return;
      const box = viewer.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) viewer.close();
    });
    viewer.addEventListener("close", () => {
      root.classList.remove("modal-open");
      if (imageOpener?.isConnected) imageOpener.focus({ preventScroll: true });
    });
  } else {
    imageButtons.forEach((button) => { button.hidden = true; });
  }

  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  if ("IntersectionObserver" in window && !reduced()) {
    const reveals = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        reveals.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element) => {
      if (element.getBoundingClientRect().top > innerHeight) element.classList.add("is-pending");
      reveals.observe(element);
    });
  }

  if ("IntersectionObserver" in window) {
    const nav = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav-links a").forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-15% 0px -65% 0px" });
    document.querySelectorAll("main > section[id]").forEach((section) => nav.observe(section));
  }

  root.classList.add("js");
})();
