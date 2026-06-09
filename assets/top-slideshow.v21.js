(() => {
  'use strict';

  const HOLD_MS = 6500;
  const FADE_MS = 4800;

  // Runtime-only: entries are discovered from photograph.html and each
  // photograph/NNN.html. No manifest file, no build step.
  //
  // Filename pattern: XXX_FF_place_YYYY_MMDD.jpg
  //   XXX  : 3-digit article number (001-999) — displayed as FIG. XXX
  //   FF   : 2-digit figure number within the page (only FF = 01 is shown here)
  //   place: letters only (rendered uppercased)
  //   YYYY : 4-digit year
  //   MMDD : 4-digit month+day (only MM is rendered as the caption date)
  const NAME_RE = /^(\d{3})_(\d{2})_([A-Za-z]+)_(\d{4})_(\d{2})(\d{2})\.jpg$/i;

  const container = document.getElementById('topPhoto');
  if (!container) return;

  const layers = Array.from(container.querySelectorAll('.top-photo-layer'));
  if (layers.length < 2) return;

  const figLabel   = document.getElementById('topPhotoFig');
  const placeLabel = document.getElementById('topPhotoPlace');
  const dateLabel  = document.getElementById('topPhotoDate');
  const linkEl     = document.getElementById('topPhotoLink');

  const dir = container.dataset.slideDir || 'images/photograph/';
  const listUrl = container.dataset.slideListUrl || 'photograph.html';
  const detailBase = container.dataset.slideDetailBase || 'photograph/';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parseName = (file) => {
    const m = NAME_RE.exec(file);
    if (!m) return null;
    return {
      file,
      src:   dir + file,
      fig:   m[1],
      ff:    m[2],
      place: m[3].toUpperCase(),
      year:  m[4],
      month: m[5],
    };
  };

  const fetchText = (url) => fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    return r.text();
  });

  const detailFile = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fig = doc && doc.querySelector('[data-photo-file]');
    return fig ? fig.getAttribute('data-photo-file') : '';
  };

  const collectEntries = async () => {
    let listHtml;
    try {
      listHtml = await fetchText(listUrl);
    } catch (e) {
      // Likely running from file:// in a strict browser. Bail out quietly.
      console.warn('[top-slideshow] cannot fetch', listUrl, e);
      return [];
    }
    const doc = new DOMParser().parseFromString(listHtml, 'text/html');
    const rows = doc.querySelectorAll('#idxList .idx-row[data-photo]');
    const nos = Array.from(rows)
      .map((r) => r.getAttribute('data-photo'))
      .filter(Boolean);

    const results = await Promise.all(nos.map((no) =>
      fetchText(`${detailBase}${no}.html`)
        .then(detailFile)
        .then(parseName)
        .catch(() => null)
    ));

    const entries = results.filter((e) => e && e.ff === '01');
    entries.sort((a, b) => a.fig.localeCompare(b.fig));
    return entries;
  };

  const setCaption = (entry) => {
    if (!entry) return;
    if (figLabel)   figLabel.textContent   = entry.fig;
    if (placeLabel) placeLabel.textContent = entry.place;
    if (dateLabel)  dateLabel.textContent  = `${entry.year}.${entry.month}`;
    if (linkEl) {
      linkEl.setAttribute('href', `${detailBase}${entry.fig}.html`);
      linkEl.setAttribute('aria-label', `記事 N° ${entry.fig}（${entry.place}）を開く`);
    }
  };

  const preload = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

  const start = async () => {
    const entries = await collectEntries();
    if (entries.length === 0) return;

    const startIndex = Math.floor(Math.random() * entries.length);
    const first = entries[startIndex];

    layers[0].src = first.src;
    layers[0].classList.add('is-active');
    layers[1].classList.remove('is-active');
    setCaption(first);

    if (entries.length === 1) return;

    const holdMs = reduceMotion ? HOLD_MS + FADE_MS : HOLD_MS;

    let index = startIndex;
    let activeLayer = 0;

    const tick = async () => {
      const nextIndex = (index + 1) % entries.length;
      const nextLayer = 1 - activeLayer;
      const nextEntry = entries[nextIndex];

      await preload(nextEntry.src);

      layers[nextLayer].src = nextEntry.src;

      requestAnimationFrame(() => {
        layers[nextLayer].classList.add('is-active');
        layers[activeLayer].classList.remove('is-active');
        setCaption(nextEntry);
      });

      const fadeDelay = reduceMotion ? 0 : FADE_MS;
      window.setTimeout(() => {
        index = nextIndex;
        activeLayer = nextLayer;
        window.setTimeout(tick, holdMs);
      }, fadeDelay);
    };

    window.setTimeout(tick, holdMs);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
