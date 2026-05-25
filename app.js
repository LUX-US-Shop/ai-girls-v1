(function () {
  const config = window.LANDING_CONFIG || {};
  const analyticsConfig = config.analytics || {};
  const telegramConfig = config.telegram || {};
  const metaConfig = config.meta || {};
  const params = new URLSearchParams(window.location.search);

  const GA_ID = analyticsConfig.gaId || "G-DEH5GD3QHX";
  const LANDING_ID = analyticsConfig.landingId || "master_luna_video_v1";
  const VARIANT_ID = analyticsConfig.variantId || "immersive_editorial_mobile_v2";
  const ACCOUNT_ID = analyticsConfig.accountId || "acc_master_v1";

  function withDefault(key, fallback = "") {
    return params.get(key) || fallback;
  }

  function analyticsContext() {
    return {
      landing_id: LANDING_ID,
      variant_id: VARIANT_ID,
      acc: withDefault("acc", ACCOUNT_ID),
      utm_source: withDefault("utm_source", analyticsConfig.defaultUtmSource || "pinterest"),
      utm_medium: withDefault("utm_medium", analyticsConfig.defaultUtmMedium || "organic"),
      utm_campaign: withDefault("utm_campaign", analyticsConfig.defaultUtmCampaign || "master_video_v1"),
    };
  }

  function buildTelegramUrl(key) {
    const channelUrl = telegramConfig.channelUrl || "https://t.me/privateaimuse";
    const url = new URL(channelUrl);

    if (key === "first_drop" && telegramConfig.firstDropStart) {
      url.searchParams.set("start", telegramConfig.firstDropStart);
    }

    if (key === "vip" && telegramConfig.vipStart) {
      url.searchParams.set("start", telegramConfig.vipStart);
    }

    return url;
  }

  function applyMetaConfig() {
    if (metaConfig.title) {
      document.title = metaConfig.title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", metaConfig.ogTitle || metaConfig.title);
    }

    if (metaConfig.description) {
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute("content", metaConfig.description);

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute("content", metaConfig.ogDescription || metaConfig.description);
    }

    if (metaConfig.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute("content", metaConfig.ogImage);
    }

    if (metaConfig.themeColor) {
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) themeColor.setAttribute("content", metaConfig.themeColor);
    }

    if (config.brandName) {
      document.querySelectorAll(".brand").forEach((node) => {
        node.textContent = config.brandName;
      });
    }
  }

  function applyThemeConfig() {
    const theme = config.theme || {};
    const root = document.documentElement;

    if (theme.variables && typeof theme.variables === "object") {
      Object.entries(theme.variables).forEach(([key, value]) => {
        if (!key || typeof value !== "string") return;
        root.style.setProperty(key, value);
      });
    }

    const visuals = config.visuals || {};
    if (visuals.backgroundImage) {
      const bg = document.querySelector(".hero-backdrop__image");
      if (bg) bg.setAttribute("src", visuals.backgroundImage);
    }
  }

  function initAnalytics() {
    const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }

  function trackEvent(name, payload) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, payload);
  }

  function decorateTelegramLinks() {
    const ctx = analyticsContext();
    const trackedLinks = document.querySelectorAll("a[data-telegram-key]");

    trackedLinks.forEach((link) => {
      const linkKey = link.getAttribute("data-telegram-key") || "channel";
      const url = buildTelegramUrl(linkKey);

      if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", ctx.utm_source);
      if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", ctx.utm_medium);
      if (!url.searchParams.has("utm_campaign")) url.searchParams.set("utm_campaign", ctx.utm_campaign);
      if (!url.searchParams.has("acc")) url.searchParams.set("acc", ctx.acc);
      if (!url.searchParams.has("variant_id")) url.searchParams.set("variant_id", ctx.variant_id);

      link.href = url.toString();

      link.addEventListener("click", () => {
        const ctaId = link.getAttribute("data-cta") || "telegram_link";
        const ctaText = (link.textContent || "").trim();
        trackEvent("cta_click", {
          ...ctx,
          account_id: ctx.acc,
          landing_variant: ctx.variant_id,
          cta_id: ctaId,
          cta_text: ctaText,
          destination: link.href,
          page_path: window.location.pathname,
        });
      }, { passive: true });
    });
  }

  function trackLandingView() {
    const ctx = analyticsContext();
    trackEvent("landing_view", {
      ...ctx,
      account_id: ctx.acc,
      landing_variant: ctx.variant_id,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }

  function initScrollDepthTracking() {
    const marks = [25, 50, 75, 90];
    const seen = new Set();
    const ctx = analyticsContext();

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = Math.round((window.scrollY / max) * 100);

      marks.forEach((mark) => {
        if (depth >= mark && !seen.has(mark)) {
          seen.add(mark);
          trackEvent("scroll_depth", {
            ...ctx,
            account_id: ctx.acc,
            landing_variant: ctx.variant_id,
            depth_percent: mark,
          });
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initTimeTracking() {
    const checkpoints = [15, 30, 60];
    const ctx = analyticsContext();

    checkpoints.forEach((seconds) => {
      window.setTimeout(() => {
        trackEvent("time_on_page", {
          ...ctx,
          account_id: ctx.acc,
          landing_variant: ctx.variant_id,
          seconds_on_page: seconds,
        });
      }, seconds * 1000);
    });
  }

  function initRevealObserver() {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

    revealNodes.forEach((node) => {
      const delay = Number(node.getAttribute("data-delay") || "0");
      node.style.setProperty("--delay", `${delay}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    });

    revealNodes.forEach((node) => observer.observe(node));
  }

  function initStickyCTA() {
    const sticky = document.getElementById("mobile-sticky");
    const hero = document.getElementById("top");

    if (!(sticky && hero && "IntersectionObserver" in window)) return;

    const stickyObserver = new IntersectionObserver((entries) => {
      const isHeroVisible = entries[0].isIntersecting;
      sticky.classList.toggle("is-visible", !isHeroVisible);
      sticky.setAttribute("aria-hidden", String(isHeroVisible));
    }, {
      threshold: 0.1,
    });

    stickyObserver.observe(hero);
  }

  applyMetaConfig();
  applyThemeConfig();
  initAnalytics();
  decorateTelegramLinks();
  trackLandingView();
  initScrollDepthTracking();
  initTimeTracking();
  initRevealObserver();
  initStickyCTA();
})();
