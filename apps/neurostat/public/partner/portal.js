/* NeuroStat Org. partner portal: login and document viewer.
   Everything happens in the browser. A sign-in opens the account's keyring (a small encrypted record kept
   with the site settings) with a key derived from the username and password. The keyring lists the
   documents the account may open and the key for each one; the documents themselves are fetched as
   encrypted files and opened only when selected. Accounts that are not in the settings fall back to the
   older encrypted package. */
(function () {
  'use strict';

  var ROUNDS = 600000;
  var MAX_TRIES = 5;
  var LOCK_MS = 15 * 60 * 1000;
  var STORE = 'nsp_attempts';
  var TOP = 999999;

  var loginView = document.getElementById('login-view');
  var portalView = document.getElementById('portal-view');
  var form = document.getElementById('login-form');
  var errBox = document.getElementById('login-error');
  var btn = document.getElementById('login-btn');
  if (!form) return;

  var enc = new TextEncoder();
  var urls = [];
  var current = null; // the signed-in account: { b, user, pass, hash, ver, dynamic, sig }

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
  // Sign-in attempts are recorded in the audit log. Passwords are never sent.
  function logEvent(kind, fields) {
    if (window.siteLog) window.siteLog.send(kind, '', fields);
  }
  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
  }
  function unb64(s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function b64ToBlob(b64, mime) {
    return new Blob([unb64(b64)], { type: mime });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  async function nameHash(user) {
    return hex(await crypto.subtle.digest('SHA-256', enc.encode('ns-partner:' + user))).slice(0, 32);
  }
  async function deriveKey(user, pass, salt) {
    var base = await crypto.subtle.importKey('raw', enc.encode(user + '\n' + pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ROUNDS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  }

  function lockedMessage(until) {
    var mins = Math.max(1, Math.ceil((until - Date.now()) / 60000));
    return 'Your account has been locked after too many failed attempts. Try again in ' + mins + ' minute' + (mins === 1 ? '' : 's') + '.';
  }

  // ---- opening an account ---------------------------------------------------------------------

  // The older way: one encrypted package per account, as a static file.
  async function tryOpen(user, pass, hash) {
    var res = await fetch('/partner/d/' + hash + '.bin', { cache: 'no-store' });
    if (!res.ok) return null;
    var data = new Uint8Array(await res.arrayBuffer());
    if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'NSP1') return null;
    var key = await deriveKey(user, pass, data.slice(4, 20));
    try {
      var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: data.slice(20, 32) }, key, data.slice(32));
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (e) {
      return null;
    }
  }

  // The keyring of an account: its record in the settings store, named after the account and a version.
  async function openKeyring(user, pass, hash, ver) {
    var cfg = window.SITE_LOG || {};
    if (!cfg.projectId || !cfg.apiKey) return null;
    var id = 'acc-' + hash + '-' + ('000000' + (TOP - ver)).slice(-6);
    var res = await fetch('https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(cfg.projectId) + '/databases/(default)/documents/submissions/' + id +
      '?key=' + encodeURIComponent(cfg.apiKey), { cache: 'no-store' });
    if (!res.ok) return null;
    var f = (await res.json()).fields || {};
    if (!f.k || !f.iv || !f.c) return null;
    try {
      var key = await deriveKey(user, pass, unb64(f.k.stringValue));
      var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(f.iv.stringValue) }, key, unb64(f.c.stringValue));
      var ring = JSON.parse(new TextDecoder().decode(plain));
      return {
        name: ring.name, role: ring.role, welcome: ring.welcome, folders: ring.folders || [],
        docs: (ring.docs || []).map(function (d) {
          return { id: d.id, folder: d.folder || '', title: d.title, number: d.number, date: d.date, classification: d.classification, description: d.description || '', lib: d.lib, key: d.key };
        }),
      };
    } catch (e) { return null; }
  }

  // A document of a keyring is an encrypted file of its own: fetched and opened only when selected.
  async function loadDoc(d) {
    if (d.file !== undefined || !d.lib) return;
    var res = await fetch('/partner/lib/' + d.lib + '.enc', { cache: 'no-store' });
    if (!res.ok) throw new Error('The document could not be loaded.');
    var data = new Uint8Array(await res.arrayBuffer());
    if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'NSD1') throw new Error('The document could not be loaded.');
    var key = await crypto.subtle.importKey('raw', unb64(d.key), 'AES-GCM', false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: data.slice(4, 16) }, key, data.slice(16));
    var o = JSON.parse(new TextDecoder().decode(plain));
    d.file = o.b64 ? { filename: o.filename, mime: o.mime, b64: o.b64 } : null;
    d.stamp = o.stamp || '';
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
    var settingsP = window.siteControl ? window.siteControl.refresh() : Promise.resolve({});
    var hash = await nameHash(user);
    var settings = await Promise.race([settingsP, wait(2500).then(function () { return window.siteControl ? window.siteControl.state() : {}; })]);
    var bundle = null, ver = 0, dynamic = false;
    try {
      if (settings && settings.dir && Object.prototype.hasOwnProperty.call(settings.dir, hash)) {
        ver = settings.dir[hash];
        dynamic = true;
        // a version of 0 means the account has been removed
        bundle = ver ? await openKeyring(user, pass, hash, ver) : null;
      } else {
        bundle = await tryOpen(user, pass, hash);
      }
    } catch (e) { bundle = null; }
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
    var acct = !bundle.app ? accountSettings(settings, user, hash) : null;
    if (acct && acct.blocked) {
      logEvent('portal-login', [{ label: 'Username', value: user }, { label: 'Result', value: 'Account suspended' }]);
      form.reset();
      showError(acct.message || 'This account has been suspended. Contact the IT Service Desk.');
      return;
    }
    if (!bundle.app) logEvent('portal-login', [{ label: 'Username', value: user }, { label: 'Result', value: 'Signed in' }, { label: 'Account', value: bundle.name }]);
    form.reset();
    render(bundle, { user: user, pass: pass, hash: hash, ver: ver, dynamic: dynamic });
  });

  // ---- what is on screen ----------------------------------------------------------------------

  // Per-account settings are kept under the account hash (older notices used the plain username).
  function accountSettings(st, user, hash) {
    var accounts = (st && st.accounts) || {};
    return accounts[hash] || accounts[user] || {};
  }
  function currentSettings() {
    return current ? accountSettings(window.siteControl ? window.siteControl.state() : {}, current.user, current.hash) : {};
  }
  function shownDocs(b) {
    if (b.app) return b.docs;
    var day = window.siteControl && window.siteControl.todayISO ? window.siteControl.todayISO() : null;
    return b.docs.filter(function (d) { return !day || d.date <= day; });
  }
  function signature() {
    var st = window.siteControl ? window.siteControl.state() : {};
    return JSON.stringify([currentSettings().note || '', st.today || '', current ? current.ver : 0]);
  }

  function render(b, who) {
    watch();
    current = { b: b, user: who.user, pass: who.pass, hash: who.hash, ver: who.ver, dynamic: who.dynamic, sig: '' };
    current.sig = signature();
    var docs = shownDocs(b);
    loginView.hidden = true;
    portalView.hidden = false;
    if (b.app) {
      try { new Function(b.app)(); } catch (e) { /* ignore */ }
      if (window.renderConsole) { window.renderConsole(portalView, b, signOut); return; }
    }
    var folders = {};
    docs.forEach(function (d) { (folders[d.folder] = folders[d.folder] || []).push(d); });
    var names = [''];
    (b.folders || []).forEach(function (f) { if (names.indexOf(f.name) < 0) names.push(f.name); });
    Object.keys(folders).forEach(function (n) { if (names.indexOf(n) < 0) names.push(n); });

    var html = '<div class="portal-head"><div><p class="eyebrow">NeuroStat Org.</p><h1>' + esc(b.name) + '</h1><p class="muted">' + esc(b.role) + '</p></div>' +
      '<button class="btn ghost" id="signout" type="button">Sign out</button></div>';
    if (b.welcome) html += '<p class="form-note">' + esc(b.welcome) + '</p>';
    var note = currentSettings().note;
    if (note) html += '<p class="form-note"><b>Notice:</b> ' + esc(note) + '</p>';
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
    if (!docs.length) html += '<p class="muted">There are no documents available to this account right now.</p>';
    html += '</div><div class="portal-viewer" id="viewer"><p class="muted">Select a document.</p></div></div>';
    portalView.innerHTML = html;

    document.getElementById('signout').addEventListener('click', signOut);
    portalView.querySelectorAll('.doc-row').forEach(function (row) {
      row.addEventListener('click', function () {
        portalView.querySelectorAll('.doc-row').forEach(function (r) { r.removeAttribute('aria-current'); });
        row.setAttribute('aria-current', 'true');
        var d = docs.filter(function (x) { return x.id === row.getAttribute('data-id'); })[0];
        open(d, who.user);
      });
    });
  }

  async function open(d, user) {
    urls.forEach(function (u) { URL.revokeObjectURL(u); });
    urls = [];
    logEvent('portal-open', [{ label: 'Username', value: user }, { label: 'Document', value: d.number + ' ' + d.title }]);
    var v = document.getElementById('viewer');
    if (d.lib && d.file === undefined) {
      v.innerHTML = '<p class="muted">Loading…</p>';
      try { await loadDoc(d); } catch (e) { v.innerHTML = '<p class="muted">The document could not be loaded. Try again in a moment.</p>'; return; }
    }
    var wm = 'CONFIDENTIAL — ' + user;
    var html = '<div class="doc-meta"><div><h2>' + esc(d.title) + '</h2><p class="doc-no">' + esc(d.number) + ' · ' + esc(d.date) + '</p>' +
      '<p class="small"><b>Classification:</b> ' + esc(d.classification) + '</p>' + (d.description ? '<p>' + esc(d.description) + '</p>' : '') + '</div>' +
      '<div class="doc-stamp" aria-hidden="true">' + (d.stamp || '') + '</div></div>';
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
    current = null;
    urls.forEach(function (u) { URL.revokeObjectURL(u); });
    urls = [];
    portalView.innerHTML = '';
    portalView.hidden = true;
    loginView.hidden = false;
    errBox.hidden = true;
  }

  // Changes made while somebody is signed in: an immediate suspension, a reload, a removed or changed
  // account, a different set of documents, a notice, or a new shared date.
  var watching = false;
  function watch() {
    if (watching || !window.siteControl) return;
    watching = true;
    window.siteControl.onChange(async function (st) {
      if (!current || current.b.app) return;
      var acct = accountSettings(st, current.user, current.hash);
      var since = window.siteControl.loadSeq() || 0;
      if (acct.blocked && (acct.mode === 'now' || acct.mode === 'reload') && (acct.at || 0) > since) {
        if (acct.mode === 'reload') { window.location.reload(); return; }
        var msg = acct.message || 'This account has been suspended. Contact the IT Service Desk.';
        signOut();
        showError(msg);
        return;
      }
      if (current.dynamic) {
        var ver = st.dir && Object.prototype.hasOwnProperty.call(st.dir, current.hash) ? st.dir[current.hash] : current.ver;
        if (!ver) { signOut(); showError('This account is no longer available.'); return; }
        if (ver !== current.ver) {
          var who = current;
          var fresh = null;
          try { fresh = await openKeyring(who.user, who.pass, who.hash, ver); } catch (e) { fresh = null; }
          if (!current || current !== who) return;
          if (!fresh) { signOut(); showError('Your sign-in details have changed. Please sign in again.'); return; }
          render(fresh, { user: who.user, pass: who.pass, hash: who.hash, ver: ver, dynamic: true });
          return;
        }
      }
      if (signature() !== current.sig) render(current.b, current);
    });
  }
})();
