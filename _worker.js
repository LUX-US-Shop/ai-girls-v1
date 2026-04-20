// _worker.js — Cloudflare Pages Function
// Положить в корень репозиториев ai-girls-v1..v5
// GEO-редирект работает ТОЛЬКО при клике на /go — краулеры всегда получают статику

const TRK = "80DBA135-99F1-423A-BFAD-362D7DE2F22F";
const AFF = "c=918277&a=785920";

const GEO = {
  GB: { o: "31268", k: "A2CB92DE6EEF4E5C3A9C818B798072B7", l: "36392", host: "afflat3e3.com" },
  IE: { o: "31268", k: "A2CB92DE6EEF4E5C3A9C818B798072B7", l: "36392", host: "afflat3e3.com" },
  AU: { o: "28463", k: "C1767789F7A3DEF4C6EBEDFC86BB6C97", l: "31391", host: "afflat3e1.com" },
  CA: { o: "28454", k: "A2310E1D7F3F9D3BF35F644C5CBAF905", l: "31382", host: "afflat3e1.com" },
};

const OFFERS = {
  maybelline: `https://afflat3e1.com/trk/lnk/${TRK}/?o=24725&${AFF}&k=EABA47741A4D32E13B8641F7E2236D72&l=25813&s1=pinterest&s2=`,
  bathbody:   `https://afflat3e1.com/trk/lnk/${TRK}/?o=21419&${AFF}&k=A5C8B7232F8DE144D2F86DA0B3B8D45F&l=22354&s1=pinterest&s2=`,
  sephora:    `https://afflat3e3.com/trk/lnk/${TRK}/?o=25408&${AFF}&k=5CBFF1D0E031B44EDD88D710F2E25BBF&l=26617&s1=pinterest&s2=`,
  covergirl:  `https://afflat3e1.com/trk/lnk/${TRK}/?o=24943&${AFF}&k=F8DF108A7BCAE8B583248B326A96C8FF&l=26034&s1=pinterest&s2=`,
};

const SEXYFANS   = "https://t.crdtg2.com/403634/7412?bo=2753,2754,2755,2756&source=Pinterest3&aff_sub5=SF_006OG000004lmDN";
const JERKMATE  = "https://t.ajrkmx1.com/403634/8780/0?bo=2779,2778,2777,2776,2775&po=6533&aff_sub5=SF_006OG000004lmDN";
const COURSE_EN  = "https://ai.lux-us-shop.store/";

const DOMAIN_OFFERS = {

  // NAILS
  "nails-v1.pages.dev": {
    left:  { url: OFFERS.maybelline, suffix: "_maybelline" },
    right: { url: OFFERS.bathbody,   suffix: "_bathbody"   },
    defaultAcc: "acc1",
  },
  "nails-v2.pages.dev": {
    left:  { url: OFFERS.bathbody,   suffix: "_bathbody" },
    right: { url: OFFERS.sephora,    suffix: "_sephora"  },
    defaultAcc: "acc2",
  },
  "nails-v3.pages.dev": {
    left:  { url: OFFERS.sephora,    suffix: "_sephora"    },
    right: { url: OFFERS.maybelline, suffix: "_maybelline" },
    defaultAcc: "acc5",
  },

  // HAIR
  "hair-v1.pages.dev": {
    left:  { url: OFFERS.covergirl,  suffix: "_covergirl"  },
    right: { url: OFFERS.maybelline, suffix: "_maybelline" },
    defaultAcc: "acc6",
  },
  "hair-v2.pages.dev": {
    left:  { url: OFFERS.maybelline, suffix: "_maybelline" },
    right: { url: OFFERS.bathbody,   suffix: "_bathbody"   },
    defaultAcc: "acc7",
  },
  "hair-v3.pages.dev": {
    left:  { url: OFFERS.bathbody,   suffix: "_bathbody" },
    right: { url: OFFERS.sephora,    suffix: "_sephora"  },
    defaultAcc: "acc16",
  },

  // GLAM
  "glam-v1.pages.dev": {
    left:  { url: OFFERS.sephora,   suffix: "_sephora"   },
    right: { url: OFFERS.covergirl, suffix: "_covergirl" },
    defaultAcc: "acc8",
  },
  "glam-v2.pages.dev": {
    left:  { url: OFFERS.covergirl,  suffix: "_covergirl"  },
    right: { url: OFFERS.maybelline, suffix: "_maybelline" },
    defaultAcc: "acc9",
  },
  "glam-v3.pages.dev": {
    left:  { url: OFFERS.maybelline, suffix: "_maybelline" },
    right: { url: OFFERS.bathbody,   suffix: "_bathbody"   },
    defaultAcc: "acc10",
  },

  // AI GIRLS
  "ai-girls-v1.pages.dev": {
    left:  { url: JERKMATE,  suffix: "", type: "direct" },
    right: { url: COURSE_EN, suffix: "", type: "course" },
    defaultAcc: "acc3",
  },
  "ai-girls-v2.pages.dev": {
    left:  { url: COURSE_EN, suffix: "", type: "course" },
    right: { url: JERKMATE, suffix: "", type: "direct" },
    defaultAcc: "acc4",
  },
  "ai-girls-v3.pages.dev": {
    left:  { url: JERKMATE,  suffix: "", type: "direct" },
    right: { url: COURSE_EN, suffix: "", type: "course" },
    defaultAcc: "acc9",
  },
  "ai-girls-v4.pages.dev": {
    left:  { url: COURSE_EN, suffix: "", type: "course" },
    right: { url: JERKMATE,  suffix: "", type: "direct" },
    defaultAcc: "acc19",
  },
  "ai-girls-v5.pages.dev": {
    left:  { url: JERKMATE,  suffix: "", type: "direct" },
    right: { url: COURSE_EN, suffix: "", type: "course" },
    defaultAcc: "acc20",
  },
  "ai-girls-v6.pages.dev": {
    left:  { url: JERKMATE,  suffix: "", type: "direct" },
    right: { url: COURSE_EN, suffix: "", type: "course" },
    defaultAcc: "acc21",
  },
  // Custom domain alias для luxe_ai_queens (bio link)
  "dating.lux-us-shop.store": {
    left:  { url: JERKMATE,  suffix: "", type: "direct" },
    right: { url: COURSE_EN, suffix: "", type: "course" },
    defaultAcc: "acc21",
  },
};

function buildGeoUrl(cfg, hostname) {
  const s2 = hostname.split(".")[0];
  return `https://${cfg.host}/trk/lnk/${TRK}/?o=${cfg.o}&${AFF}&k=${cfg.k}&l=${cfg.l}&s1=pinterest&s2=${s2}`;
}

export default {
  async fetch(request, env, ctx) {
    const url      = new URL(request.url);
    const hostname = url.hostname;
    const country  = request.cf?.country || "US";

    // ── /go → affiliate редирект (включая GEO) ──────────────────────────
    if (url.pathname === "/go") {
      const side      = url.searchParams.get("offer");
      const acc       = url.searchParams.get("acc");
      const domainCfg = DOMAIN_OFFERS[hostname];

      if (!domainCfg || !domainCfg[side]) {
        return new Response("Not found", { status: 404 });
      }

      // GB, IE, AU, CA → гео-оффер (только для beauty страниц, не для AI Girls)
      const AI_GIRLS = new Set(["ai-girls-v1.pages.dev", "ai-girls-v2.pages.dev", "ai-girls-v3.pages.dev", "ai-girls-v4.pages.dev", "ai-girls-v5.pages.dev", "ai-girls-v6.pages.dev", "dating.lux-us-shop.store"]);
      const geoCfg = GEO[country];
      if (geoCfg && !AI_GIRLS.has(hostname)) {
        return Response.redirect(buildGeoUrl(geoCfg, hostname), 302);
      }

      const offerCfg = domainCfg[side];
      const accId    = acc || domainCfg.defaultAcc;

      // Курс — редирект без s2
      if (offerCfg.type === "course") {
        return Response.redirect(offerCfg.url, 302);
      }

      // Direct — редирект без s2
      if (offerCfg.type === "direct") {
        return Response.redirect(offerCfg.url, 302);
      }

      // Dating — s2 = accId
      if (offerCfg.type === "dating") {
        return Response.redirect(offerCfg.url + accId, 302);
      }

      // Beauty — s2 = accId + suffix
      const s2 = offerCfg.suffix ? accId + offerCfg.suffix : accId;
      return Response.redirect(offerCfg.url + s2, 302);
    }

    // ── Всё остальное (краулеры, боты, визиты /) → статика ──────────────
    return env.ASSETS.fetch(request);
  },
};
