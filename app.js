/* Annotated — permanent static demo (GitHub Pages). Hash routes. */
const BASE = (function () {
  // Support project pages under /annotated-com/ and local file roots
  const p = location.pathname;
  if (p.endsWith("/index.html")) return p.slice(0, -10);
  if (p.endsWith("/")) return p;
  return p.replace(/\/[^/]*$/, "/");
})();

const SEED = [
  {
    slug: "all-in-on-ai-bubbles",
    title: "All-In on AI bubbles",
    mediaType: "video",
    body: "The clip where the panel debates whether this cycle is different — useful for anyone writing about froth vs. fundamentals.",
    excerpt: "Is this an AI bubble, or is it the beginning of a multi-decade infrastructure cycle?",
    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    sourceTitle: "All-In Podcast",
    clipVideoUrl: "./clips/bbb.mp4",
    clipStartSec: 5,
    clipEndSec: 35,
    author: "maya",
    handle: "maya",
  },
  {
    slug: "this-week-in-startups-clip",
    title: "This Week in Startups — distribution",
    mediaType: "video",
    body: "Jason on distribution: product is not enough if nobody hears about it. Classic TWiST energy.",
    excerpt: "Distribution is the job. Product without distribution is a diary.",
    sourceUrl: "https://thisweekinstartups.com",
    sourceTitle: "This Week in Startups",
    clipVideoUrl: "./clips/flower.mp4",
    clipStartSec: 0,
    clipEndSec: 28,
    author: "devon",
    handle: "devon",
  },
  {
    slug: "youtube-clip-economy",
    title: "The YouTube clip economy",
    mediaType: "video",
    body: "Short windows travel farther than full episodes. Annotated is built for that unit of media.",
    excerpt: "Clips are the native unit of attention on the open web.",
    sourceUrl: "https://youtube.com",
    sourceTitle: "Media notes",
    clipVideoUrl: "./clips/short2.mp4",
    clipStartSec: 2,
    clipEndSec: 40,
    author: "riley",
    handle: "riley",
  },
  {
    slug: "fair-use-for-clips",
    title: "Fair use for short clips",
    mediaType: "text",
    body: "A short commentary window with attribution is how criticism and education work on the web. Always link the source.",
    excerpt: "Attribution + commentary + limited length is the contract with the source.",
    sourceUrl: "https://www.copyright.gov/fair-use/",
    sourceTitle: "U.S. Copyright Office — Fair Use",
    clipVideoUrl: null,
    clipStartSec: 0,
    clipEndSec: 0,
    author: "sam",
    handle: "sam",
  },
  {
    slug: "margin-notes-on-media",
    title: "Margin notes on media",
    mediaType: "text",
    body: "The open web needs a place for public margin notes that don't trap the original behind a walled garden.",
    excerpt: "Highlight the line, add your take, ship a public page that points home.",
    sourceUrl: "https://en.wikipedia.org/wiki/Annotation",
    sourceTitle: "Annotation (Wikipedia)",
    clipVideoUrl: null,
    clipStartSec: 0,
    clipEndSec: 0,
    author: "alex",
    handle: "alex",
  },
];

const SOURCES = [
  {
    id: "bunny",
    label: "Big Buck Bunny (sample)",
    mediaType: "video",
    sourceUrl: "https://peach.blender.org/",
    sourceTitle: "Big Buck Bunny",
    clipVideoUrl: "./clips/bbb.mp4",
    duration: 60,
  },
  {
    id: "flower",
    label: "Flower field (sample)",
    mediaType: "video",
    sourceUrl: "https://example.com/flower",
    sourceTitle: "Flower clip",
    clipVideoUrl: "./clips/flower.mp4",
    duration: 45,
  },
  {
    id: "elephants",
    label: "Wildlife short (sample)",
    mediaType: "video",
    sourceUrl: "https://example.com/wildlife",
    sourceTitle: "Wildlife short",
    clipVideoUrl: "./clips/short2.mp4",
    duration: 40,
  },
  {
    id: "text-article",
    label: "Text article (sample)",
    mediaType: "text",
    sourceUrl: "https://en.wikipedia.org/wiki/Web_annotation",
    sourceTitle: "Web annotation",
    clipVideoUrl: null,
    duration: 0,
    excerpt:
      "Web annotation is a way for individuals to interact with content online by adding notes, comments, or other markup.",
  },
];

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem("annotated_extra") || "[]");
  } catch {
    return [];
  }
}
function saveLocal(items) {
  localStorage.setItem("annotated_extra", JSON.stringify(items));
}
function allAnnotations() {
  return [...loadLocal(), ...SEED];
}
function bySlug(slug) {
  return allAnnotations().find((a) => a.slug === slug) || null;
}
function fmt(sec) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "\u0026amp;")
    .replaceAll("<", "\u0026lt;")
    .replaceAll(">", "\u0026gt;")
    .replaceAll('"', "\u0026quot;");
}

function cardHTML(a) {
  const media =
    a.mediaType === "video" && a.clipVideoUrl
      ? `<div class="player">
          <span class="player-badge">240p · ${fmt(a.clipStartSec)}–${fmt(a.clipEndSec)}</span>
          <video controls preload="metadata" src="${esc(a.clipVideoUrl)}#t=${a.clipStartSec},${a.clipEndSec}"></video>
        </div>`
      : `<div class="video-frame surface-grid" style="min-height:140px"></div>`;
  return `<article class="card">
    ${media}
    <div class="card-body">
      <div class="meta">
        <span class="chip ${a.mediaType}">${esc(a.mediaType)}</span>
        <span class="subtle">@${esc(a.handle)}</span>
      </div>
      <h3><a href="#/a/${esc(a.slug)}">${esc(a.title)}</a></h3>
      ${a.excerpt ? `<blockquote class="quote mark-highlight">${esc(a.excerpt)}</blockquote>` : ""}
      <p class="muted" style="margin:0;font-size:0.92rem">${esc(a.body)}</p>
      <div class="row" style="margin-top:auto;padding-top:0.4rem">
        <a class="btn btn-secondary" href="#/a/${esc(a.slug)}">Open page</a>
        <a class="btn btn-ghost" href="${esc(a.sourceUrl)}" target="_blank" rel="noopener">Source ↗</a>
      </div>
    </div>
  </article>`;
}

function shellPage(html) {
  return html;
}

function renderHome() {
  const feed = allAnnotations().slice(0, 3);
  return shellPage(`
    <section class="hero container">
      <div class="badge">Clip · Annotate · Share</div>
      <h1>Margin notes for the open web</h1>
      <p>Annotated is a Chrome sidebar that lets you clip text, audio, or video from anywhere, add your take, and publish a public landing page that always links back to the source.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#/clip">Open the sidebar</a>
        <a class="btn btn-secondary" href="#/feed">Browse the feed</a>
        <a class="btn btn-ghost" href="#/demo">Watch demo video</a>
      </div>
    </section>
    <section class="container section">
      <div class="panel">
        <div class="browser-chrome">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <div class="urlbar">youtube.com/watch?v=…</div>
        </div>
        <div class="grid-2">
          <div style="padding:1.2rem">
            <div class="player">
              <span class="player-badge">240p clip</span>
              <video controls preload="metadata" src="./clips/bbb.mp4#t=5,35"></video>
            </div>
          </div>
          <div class="sidebar" style="border:0;border-radius:0;border-left:1px solid var(--color-border)">
            <div class="badge">Extension sidebar</div>
            <strong>Clip window ≤ 90 seconds</strong>
            <p class="muted" style="margin:0;font-size:0.92rem">Select a range, write your note, publish a public page with a source link and File a claim.</p>
            <a class="btn btn-primary" href="#/clip">Try the clipper</a>
          </div>
        </div>
      </div>
      <div class="feature-grid">
        <div class="feature"><div class="badge">Text · Audio · Video</div><h3>Clip anything</h3><p>Highlight text or mark a ≤90s media window at 240p quality.</p></div>
        <div class="feature"><div class="badge">Public pages</div><h3>Shareable landings</h3><p>Every annotation gets a public URL with the source always linked.</p></div>
        <div class="feature"><div class="badge">Claims</div><h3>File a claim</h3><p>Rights holders can flag a public page for review in one click.</p></div>
        <div class="feature"><div class="badge">Auth</div><h3>X / Google only</h3><p>Sign-in is limited to X and Google for the product surface.</p></div>
      </div>
      <h2>From the feed</h2>
      <p class="muted">Live sample annotations with real playable clips.</p>
      <div class="cards">${feed.map(cardHTML).join("")}</div>
    </section>
  `);
}

function renderFeed() {
  const items = allAnnotations();
  return shellPage(`
    <section class="container section">
      <h2>Social feed</h2>
      <p class="muted">Public annotations from the open web — clips, notes, and source links.</p>
      <div class="cards">${items.map(cardHTML).join("")}</div>
    </section>
  `);
}

function renderDemo() {
  return shellPage(`
    <section class="container section">
      <h2>Demo walkthrough</h2>
      <p class="muted">Submission video: sidebar clipper → range select → publish → public landing page → File a claim.</p>
      <div class="panel" style="margin-top:1rem;padding:0.75rem">
        <video controls playsinline preload="metadata" style="width:100%;border-radius:12px;background:#000"
          src="./demo/annotated-submission.mp4"
          poster="">
          <source src="./demo/annotated-submission.mp4" type="video/mp4" />
          <source src="./demo/annotated-submission.webm" type="video/webm" />
        </video>
      </div>
      <div class="row" style="margin-top:1rem">
        <a class="btn btn-secondary" href="./demo/annotated-submission.mp4" download>Download MP4</a>
        <a class="btn btn-ghost" href="#/clip">Open sidebar demo</a>
      </div>
      <p class="subtle" style="margin-top:0.8rem">Direct video URL (stable on GitHub Pages): <code id="mp4-url"></code></p>
    </section>
  `);
}

function renderAnnotation(slug) {
  const a = bySlug(slug);
  if (!a) {
    return shellPage(`<section class="container section"><h2>Not found</h2><p class="muted">No annotation for <code>${esc(slug)}</code>.</p><a class="btn btn-secondary" href="#/feed">Back to feed</a></section>`);
  }
  const media =
    a.mediaType === "video" && a.clipVideoUrl
      ? `<div class="player">
          <span class="player-badge">240p · ${fmt(a.clipStartSec)}–${fmt(a.clipEndSec)} · max 90s</span>
          <video id="ann-video" controls autoplay preload="metadata" src="${esc(a.clipVideoUrl)}"></video>
        </div>`
      : `<blockquote class="quote mark-highlight" style="font-size:1.05rem">${esc(a.excerpt || a.body)}</blockquote>`;
  return shellPage(`
    <section class="container section">
      <div class="meta" style="margin-bottom:0.6rem">
        <span class="chip ${a.mediaType}">${esc(a.mediaType)}</span>
        <span class="subtle">@${esc(a.handle)}</span>
        <span class="subtle">· public landing page</span>
      </div>
      <h2 style="margin-bottom:0.4rem">${esc(a.title)}</h2>
      <p class="muted">${esc(a.body)}</p>
      <div style="margin:1rem 0">${media}</div>
      ${a.excerpt && a.mediaType === "video" ? `<blockquote class="quote mark-highlight">${esc(a.excerpt)}</blockquote>` : ""}
      <div class="row" style="margin-top:1rem">
        <a class="btn btn-primary" href="${esc(a.sourceUrl)}" target="_blank" rel="noopener">Open source ↗</a>
        <button class="btn btn-secondary" type="button" id="open-claim">File a claim</button>
        <a class="btn btn-ghost" href="#/feed">Back to feed</a>
      </div>
      <p class="subtle" style="margin-top:0.8rem">Source: ${esc(a.sourceTitle)} · always linked from this page</p>
    </section>
  `);
}

function renderClip() {
  const options = SOURCES.map(
    (s) => `<option value="${s.id}">${esc(s.label)}</option>`,
  ).join("");
  return shellPage(`
    <section class="container section">
      <h2>Chrome sidebar simulator</h2>
      <p class="muted">Clip text or a ≤90s video window, annotate, and publish a public page.</p>
      <div class="layout-clip" style="margin-top:1rem">
        <div class="panel">
          <div class="browser-chrome">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <div class="urlbar" id="src-urlbar">Select a source…</div>
          </div>
          <div style="padding:1rem">
            <div class="player" id="main-player-wrap">
              <span class="player-badge">240p preview</span>
              <video id="main-video" controls preload="metadata"></video>
            </div>
            <div id="text-source" class="hidden">
              <blockquote class="quote mark-highlight" id="text-excerpt"></blockquote>
            </div>
          </div>
        </div>
        <aside class="sidebar">
          <div class="badge">Annotated sidebar</div>
          <div class="field">
            <label for="source-select">Page / media source</label>
            <select id="source-select">${options}</select>
          </div>
          <div class="range-row" id="range-fields">
            <div class="field">
              <label for="start-sec">Start (sec)</label>
              <input id="start-sec" type="number" min="0" value="5" />
            </div>
            <div class="field">
              <label for="end-sec">End (sec)</label>
              <input id="end-sec" type="number" min="1" value="35" />
            </div>
          </div>
          <p class="subtle" id="range-hint">Window must be ≤ 90 seconds.</p>
          <div class="field">
            <label for="note-title">Title</label>
            <input id="note-title" placeholder="Your annotation title" />
          </div>
          <div class="field">
            <label for="note-body">Your take</label>
            <textarea id="note-body" placeholder="Add commentary…"></textarea>
          </div>
          <div class="field">
            <label for="note-excerpt">Highlighted excerpt (optional)</label>
            <input id="note-excerpt" placeholder="Key line from the source" />
          </div>
          <button class="btn btn-primary" id="publish-btn" type="button">Publish public page</button>
          <div id="publish-result" class="hidden success-box"></div>
        </aside>
      </div>
    </section>
  `);
}

function path() {
  const h = location.hash.replace(/^#/, "") || "/";
  return h.startsWith("/") ? h : `/${h}`;
}

function setActiveNav() {
  const p = path().split("?")[0];
  document.querySelectorAll("#nav a[data-route]").forEach((a) => {
    const r = a.getAttribute("data-route");
    a.classList.toggle("active", r === p || (r !== "/" && p.startsWith(r)));
  });
}

let claimSlug = null;

function wireClaim(slug) {
  claimSlug = slug;
  const open = document.getElementById("open-claim");
  if (open) open.onclick = () => {
    document.getElementById("claim-dialog").classList.add("open");
    document.getElementById("claim-status").textContent = "";
  };
}

function wireClip() {
  const select = document.getElementById("source-select");
  const video = document.getElementById("main-video");
  const urlbar = document.getElementById("src-urlbar");
  const startEl = document.getElementById("start-sec");
  const endEl = document.getElementById("end-sec");
  const rangeFields = document.getElementById("range-fields");
  const rangeHint = document.getElementById("range-hint");
  const textWrap = document.getElementById("text-source");
  const playerWrap = document.getElementById("main-player-wrap");
  const textExcerpt = document.getElementById("text-excerpt");
  const titleEl = document.getElementById("note-title");
  const bodyEl = document.getElementById("note-body");
  const excerptEl = document.getElementById("note-excerpt");
  const publishBtn = document.getElementById("publish-btn");
  const result = document.getElementById("publish-result");

  function current() {
    return SOURCES.find((s) => s.id === select.value) || SOURCES[0];
  }

  function applySource() {
    const s = current();
    urlbar.textContent = s.sourceUrl;
    if (s.mediaType === "video") {
      textWrap.classList.add("hidden");
      playerWrap.classList.remove("hidden");
      rangeFields.classList.remove("hidden");
      video.src = s.clipVideoUrl;
      const start = Number(startEl.value) || 0;
      video.currentTime = start;
      rangeHint.textContent = "Window must be ≤ 90 seconds. Label shows 240p.";
    } else {
      playerWrap.classList.add("hidden");
      textWrap.classList.remove("hidden");
      rangeFields.classList.add("hidden");
      textExcerpt.textContent = s.excerpt || "";
      excerptEl.value = s.excerpt || "";
      rangeHint.textContent = "Text clip — excerpt is highlighted on the public page.";
    }
    if (!titleEl.value) titleEl.value = `Note on ${s.sourceTitle}`;
  }

  function clampRange() {
    let start = Math.max(0, Number(startEl.value) || 0);
    let end = Math.max(start + 1, Number(endEl.value) || start + 1);
    if (end - start > 90) {
      end = start + 90;
      endEl.value = String(end);
      rangeHint.textContent = "Clamped to 90 seconds max.";
    } else {
      rangeHint.textContent = `Window ${fmt(start)}–${fmt(end)} (${end - start}s) · 240p`;
    }
    if (video.src) {
      video.currentTime = start;
    }
  }

  select.onchange = applySource;
  startEl.onchange = clampRange;
  endEl.onchange = clampRange;
  startEl.oninput = clampRange;
  endEl.oninput = clampRange;

  video?.addEventListener("timeupdate", () => {
    const end = Number(endEl.value) || 0;
    if (end && video.currentTime >= end) {
      video.pause();
      video.currentTime = Number(startEl.value) || 0;
    }
  });

  publishBtn.onclick = () => {
    const s = current();
    let start = Math.max(0, Number(startEl.value) || 0);
    let end = Math.max(start + 1, Number(endEl.value) || start + 30);
    if (end - start > 90) end = start + 90;
    const title = titleEl.value.trim() || `Note on ${s.sourceTitle}`;
    const body = bodyEl.value.trim() || "Published from the Annotated sidebar demo.";
    const excerpt = excerptEl.value.trim() || (s.mediaType === "text" ? s.excerpt : "");
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;
    const item = {
      slug,
      title,
      mediaType: s.mediaType,
      body,
      excerpt,
      sourceUrl: s.sourceUrl,
      sourceTitle: s.sourceTitle,
      clipVideoUrl: s.clipVideoUrl,
      clipStartSec: s.mediaType === "video" ? start : 0,
      clipEndSec: s.mediaType === "video" ? end : 0,
      author: "you",
      handle: "you",
    };
    const extra = loadLocal();
    extra.unshift(item);
    saveLocal(extra);
    result.classList.remove("hidden");
    result.innerHTML = `Published! <a href="#/a/${esc(slug)}" style="color:inherit;text-decoration:underline">Open public page</a>`;
    location.hash = `#/a/${slug}`;
  };

  applySource();
  clampRange();
}

function wireAnnotationVideo(slug) {
  const a = bySlug(slug);
  const v = document.getElementById("ann-video");
  if (!a || !v) return;
  const start = a.clipStartSec || 0;
  const end = a.clipEndSec || start + 30;
  v.addEventListener("loadedmetadata", () => {
    v.currentTime = start;
    v.play().catch(() => {});
  });
  v.addEventListener("timeupdate", () => {
    if (v.currentTime >= end) {
      v.pause();
      v.currentTime = start;
    }
  });
}

function render() {
  const app = document.getElementById("app");
  const p = path();
  setActiveNav();
  let html = "";
  if (p === "/" || p === "") html = renderHome();
  else if (p === "/feed") html = renderFeed();
  else if (p === "/clip") html = renderClip();
  else if (p === "/demo") html = renderDemo();
  else if (p.startsWith("/a/")) html = renderAnnotation(decodeURIComponent(p.slice(3)));
  else html = renderHome();
  app.innerHTML = html;

  if (p === "/clip") wireClip();
  if (p.startsWith("/a/")) {
    const slug = decodeURIComponent(p.slice(3));
    wireClaim(slug);
    wireAnnotationVideo(slug);
  }
  if (p === "/demo") {
    const el = document.getElementById("mp4-url");
    if (el) el.textContent = new URL("./demo/annotated-submission.mp4", location.href).href;
  }
  window.scrollTo(0, 0);
}

document.getElementById("claim-cancel").onclick = () => {
  document.getElementById("claim-dialog").classList.remove("open");
};
document.getElementById("claim-dialog").addEventListener("click", (e) => {
  if (e.target.id === "claim-dialog") e.currentTarget.classList.remove("open");
});
document.getElementById("claim-submit").onclick = () => {
  const email = document.getElementById("claim-email").value.trim();
  const reason = document.getElementById("claim-reason").value.trim();
  if (!email || !reason) {
    document.getElementById("claim-status").textContent = "Email and reason required.";
    return;
  }
  const key = "annotated_claims";
  const claims = JSON.parse(localStorage.getItem(key) || "[]");
  claims.push({ slug: claimSlug, email, reason, at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(claims));
  document.getElementById("claim-status").textContent = "Claim filed (demo). Thank you.";
  setTimeout(() => document.getElementById("claim-dialog").classList.remove("open"), 900);
};

window.addEventListener("hashchange", render);
if (!location.hash) location.hash = "#/";
render();
