/* Optional enhancements. Project content and evidence remain in the HTML. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.querySelector(".motion-control");
  const themeButton = document.querySelector(".theme-toggle");
  let manualReduction = false;
  let motionInitialized = false;
  let revealObserver;
  const motionTimers = new Map();
  const reduced = () => manualReduction || reducedPreference.matches;

  function clearMotionClass(element, className) {
    const timers = motionTimers.get(element);
    if (timers?.has(className)) {
      window.clearTimeout(timers.get(className));
      timers.delete(className);
      if (!timers.size) motionTimers.delete(element);
    }
    element.classList.remove(className);
  }

  // CSS owns each bounded transition. Never delay content or focus updates.
  function markMotion(element, className, duration) {
    if (!element || reduced()) return;
    let timers = motionTimers.get(element);
    if (!timers) {
      timers = new Map();
      motionTimers.set(element, timers);
    }
    if (timers.has(className)) window.clearTimeout(timers.get(className));
    element.classList.add(className);
    timers.set(className, window.setTimeout(() => {
      clearMotionClass(element, className);
    }, duration));
  }

  function resetMotion() {
    motionTimers.forEach((timers, element) => {
      timers.forEach((timer, className) => {
        window.clearTimeout(timer);
        element.classList.remove(className);
      });
    });
    motionTimers.clear();
    root.classList.remove("hero-entry-enabled", "reveal-enabled");
    revealObserver?.disconnect();
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

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
    if (reduced()) resetMotion();
    else if (!motionInitialized) root.classList.add("hero-entry-enabled");
    // Initial entrances never replay after a preference change.
    motionInitialized = true;
  }

  motionButton?.addEventListener("click", () => {
    manualReduction = !manualReduction;
    applyMotion();
  });
  watchPreference(reducedPreference, applyMotion);
  applyMotion();

  // The page follows the system color scheme until the visitor picks one. Nothing is stored.
  const darkPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.dataset.theme || (darkPreference.matches ? "dark" : "light");
  function labelTheme() {
    const label = `Switch to ${currentTheme() === "dark" ? "light" : "dark"} theme`;
    themeButton?.setAttribute("aria-label", label);
    themeButton?.setAttribute("title", label);
  }
  labelTheme();
  watchPreference(darkPreference, labelTheme);
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
    labelTheme();
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
    tablist.setAttribute("aria-label", explorer.dataset.tabLabel || "Architecture stages");
    tablist.querySelectorAll(":scope > li").forEach((item) => {
      item.setAttribute("role", "presentation");
    });

    let selectedIndex = -1;
    function activate(index, animate = true) {
      const changed = selectedIndex !== index;
      selectedIndex = index;
      tabs.forEach((tab, i) => {
        const selected = i === index;
        if (changed) clearMotionClass(panels[i], "is-entering");
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      if (changed && animate) markMotion(panels[index], "is-entering", 160);
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
    activate(initial >= 0 ? initial : 0, false);
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

  // BEGIN SYNTHETIC PRODUCT DEMO FIXTURES
  // Fixed examples only: no app state, user input, live quote or saved record.
  function demoMoney(cents) {
    return `${cents < 0 ? "-" : ""}$${(Math.abs(cents) / 100).toFixed(2)}`;
  }

  function ticketDemoValues(preset) {
    if (preset !== "25" && preset !== "40") return null;
    const stakeCents = preset === "25" ? 2500 : 4000;
    const oddsHundredths = preset === "25" ? 200 : 175;
    const returnCents = Math.round(stakeCents * oddsHundredths / 100);
    const profitCents = returnCents - stakeCents;
    return { values: {
      stake: demoMoney(stakeCents), odds: (oddsHundredths / 100).toFixed(2),
      profit: demoMoney(profitCents), return: demoMoney(returnCents),
    }, note: `This fictional winning ticket records ${demoMoney(profitCents)} profit and ${demoMoney(returnCents)} total return. The original pick remains $10.00 at 2.10 odds.` };
  }

  function accountingDemoValues(saleCase) {
    if (saleCase !== "gain" && saleCase !== "loss") return null;
    const priceCents = saleCase === "gain" ? 12000 : 9000;
    const purchaseCents = 10 * 10000 + 500;
    const basisCents = purchaseCents * 4 / 10;
    const grossCents = 4 * priceCents;
    const saleFeeCents = 200;
    const netCents = grossCents - saleFeeCents;
    const profitCents = netCents - basisCents;
    const aCents = Math.round(profitCents * 60 / 100);
    const bCents = profitCents - aCents;
    return { values: {
      price: demoMoney(priceCents), gross: demoMoney(grossCents),
      sale_fee: demoMoney(saleFeeCents), basis: demoMoney(basisCents),
      net: demoMoney(netCents), profit: demoMoney(profitCents),
      a: demoMoney(aCents), b: demoMoney(bCents),
    }, note: saleCase === "gain"
      ? "The $76.00 realized gain follows the purchase-date shares: A receives $45.60 and B receives $30.40."
      : "The $44.00 realized loss follows the purchase-date shares: A bears $26.40 and B bears $17.60." };
  }

  function priceDemoValues(priceCase) {
    if (!["matching", "guarantee", "failure"].includes(priceCase)) return null;
    const baselineCents = 90000;
    const savedQuoteCents = 87000;
    if (priceCase === "guarantee") {
      return { values: {
        quote: demoMoney(80000), delta: "Not comparable",
        status: "Excluded: Royal assigns the cabin",
      }, note: "This synthetic guarantee fare lets Royal assign the cabin, so it is excluded from the comparable rate difference." };
    }
    return { values: {
      quote: demoMoney(savedQuoteCents), delta: demoMoney(savedQuoteCents - baselineCents),
      status: priceCase === "failure"
        ? "Saved observation; new check unavailable" : "Eligible public rate",
    }, note: priceCase === "failure"
      ? "The last successful synthetic observation was $870.00. The new check failed; the saved price is historical."
      : "The synthetic eligible public quote is $30.00 below the $900.00 fare-and-tax baseline." };
  }
  // END SYNTHETIC PRODUCT DEMO FIXTURES

  function bindFixtureDemo(demo, selector, property, initial, fixture, valueAttribute, noteAttribute) {
    const controls = [...demo.querySelectorAll(selector)];
    if (!controls.length) return;
    let selectedPreset;
    function render(selected, animate = true) {
      if (selected === selectedPreset) return;
      const result = fixture(selected);
      if (!result) return;
      const changedPreset = selectedPreset !== undefined;
      selectedPreset = selected;
      demo.querySelectorAll(`[${valueAttribute}]`).forEach((element) => {
        const key = element.getAttribute(valueAttribute);
        if (Object.hasOwn(result.values, key)) element.textContent = result.values[key];
      });
      controls.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset[property] === selected));
      });
      if (result.note && noteAttribute) {
        demo.querySelectorAll(`[${noteAttribute}]`).forEach((element) => {
          element.textContent = result.note;
        });
      }
      if (changedPreset && animate) markMotion(demo, "is-updated", 200);
    }
    controls.forEach((button) => {
      button.addEventListener("click", () => render(button.dataset[property]));
    });
    render(initial, false);
  }

  document.querySelectorAll('[data-product-demo="bettail"]').forEach((demo) => {
    bindFixtureDemo(demo, "[data-ticket-preset]", "ticketPreset", "25",
      ticketDemoValues, "data-ticket-value", "data-ticket-note");
  });
  document.querySelectorAll('[data-product-demo="netted"]').forEach((demo) => {
    bindFixtureDemo(demo, "[data-sale-case]", "saleCase", "gain",
      accountingDemoValues, "data-accounting-value", "data-accounting-note");
  });
  document.querySelectorAll('[data-product-demo="sailday"]').forEach((demo) => {
    bindFixtureDemo(demo, "[data-price-case]", "priceCase", "matching",
      priceDemoValues, "data-price-value", "data-price-note");
  });

  // Native modal dialogs provide Escape handling, focus trapping and inertness.
  const viewer = document.getElementById("image-viewer");
  const image = document.getElementById("inspected-image");
  const caption = document.getElementById("inspected-caption");
  const imageTitle = document.getElementById("image-title");
  const imageViewport = viewer?.querySelector(".image-viewport");
  const zoomButton = viewer?.querySelector("[data-image-zoom]");
  const originalLink = viewer?.querySelector("[data-image-original]");
  const imageButtons = [...document.querySelectorAll("[data-image]")];
  let imageOpener;
  function fitImage() {
    imageViewport?.classList.remove("is-zoomed");
    if (imageViewport) {
      imageViewport.scrollTop = 0;
      imageViewport.scrollLeft = 0;
    }
    if (zoomButton) {
      zoomButton.textContent = "View full size";
      zoomButton.setAttribute("aria-pressed", "false");
    }
  }
  if (viewer && image && caption && typeof viewer.showModal === "function") {
    imageButtons.forEach((button) => {
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", "image-viewer");
      button.addEventListener("click", (event) => {
        // Modifier clicks retain the native image-link behavior.
        if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        let url;
        try {
          url = new URL(button.dataset.image, location.href);
        } catch {
          return;
        }
        if (url.origin !== location.origin || url.search || url.hash || url.username || url.password ||
          !/\/assets\/img\/[a-z0-9][a-z0-9._-]*\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)) return;
        if (viewer.open) {
          event.preventDefault();
          return;
        }
        image.src = url.href;
        image.alt = button.dataset.caption || "Project screenshot";
        caption.textContent = button.dataset.caption || "Project screenshot";
        if (imageTitle) imageTitle.textContent = button.dataset.imageTitle || "Project screenshot";
        if (originalLink) originalLink.href = url.href;
        fitImage();
        // On a phone, a fit view is no larger than the thumbnail. Start at full resolution.
        if (imageViewport && zoomButton && window.matchMedia("(max-width: 560px)").matches) {
          imageViewport.classList.add("is-zoomed");
          zoomButton.textContent = "Fit to screen";
          zoomButton.setAttribute("aria-pressed", "true");
        }
        imageOpener = button;
        try {
          viewer.showModal();
        } catch {
          return; // The anchor still opens the original image if enhancement is unavailable.
        }
        event.preventDefault();
        root.classList.add("modal-open");
        viewer.querySelector("[data-close-dialog]")?.focus();
      });
    });
    zoomButton?.addEventListener("click", () => {
      if (!imageViewport) return;
      const zoomed = imageViewport.classList.toggle("is-zoomed");
      zoomButton.textContent = zoomed ? "Fit to screen" : "View full size";
      zoomButton.setAttribute("aria-pressed", String(zoomed));
      if (!zoomed) fitImage();
      else imageViewport.focus({ preventScroll: true });
    });
    viewer.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => viewer.close());
    });
    viewer.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const targets = [...viewer.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first || !last) return;
      if ((event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
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
    imageButtons.filter((button) => button.tagName === "BUTTON").forEach((button) => { button.hidden = true; });
  }

  document.querySelectorAll("[data-print]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });

  document.querySelectorAll("details").forEach((disclosure) => {
    disclosure.addEventListener("toggle", () => {
      if (disclosure.open) markMotion(disclosure, "is-opening", 140);
      else clearMotionClass(disclosure, "is-opening");
    });
  });

  // Every element stays visible before enhancement and after observer failure.
  if ("IntersectionObserver" in window && !reduced()) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || reduced()) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    root.classList.add("reveal-enabled");
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
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

    const contentsLinks = [...document.querySelectorAll('.contents a[href^="#"]')];
    const contentsSections = new Map();
    contentsLinks.forEach((link) => {
      const target = fragmentTarget(link.getAttribute("href"));
      const section = target?.closest("section") || target;
      if (!section) return;
      if (!contentsSections.has(section)) contentsSections.set(section, []);
      contentsSections.get(section).push(link);
    });
    if (contentsSections.size) {
      const contents = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = contentsSections.get(entry.target);
          contentsLinks.forEach((link) => {
            if (active.includes(link)) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-15% 0px -60% 0px" });
      contentsSections.forEach((_links, section) => contents.observe(section));
    }
  }

  // A hairline under the sticky header once the page scrolls.
  const header = document.querySelector(".site-header");
  if (header) {
    const markScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", markScrolled, { passive: true });
    markScrolled();
  }

  root.classList.add("js");
})();
