(() => {
  'use strict';

  // Self-contained: each detail page declares its own representative image
  // via a `data-photo-file="NNN_FF_place_YYYY_MMDD.jpg"` attribute on a
  // wrapper element. No external manifest is required.
  //
  //   NNN  : 3-digit article number (001-999)
  //   FF   : 2-digit figure number within the page (01-99)
  //   place: letters only (rendered uppercased)
  //   YYYY : 4-digit year
  //   MMDD : 4-digit month+day
  const NAME_RE = /^(\d{3})_(\d{2})_([A-Za-z]+)_(\d{4})_(\d{2})(\d{2})\.jpg$/i;

  const MONTHS = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ];

  const DEFAULT_DIR = 'images/photograph/';

  const parse = (file) => {
    if (!file) return null;
    const m = NAME_RE.exec(file);
    if (!m) return null;
    const monthIdx = Math.max(0, Math.min(11, parseInt(m[5], 10) - 1));
    return {
      file,
      no:    m[1],
      fig:   m[2],
      place: m[3].toUpperCase(),
      year:  m[4],
      month: m[5],
      day:   m[6],
      monthName: MONTHS[monthIdx],
    };
  };

  const setText = (selector, value, root = document) => {
    root.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  };

  const applyMeta = (root, meta) => {
    setText('[data-photo-no]',        meta.no,    root);
    setText('[data-photo-fig]',       meta.fig,   root);
    setText('[data-photo-place]',     meta.place, root);
    setText('[data-photo-date]',      `${meta.year}.${meta.month}.${meta.day}`, root);
    setText('[data-photo-monthyear]', `${meta.monthName}, ${meta.year}`,        root);
  };

  const figuresProcessed = new WeakMap();

  document.querySelectorAll('[data-photo-file]').forEach((fig) => {
    const file = fig.dataset.photoFile;
    const meta = parse(file);
    if (!meta) return;

    const dir = fig.dataset.photoDir || DEFAULT_DIR;
    const src = dir + file;

    fig.dataset.photoResolvedSrc = src;
    figuresProcessed.set(fig, meta);

    const img = fig.querySelector('img');
    if (img) {
      if (!img.getAttribute('src')) img.setAttribute('src', src);
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', `N° ${meta.no} — ${meta.place} — ${meta.year}.${meta.month}.${meta.day}`);
      }
    }

    applyMeta(fig, meta);
  });

  // Allow a separate meta host elsewhere on the page to pull from the same figure.
  document.querySelectorAll('[data-photo-meta-from]').forEach((el) => {
    const targetSelector = el.dataset.photoMetaFrom;
    const fig = targetSelector
      ? document.querySelector(targetSelector)
      : document.querySelector('[data-photo-file]');
    if (!fig) return;
    const meta = figuresProcessed.get(fig) || parse(fig.dataset.photoFile);
    if (!meta) return;
    applyMeta(el, meta);
  });
})();
