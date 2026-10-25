/* Operations console. Runs only inside the signed-in package of its account. */
(function () {
  'use strict';

  var TYPES = [
    ['all', 'All'], ['application', 'Applications'], ['contact', 'Contact'], ['boreas-screening', 'BOREAS-2 screening'],
    ['newsletter', 'Newsletter'], ['investor-alert', 'Investor alerts'], ['portal-login', 'Portal sign-ins'], ['portal-open', 'Documents opened'],
  ];
  var TYPE_NAME = {};
  TYPES.forEach(function (t) { TYPE_NAME[t[0]] = t[1]; });
  var SEEN = 'gm_seen';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function bytes(b64) {
    var bin = atob(b64), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  async function decryptEntry(doc, priv) {
    var f = doc.fields || {};
    var raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, bytes(f.k.stringValue));
    var key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(f.iv.stringValue) }, key, bytes(f.c.stringValue));
    return JSON.parse(new TextDecoder().decode(plain));
  }

  async function load(cfg, priv) {
    var url = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(cfg.projectId) +
      '/databases/(default)/documents:runQuery?key=' + encodeURIComponent(cfg.apiKey);
    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'submissions' }], orderBy: [{ field: { fieldPath: 't' }, direction: 'DESCENDING' }], limit: 1000 } }),
    });
    if (!res.ok) throw new Error('The log could not be read (' + res.status + ').');
    var rows = await res.json();
    var out = [];
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].document) continue;
      try {
        var e = await decryptEntry(rows[i].document, priv);
        e.id = rows[i].document.name.split('/').pop();
        out.push(e);
      } catch (err) {
        out.push({ id: rows[i].document.name.split('/').pop(), t: (rows[i].document.fields.t || {}).stringValue || '', form: 'unreadable', site: '', ref: '', fields: [{ label: 'Error', value: 'This entry could not be decrypted.' }] });
      }
    }
    return out;
  }

  function field(e, names) {
    for (var i = 0; i < e.fields.length; i++) {
      var l = e.fields[i].label.toLowerCase();
      for (var j = 0; j < names.length; j++) if (l.indexOf(names[j]) === 0) return e.fields[i].value;
    }
    return '';
  }
  function summary(e) {
    if (e.form === 'application') return [field(e, ['position']), field(e, ['name']), field(e, ['email'])].filter(Boolean).join(' · ');
    if (e.form === 'portal-login') return [field(e, ['username']), field(e, ['result'])].filter(Boolean).join(' · ');
    if (e.form === 'portal-open') return [field(e, ['username']), field(e, ['document'])].filter(Boolean).join(' · ');
    if (e.form === 'boreas-screening') return field(e, ['outcome']);
    var parts = e.fields.slice(0, 3).map(function (f) { return f.value; }).filter(Boolean);
    return parts.join(' · ');
  }
  function when(e) {
    var d = new Date(e.t);
    return isNaN(d) ? e.t : d.toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' });
  }

  function csv(entries) {
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var lines = [['time', 'site', 'type', 'reference', 'page', 'language', 'details'].map(q).join(',')];
    entries.forEach(function (e) {
      var d = e.fields.map(function (f) { return f.label + ': ' + f.value; }).join(' | ');
      lines.push([e.t, e.site, e.form, e.ref, e.page, e.lang, d].map(q).join(','));
    });
    return lines.join('\r\n');
  }

  window.renderConsole = function (root, bundle, signOut) {
    var cfg = bundle.admin || {};
    var state = { all: [], type: 'all', q: '', prevSeen: '', timer: null };
    try { state.prevSeen = window.localStorage.getItem(SEEN) || ''; } catch (e) { /* ignore */ }

    root.innerHTML =
      '<div class="portal-head"><div><p class="eyebrow">NeuroStat Org.</p><h1>' + esc(bundle.name) + '</h1><p class="muted">' + esc(bundle.role) + '</p></div>' +
      '<button class="btn ghost" id="gm-out" type="button">Sign out</button></div>' +
      '<p class="form-note">' + esc(bundle.welcome || '') + '</p>' +
      '<div class="gm-bar"><div class="gm-tabs" id="gm-tabs" role="tablist"></div>' +
      '<input id="gm-q" type="search" placeholder="Search" aria-label="Search the log" />' +
      '<button class="btn ghost" id="gm-refresh" type="button">Refresh</button>' +
      '<button class="btn ghost" id="gm-csv" type="button">Download CSV</button>' +
      '<label class="gm-auto"><input id="gm-auto" type="checkbox" checked /> Update every 30 s</label></div>' +
      '<p class="muted small" id="gm-status">Loading…</p>' +
      '<div class="table-wrap"><table class="gm-table"><thead><tr><th>When</th><th>Site</th><th>Type</th><th>Ref.</th><th>Details</th></tr></thead><tbody id="gm-rows"></tbody></table></div>';

    document.getElementById('gm-out').addEventListener('click', function () {
      if (state.timer) clearInterval(state.timer);
      signOut();
    });

    var priv = null;

    function visible() {
      var q = state.q.toLowerCase();
      return state.all.filter(function (e) {
        if (state.type !== 'all' && e.form !== state.type) return false;
        if (!q) return true;
        return (e.form + ' ' + e.site + ' ' + e.ref + ' ' + e.fields.map(function (f) { return f.label + ' ' + f.value; }).join(' ')).toLowerCase().indexOf(q) >= 0;
      });
    }

    function draw() {
      var counts = { all: state.all.length };
      state.all.forEach(function (e) { counts[e.form] = (counts[e.form] || 0) + 1; });
      document.getElementById('gm-tabs').innerHTML = TYPES.map(function (t) {
        return '<button type="button" role="tab" data-type="' + t[0] + '" aria-pressed="' + (state.type === t[0]) + '">' + esc(t[1]) + ' <span class="gm-n">' + (counts[t[0]] || 0) + '</span></button>';
      }).join('');
      var rows = visible();
      document.getElementById('gm-rows').innerHTML = rows.length ? rows.map(function (e) {
        var fresh = state.prevSeen && e.t > state.prevSeen ? ' class="gm-new"' : '';
        var det = e.fields.map(function (f) { return '<dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd>'; }).join('') +
          '<dt>Page</dt><dd>' + esc(e.page || '') + ' (' + esc(e.lang || '') + ')</dd><dt>Browser</dt><dd>' + esc(e.ua || '') + '</dd>';
        return '<tr' + fresh + ' data-id="' + esc(e.id) + '"><td>' + esc(when(e)) + '</td><td>' + esc(e.site) + '</td><td>' + esc(TYPE_NAME[e.form] || e.form) +
          '</td><td class="doc-no">' + esc(e.ref) + '</td><td>' + esc(summary(e)) + '</td></tr>' +
          '<tr class="gm-detail" hidden><td colspan="5"><dl>' + det + '</dl></td></tr>';
      }).join('') : '<tr><td colspan="5" class="muted">Nothing here yet.</td></tr>';
    }

    async function refresh() {
      var status = document.getElementById('gm-status');
      if (!cfg.projectId || !cfg.apiKey) { status.textContent = 'The activity log is not connected yet.'; return; }
      try {
        if (!priv) priv = await crypto.subtle.importKey('jwk', cfg.privateJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
        state.all = await load(cfg, priv);
        draw();
        var newest = state.all.length ? state.all[0].t : '';
        var fresh = state.prevSeen ? state.all.filter(function (e) { return e.t > state.prevSeen; }).length : 0;
        status.textContent = state.all.length + ' entries · ' + fresh + ' new since your last visit · updated ' + new Date().toLocaleTimeString();
        if (newest) { try { window.localStorage.setItem(SEEN, newest); } catch (e) { /* ignore */ } }
      } catch (err) {
        status.textContent = (err && err.message) || 'The log could not be read.';
      }
    }

    root.addEventListener('click', function (ev) {
      var tab = ev.target.closest('[data-type]');
      if (tab) { state.type = tab.getAttribute('data-type'); draw(); return; }
      var row = ev.target.closest('tr[data-id]');
      if (row && row.nextElementSibling) row.nextElementSibling.hidden = !row.nextElementSibling.hidden;
    });
    document.getElementById('gm-q').addEventListener('input', function (ev) { state.q = ev.target.value; draw(); });
    document.getElementById('gm-refresh').addEventListener('click', refresh);
    document.getElementById('gm-csv').addEventListener('click', function () {
      var blob = new Blob([csv(visible())], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'activity-log.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    document.getElementById('gm-auto').addEventListener('change', function (ev) {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      if (ev.target.checked) state.timer = setInterval(refresh, 30000);
    });
    state.timer = setInterval(refresh, 30000);
    refresh();
  };
})();
