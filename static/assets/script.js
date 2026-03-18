/**
 * LENK.CF — Frontend Logic
 * Vanilla JS, zero dependencies.
 */
(function () {
  'use strict';

  /* ── Intro Animation ───────────────────────────────────────────────── */
  function runIntroAnimation() {
    const overlay  = document.getElementById('intro-overlay');
    const longEl   = document.getElementById('intro-long');
    const arrowEl  = document.getElementById('intro-arrow');
    const shortEl  = document.getElementById('intro-short');
    const labelEl  = document.getElementById('intro-label');
    const fill     = document.getElementById('intro-progress');
    const app      = document.getElementById('app');

    if (!overlay) return;

    // Skip animation for reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      overlay.remove();
      app.removeAttribute('aria-hidden');
      app.classList.add('is-visible');
      return;
    }

    // Kick off progress fill
    requestAnimationFrame(() => {
      fill.classList.add('is-running');
    });

    // Step 1 — long URL expands in
    setTimeout(() => longEl.classList.add('is-visible'),  80);

    // Step 2 — arrow appears
    setTimeout(() => arrowEl.classList.add('is-visible'), 520);

    // Step 3 — long URL compresses away
    setTimeout(() => {
      longEl.classList.remove('is-visible');
      longEl.classList.add('is-compressing');
    }, 720);

    // Step 4 — short URL appears
    setTimeout(() => {
      shortEl.classList.add('is-visible');
      labelEl.classList.add('is-visible');
    }, 900);

    // Step 5 — fade out overlay, reveal app
    setTimeout(() => {
      overlay.classList.add('is-hidden');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      app.removeAttribute('aria-hidden');
      app.classList.add('is-visible');
    }, 1650);
  }

  document.addEventListener('DOMContentLoaded', runIntroAnimation);

  /* ── Element refs ─────────────────────────────────────────────────── */
  const el = {
    form:          document.getElementById('shortener-form'),
    urlInput:      document.getElementById('url'),
    aliasInput:    document.getElementById('alias'),
    submitBtn:     document.getElementById('submit'),
    resultSection: document.getElementById('result-section'),
    resultId:      document.getElementById('res-id'),
    resultUrl:     document.getElementById('result-url'),
    copyBtn:       document.getElementById('copy-btn'),
    loader:        document.getElementById('loader'),
    domainsTrigger:document.getElementById('domains-trigger'),
    domainsPanel:  document.getElementById('domains-panel'),
    closeDomains:  document.getElementById('close-domains'),
    toastContainer:document.getElementById('toast-container'),
    hostnameLabel: document.getElementById('hostname-label'),
  };

  /* ── Hostname label ───────────────────────────────────────────────── */
  if (el.hostnameLabel) {
    el.hostnameLabel.textContent = window.location.hostname;
  }

  /* ── Loader ───────────────────────────────────────────────────────── */
  function setLoader(on) {
    el.loader.hidden = !on;
    el.loader.setAttribute('aria-hidden', String(!on));    el.submitBtn.classList.toggle('is-loading', on);  }

  /* ── Toast ────────────────────────────────────────────────────────── */
  function toast(message, type = 'success', duration = 3200) {
    const t = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.setAttribute('role', 'status');
    t.textContent = message;
    el.toastContainer.appendChild(t);

    setTimeout(() => {
      t.classList.add('is-exiting');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, duration);
  }

  /* ── URL validation ───────────────────────────────────────────────── */
  function ensureProtocol(url) {
    if (!/^https?:\/\//i.test(url)) return 'https://' + url;
    return url;
  }

  function isValidUrl(url) {
    try { new URL(url); return true; }
    catch (_) { return false; }
  }

  function isValidAlias(alias) {
    return /^[a-zA-Z0-9\-_]+$/.test(alias);
  }

  /* ── Shorten flow ─────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();

    let url   = el.urlInput.value.trim();
    const alias = el.aliasInput.value.trim();

    // Auto-prefix protocol
    url = ensureProtocol(url);
    el.urlInput.value = url;

    if (!isValidUrl(url)) {
      toast('That doesn\'t look like a valid URL.', 'error');
      el.urlInput.focus();
      return;
    }

    if (alias && !isValidAlias(alias)) {
      toast('Alias: letters, numbers, hyphens & underscores only.', 'error');
      el.aliasInput.focus();
      return;
    }

    setLoader(true);
    el.submitBtn.disabled = true;

    try {
      let shortId;

      if (alias) {
        /* Custom alias ─────────────────────────────── */
        const endpoint = `${origin}/custom`;
        const res  = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, shortId: alias }),
        });
        const data = await res.json();

        if (data === 0) {
          toast(`"${alias}" is already taken.`, 'error');
          setLoader(false);
          el.submitBtn.disabled = false;
          return;
        }
        shortId = data;
      } else {
        /* Random alias ─────────────────────────────── */
        const endpoint = `${origin}/p/${encodeURIComponent(url)}`;
        const res  = await fetch(endpoint);
        shortId = await res.json();
      }

      if (typeof shortId !== 'string') {
        throw new Error('Unexpected response from server.');
      }

      /* ── Show result ───────────────────────────────── */
      const shortUrl = `${origin}/${shortId}`;
      el.resultId.textContent  = shortId;
      el.resultUrl.value       = shortUrl;
      el.resultSection.hidden  = false;

      toast('Link ready!', 'success');
      copyToClipboard(shortUrl, /* silent */ true);

    } catch (err) {
      console.error('[lenk] submit error:', err);
      toast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoader(false);
      el.submitBtn.disabled = false;
    }
  }

  /* ── Copy ─────────────────────────────────────────────────────────── */
  async function copyToClipboard(text, silent = false) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        el.resultUrl.select();
        document.execCommand('copy');
      }
      if (!silent) toast('Copied!', 'success', 1800);
      el.copyBtn.classList.add('copy-btn--success');
      setTimeout(() => el.copyBtn.classList.remove('copy-btn--success'), 1800);
    } catch (_) {
      if (!silent) toast('Couldn\'t copy automatically — select and copy manually.', 'error');
    }
  }

  /* ── Domains panel ────────────────────────────────────────────────── */
  function openPanel() {
    el.domainsPanel.hidden = false;
    el.closeDomains.focus();
  }

  function closePanel() {
    el.domainsPanel.hidden = true;
    el.domainsTrigger.focus();
  }

  /* ── Event listeners ──────────────────────────────────────────────── */
  el.form.addEventListener('submit', handleSubmit);

  el.copyBtn.addEventListener('click', () => copyToClipboard(el.resultUrl.value));

  el.domainsTrigger.addEventListener('click', openPanel);
  el.closeDomains.addEventListener('click', closePanel);

  // Close panel on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !el.domainsPanel.hidden) closePanel();
  });

  /* ── Service Worker ───────────────────────────────────────────────── */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker').catch(() => {});
  }

})();
