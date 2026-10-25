/* NeuroStat Org. partner portal: login and document viewer.
   Everything happens in the browser. The documents are fetched as an encrypted package and opened
   with a key derived from the username and password. */
(function () {
  'use strict';

  var ROUNDS = 600000;
  var MAX_TRIES = 5;
  var LOCK_MS = 15 * 60 * 1000;
  var STORE = 'nsp_attempts';

  var loginView = document.getElementById('login-view');
  var portalView = document.getElementById('portal-view');
  var form = document.getElementById('login-form');
  var errBox = document.getElementById('login-error');
  var btn = document.getElementById('login-btn');
  if (!form) return;

  var urls = [];

  function state() {
    try { return JSON.parse(window.localStorage.getItem(STORE)) || { n: 0, until: 0 }; } catch (e) { return { n: 0, until: 0 }; }
  }
  function save(s) {
    try { window.localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  function showError(msg) {
    errBox.textContent = msg;
    errBox.hidden = false;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  // Saved to the game master's sheet when a log address is set. Passwords are never sent.
  function logEvent(kind, fields) {
    if (window.siteLog) window.siteLog.send(kind, '', fields);
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function b64ToBlob(b64, mime) {
    var bin = atob(b64), len = bin.length, bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function lockedMessage(until) {
    var mins = Math.max(1, Math.ceil((until - Date.now()) / 60000));
    return 'Your account has been locked after too many failed attempts. Try again in ' + mins + ' minute' + (mins === 1 ? '' : 's') + '.';
  }

  async function tryOpen(user, pass) {
    var enc = new TextEncoder();
    var nameHash = hex(await crypto.subtle.digest('SHA-256', enc.encode('ns-partner:' + user))).slice(0, 32);
    var res = await fetch('/partner/d/' + nameHash + '.bin', { cache: 'no-store' });
    if (!res.ok) return null;
    var data = new Uint8Array(await res.arrayBuffer());
    if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'NSP1') return null;
    var salt = data.slice(4, 20), iv = data.slice(20, 32), body = data.slice(32);
    var base = await crypto.subtle.importKey('raw', enc.encode(user + '\n' + pass), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ROUNDS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    try {
      var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, body);
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (e) {
      return null;
    }
  }

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    errBox.hidden = true;
    var s = state();
    var user = form.elements.username.value.trim().toLowerCase();
    var pass = form.elements.password.value;
    if (s.until && s.until > Date.now()) {
      logEvent('portal-login', [{ label: 'Username', value: user }, { label: 'Result', value: 'Blocked (locked out)' }]);
      showError(lockedMessage(s.until));
      return;
    }
    if (s.until && s.until <= Date.now()) { s = { n: 0, until: 0 }; save(s); }
    if (!user || !pass) { showError('The username or password is incorrect.'); return; }

    btn.disabled = true;
    btn.textContent = 'Signing in…';
    var started = Date.now();
    var bundle = null;
    try { bundle = await tryOpen(user, pass); } catch (e) { bundle = null; }
    var left = 1000 - (Date.now() - started);
    if (left > 0) await wait(left);
    btn.disabled = false;
    btn.textContent = 'Sign in';

    if (!bundle) {
      s.n = (s.n || 0) + 1;
      logEvent('portal-login', [{ label: 'Username', value: user }, { label: 'Result', value: 'Wrong username or password' }, { label: 'Failed attempts in a row', value: String(s.n) }]);
      if (s.n >= MAX_TRIES) {
        s.until = Date.now() + LOCK_MS;
        s.n = 0;
        save(s);
        showError(lockedMessage(s.until));
      } else {
        save(s);
        showError('The username or password is incorrect.');
      }
      return;
    }
    save({ n: 0, until: 0 });
    logEvent('portal-login', [{ label: 'Username', value: user }, { label: 'Result', value: 'Signed in' }, { label: 'Account', value: bundle.name }]);
    form.reset();
    render(bundle, user);
  });

  function render(b, user) {
    loginView.hidden = true;
    portalView.hidden = false;
    var folders = {};
    b.docs.forEach(function (d) { (folders[d.folder] = folders[d.folder] || []).push(d); });
    var names = [''];
    (b.folders || []).forEach(function (f) { if (names.indexOf(f.name) < 0) names.push(f.name); });
    Object.keys(folders).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });

    var html = '<div class="portal-head"><div><p class="eyebrow">NeuroStat Org.</p><h1>' + esc(b.name) + '</h1><p class="muted">' + esc(b.role) + '</p></div>' +
      '<button class="btn ghost" id="signout" type="button">Sign out</button></div>';
    if (b.welcome) html += '<p class="form-note">' + esc(b.welcome) + '</p>';
    html += '<div class="portal-grid"><div class="portal-list">';
    names.forEach(function (n) {
      var list = folders[n] || [];
      var meta = (b.folders || []).filter(function (f) { return f.name === n; })[0];
      if (!n && !list.length) return;
      if (n) html += '<h2 class="portal-folder">' + esc(n) + '</h2>';
      if (meta && meta.note && !list.length) html += '<p class="muted small">' + esc(meta.note) + '</p>';
      if (!list.length && !(meta && meta.note)) html += '<p class="muted small">No documents in this folder.</p>';
      list.forEach(function (d) {
        html += '<button type="button" class="doc-row" data-id="' + esc(d.id) + '"><span class="doc-title">' + esc(d.title) + '</span>' +
          '<span class="doc-no">' + esc(d.number) + '</span><span class="muted small">' + esc(d.date) + ' · ' + esc(d.classification) + '</span></button>';
      });
    });
    html += '</div><div class="portal-viewer" id="viewer"><p class="muted">Select a document.</p></div></div>';
    portalView.innerHTML = html;

    document.getElementById('signout').addEventListener('click', signOut);
    portalView.querySelectorAll('.doc-row').forEach(function (row) {
      row.addEventListener('click', function () {
        portalView.querySelectorAll('.doc-row').forEach(function (r) { r.removeAttribute('aria-current'); });
        row.setAttribute('aria-current', 'true');
        var d = b.docs.filter(function (x) { return x.id === row.getAttribute('data-id'); })[0];
        open(d, user);
      });
    });
  }

  function open(d, user) {
    urls.forEach(function (u) { URL.revokeObjectURL(u); });
    urls = [];
    logEvent('portal-open', [{ label: 'Username', value: user }, { label: 'Document', value: d.number + ' ' + d.title }]);
    var v = document.getElementById('viewer');
    var wm = 'CONFIDENTIAL — ' + user;
    var html = '<div class="doc-meta"><div><h2>' + esc(d.title) + '</h2><p class="doc-no">' + esc(d.number) + ' · ' + esc(d.date) + '</p>' +
      '<p class="small"><b>Classification:</b> ' + esc(d.classification) + '</p>' + (d.description ? '<p>' + esc(d.description) + '</p>' : '') + '</div>' +
      '<div class="doc-stamp" aria-hidden="true">' + d.stamp + '</div></div>';
    if (d.file) {
      var url = URL.createObjectURL(b64ToBlob(d.file.b64, d.file.mime));
      urls.push(url);
      html += '<p><a class="btn ghost" href="' + url + '" download="' + esc(d.file.filename) + '">Download</a></p>';
      html += '<div class="frame">';
      html += d.file.mime === 'application/pdf'
        ? '<iframe title="' + esc(d.title) + '" src="' + url + '"></iframe>'
        : '<img alt="' + esc(d.title) + '" src="' + url + '" />';
      html += '<div class="watermark" aria-hidden="true">' + new Array(24).join('<span>' + esc(wm) + '</span>') + '</div></div>';
    } else {
      html += '<p class="muted">This entry has no attached file.</p>';
    }
    v.innerHTML = html;
    v.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function signOut() {
    urls.forEach(function (u) { URL.revokeObjectURL(u); });
    urls = [];
    portalView.innerHTML = '';
    portalView.hidden = true;
    loginView.hidden = false;
    errBox.hidden = true;
  }
})();
