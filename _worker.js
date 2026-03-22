// _worker.js — Cloudflare Pages Function
// Положить в корень каждого из 11 GitHub репозиториев
// Один файл для всех доменов — hostname определяется автоматически

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

const SEXYFANS = "https://t.datsk11.com/403634/9144/37522?aff_sub=";

function getCourseUrl(request) {
  const lang = request.headers.get("accept-language") || "";
  return lang.toLowerCase().includes("uk")
    ? "https://ailuxlab.lemonsqueezy.com/checkout/buy/7d5b4157-0771-4b12-b0cc-f6215158aa9c"
    : "https://ailuxlab.lemonsqueezy.com/checkout/buy/0db66c39-5933-4f6d-8526-7209e80f6c6a";
}

const DOMAIN_OFFERS = {

  // NAILS
  "beauty-nails-bbw.pages.dev": {
    left:  { url: OFFERS.maybelline, suffix: "_maybelline" },
    right: { url: OFFERS.bathbody,   suffix: "_bathbody"   },
    defaultAcc: "acc1",
  },
  "nails-v2.pages.dev": {
    left:  { url: OFFERS.bathbody,  suffix: "_bathbody" },
    right: { url: OFFERS.sephora,   suffix: "_sephora"  },
    defaultAcc: "acc2",
  },
  "nails-v3.pages.dev": {
    left:  { url: OFFERS.sephora,    suffix: "_sephora"    },
    right: { url: OFFERS.maybelline, suffix: "_maybelline" },
    defaultAcc: "acc5",
  },

  // HAIR
  "hair-rewards.pages.dev": {
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
    left:  { url: OFFERS.bathbody,  suffix: "_bathbody" },
    right: { url: OFFERS.sephora,   suffix: "_sephora"  },
    defaultAcc: "acc16",
  },

  // GLAM
  "glam-rewards.pages.dev": {
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

  // AI GIRLS — старые домены (на случай если пины ещё ведут туда)
  "ai-girls.pages.dev": {
    left:  { url: SEXYFANS, suffix: "", type: "dating" },
    right: { url: null,     suffix: "", type: "course" },
    defaultAcc: "acc3",
  },
  "dating-v2.pages.dev": {
    left:  { url: null,     suffix: "", type: "course" },
    right: { url: SEXYFANS, suffix: "", type: "dating" },
    defaultAcc: "acc4",
  },

  // AI GIRLS — новые домены (Cloudflare Pages проекты ai-girls-v1 и ai-girls-v2)
  "ai-girls-v1.pages.dev": {
    left:  { url: SEXYFANS, suffix: "", type: "dating" },
    right: { url: null,     suffix: "", type: "course" },
    defaultAcc: "acc3",
  },
  "ai-girls-v2.pages.dev": {
    left:  { url: null,     suffix: "", type: "course" },
    right: { url: SEXYFANS, suffix: "", type: "dating" },
    defaultAcc: "acc4",
  },
};

function buildGeoUrl(cfg, hostname) {
  const s2 = hostname.split(".")[0];
  return `https://${cfg.host}/trk/lnk/${TRK}/?o=${cfg.o}&${AFF}&k=${cfg.k}&l=${cfg.l}&s1=pinterest&s2=${s2}`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const country = request.cf?.country || "US";

    // Pinterest краулер → чистая страница без редиректа
    const ua = request.headers.get("User-Agent") || "";
    if (ua.includes("Pinterestbot") || ua.includes("Pinterest/")) {
      return env.ASSETS.fetch(request);
    }

    // GB, IE, AU, CA → гео-оффер
    const geoCfg = GEO[country];
    if (geoCfg) {
      return Response.redirect(buildGeoUrl(geoCfg, hostname), 302);
    }

    // /go?offer=left|right&acc=accX → affiliate редирект
    if (url.pathname === "/go") {
      const side = url.searchParams.get("offer");
      const acc  = url.searchParams.get("acc");
      const domainCfg = DOMAIN_OFFERS[hostname];

      if (!domainCfg || !domainCfg[side]) {
        return new Response("Not found", { status: 404 });
      }

      const offerCfg = domainCfg[side];
      const accId = acc || domainCfg.defaultAcc;

      if (offerCfg.type === "course") {
        return Response.redirect(getCourseUrl(request), 302);
      }

      const s2 = offerCfg.suffix ? accId + offerCfg.suffix : accId;
      return Response.redirect(offerCfg.url + s2, 302);
    }

    // Всё остальное → лендинг (статика из Pages)
    return env.ASSETS.fetch(request);
  },
};
