/* Painel do Mestre.
   A página abre preta, sem nada escrito. Ao digitar a palavra certa e a senha, o pacote criptografado ao lado
   desta página é aberto aqui, no navegador. Dentro dele estão as chaves e a lista de documentos.
   Cada mudança vira um aviso assinado que os sites leem a cada poucos segundos. Os logins do portal ficam
   num diretório criptografado, e cada login recebe um "chaveiro" próprio com os documentos que pode abrir. */
(function () {
  'use strict';

  var ROUNDS = 600000;
  var TOP = 999999;
  var KEY_STORE = 'painel_k';
  var SEEN_KEY = 'painel_seen';
  // Only used to skip pointless work: the typed word is checked here before the slow decryption starts.
  var PHRASE_HASH = '85d800049636a686c8a502c08760c93e482d02ae87639a7a7103f46e53ab41a2';
  var WORD_LEN = 8;
  var enc = new TextEncoder();

  var S = { cfg: null, ctl: { v: 1, seq: 0 }, maxId: 0, priv: null, signKey: null, verifyKey: null, dirKey: null,
    dir: { seq: 0, logins: [] }, lib: {}, entries: [], newest: '', prevSeen: '', tab: 'visao', type: 'all', q: '', open: {},
    pend: {}, docQ: '', docFilter: 'all', reveal: {}, menu: '', timers: [] };

  var TYPES = [['all', 'Todas'], ['application', 'Candidaturas'], ['contact', 'Contato'], ['boreas-screening', 'Triagem BOREAS-2'],
    ['newsletter', 'Newsletter'], ['investor-alert', 'Alertas de investidores'], ['portal-login', 'Entradas no portal'], ['portal-open', 'Documentos abertos']];
  var TONES = [['info', 'Faixa informativa'], ['alert', 'Faixa de alerta'], ['full', 'Mensagem em tela cheia']];
  var DEFAULT_BLOCK = 'This account has been suspended. Contact the IT Service Desk.';
  var ICONS = {
    visao: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    mensagens: '<path d="M3 13l2.5-7.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-5.5a2.5 2.5 0 0 1-5 0H3z"/>',
    logins: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    documentos: '<path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4M8.5 12h7M8.5 16h7"/>',
    avisos: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/>',
    vagas: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    data: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v3M16 3v3"/>',
  };
  var TABS = [['visao', 'Visão geral'], ['mensagens', 'Mensagens'], ['logins', 'Logins'], ['documentos', 'Documentos'], ['avisos', 'Avisos'], ['vagas', 'Vagas'], ['data', 'Data']];
  var W1 = ['Fjord', 'Cobalt', 'Lantern', 'Harbor', 'Granite', 'Meridian', 'Quartz', 'Falcon', 'Ember', 'Tundra', 'Marble', 'Copper', 'Willow', 'Anchor', 'Saffron', 'Juniper'];
  var W2 = ['Signal', 'Ledger', 'Compass', 'Beacon', 'Vessel', 'Ridge', 'Orbit', 'Cipher', 'Harvest', 'Summit', 'Relay', 'Atlas', 'Tether', 'Kiln', 'Prism', 'Vector'];

  function $(id) { return document.getElementById(id); }
  function h(tag, props) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v === false || v == null) return;
      if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, '');
      else node.setAttribute(k, v);
    });
    var add = function (kid) {
      if (kid == null || kid === false) return;
      if (Array.isArray(kid)) { kid.forEach(add); return; }
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    };
    for (var i = 2; i < arguments.length; i++) add(arguments[i]);
    return node;
  }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function b64(buf) { var bytes = new Uint8Array(buf), s = ''; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function unb64(s) { var bin = atob(s), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function inv(n) { return ('000000' + (TOP - n)).slice(-6); }
  function seqOf(id) { return TOP - parseInt(id.slice(id.lastIndexOf('-') + 1), 10); }
  function rnd(n) { return crypto.getRandomValues(new Uint32Array(1))[0] % n; }
  function longDate(iso) { return new Date(iso + 'T12:00:00Z').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
  function isoOf(d) { return d.toISOString().slice(0, 10); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return isoOf(d); }
  function sha(text) { return crypto.subtle.digest('SHA-256', enc.encode(text)).then(hex); }
  function hashOf(user) { return sha('ns-partner:' + user).then(function (x) { return x.slice(0, 32); }); }
  function initials(name) {
    var p = String(name || '?').replace(/^(dr|mr|ms)\.?\s+/i, '').trim().split(/\s+/);
    return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }
  function hue(seed) { return parseInt(String(seed).replace(/[^0-9a-f]/gi, '0').slice(0, 6) || '0', 16) % 360; }
  function avatar(L, small) { return h('span', { class: 'avatar' + (small ? ' sm' : ''), style: 'background:hsl(' + hue(L.hash || L.key) + ' 42% 40%)', 'aria-hidden': 'true', text: initials(L.name) }); }
  function genPassword() { return W1[rnd(W1.length)] + W2[rnd(W2.length)] + '-' + (1000 + rnd(9000)); }
  function newKey() { return 'l' + hex(crypto.getRandomValues(new Uint8Array(6))); }
  function copy(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(okMsg || 'Copiado.'); }, function () { toast('Não consegui copiar. Selecione e copie à mão.', true); });
    else toast('Este navegador não deixa copiar por botão. Selecione e copie à mão.', true);
  }

  function toast(msg, bad) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast' + (bad ? ' bad' : '');
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, bad ? 9000 : 4500);
  }

  // ---- sign in ---------------------------------------------------------------------------------

  async function openPackage(user, pass) {
    var name = (await sha('ns-partner:' + user)).slice(0, 32);
    var res = await fetch('p/' + name + '.bin', { cache: 'no-store' });
    if (!res.ok) return null;
    var data = new Uint8Array(await res.arrayBuffer());
    if (String.fromCharCode(data[0], data[1], data[2], data[3]) !== 'NSP1') return null;
    var base = await crypto.subtle.importKey('raw', enc.encode(user + '\n' + pass), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: data.slice(4, 20), iterations: ROUNDS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    try {
      var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: data.slice(20, 32) }, key, data.slice(32));
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (e) { return null; }
  }

  // ---- the black screen -----------------------------------------------------------------------

  var typed = '';
  var unlocking = false;
  var pendingWord = '';

  function show(id, on) { $(id).hidden = !on; }
  function lockScreen(on) {
    document.body.classList.toggle('locked', on);
    $('stage').hidden = !on;
    $('panel-view').hidden = on;
    document.title = on ? 'Nova guia' : 'Painel do Mestre';
    if (on) { show('busy', false); show('keyask', false); var k = $('keys'); k.value = ''; k.focus(); }
  }
  async function tryOpen(word, secret) {
    try { var b = await openPackage(word, secret); return b && b.admin ? b : null; } catch (e) { return null; }
  }
  function readSecret() {
    try { var hh = decodeURIComponent(location.hash.slice(1)); if (hh) return hh; } catch (e) { /* ignore */ }
    try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }
  async function finish(secret, bundle) {
    try { localStorage.setItem(KEY_STORE, secret); } catch (e) { /* ignore */ }
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    typed = '';
    await start(bundle);
  }
  // The word was right but the password is missing or wrong: ask for it on the same black screen.
  function askKey() {
    var k = $('keyask');
    k.value = ''; k.disabled = false; k.classList.remove('bad'); k.hidden = false; k.focus();
  }
  async function submitKey() {
    var k = $('keyask'), raw = k.value.trim();
    if (!raw || !pendingWord || unlocking) return;
    var secret = raw.indexOf('#') >= 0 ? raw.slice(raw.indexOf('#') + 1) : raw;
    try { secret = decodeURIComponent(secret); } catch (e) { /* keep as typed */ }
    unlocking = true; k.disabled = true; show('busy', true);
    var bundle = await tryOpen(pendingWord, secret);
    show('busy', false); k.disabled = false;
    if (bundle) {
      k.hidden = true;
      try { await finish(secret, bundle); } catch (e) { askKey(); } finally { unlocking = false; }
      return;
    }
    unlocking = false;
    k.classList.add('bad');
    setTimeout(function () { k.hidden = true; $('keys').focus(); }, 900);
  }
  async function check() {
    if (unlocking || typed.length < WORD_LEN) return;
    var word = typed.slice(-WORD_LEN).toLowerCase();
    if ((await sha('painel:' + word)) !== PHRASE_HASH) return;
    typed = ''; pendingWord = word; unlocking = true;
    var opened = false;
    try {
      var secret = readSecret();
      if (secret) {
        show('busy', true);
        var bundle = await tryOpen(word, secret);
        if (bundle) { opened = true; await finish(secret, bundle); return; }
        try { localStorage.removeItem(KEY_STORE); } catch (e) { /* ignore */ }
      }
    } catch (e) { if (window.console) console.error(e); /* fall through to the key prompt */ } finally { show('busy', false); unlocking = false; }
    if (!opened || document.body.classList.contains('locked')) askKey();
  }

  $('keys').addEventListener('input', function (ev) {
    typed = (typed + (ev.target.value || '')).slice(-32);
    ev.target.value = '';
    check();
  });
  $('keyask').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); submitKey(); } });
  $('keyask').addEventListener('input', function () { if ($('keyask').value.length > 40) setTimeout(submitKey, 250); });
  // Typing works even if the page was not clicked first: the first letter moves the focus to the hidden field.
  document.addEventListener('keydown', function (ev) {
    if ($('stage').hidden || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var id = ev.target && ev.target.id;
    if (id === 'keys' || id === 'keyask') return;
    if (ev.key && ev.key.length === 1) { var ask = $('keyask'); (ask.hidden ? $('keys') : ask).focus(); }
  });
  document.addEventListener('click', function () {
    if ($('stage').hidden) return;
    var ask = $('keyask');
    (ask.hidden ? $('keys') : ask).focus();
  });
  $('keys').focus();

  // ---- the service (Firestore REST) -----------------------------------------------------------

  function api(path) {
    return 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(S.cfg.projectId) + '/databases/(default)/documents' + path;
  }
  function docsRef(id) { return 'projects/' + S.cfg.projectId + '/databases/(default)/documents/submissions/' + id; }
  function keyQ() { return 'key=' + encodeURIComponent(S.cfg.apiKey); }
  async function runQuery(structuredQuery) {
    var res = await fetch(api(':runQuery') + '?' + keyQ(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ structuredQuery: structuredQuery }) });
    if (!res.ok) throw new Error('O banco respondeu ' + res.status + '.');
    return res.json();
  }
  function rangeQuery(prefix, limit) {
    var f = function (op, id) { return { fieldFilter: { field: { fieldPath: '__name__' }, op: op, value: { referenceValue: docsRef(id) } } }; };
    return runQuery({ from: [{ collectionId: 'submissions' }],
      where: { compositeFilter: { op: 'AND', filters: [f('GREATER_THAN_OR_EQUAL', prefix + '-'), f('LESS_THAN', prefix + '.')] } },
      orderBy: [{ field: { fieldPath: '__name__' }, direction: 'ASCENDING' }], limit: limit });
  }
  // A new record, named after what it is and a number that counts down, so the newest sorts first.
  async function createDoc(id, fields) {
    var res = await fetch(api('/submissions') + '?documentId=' + encodeURIComponent(id) + '&' + keyQ(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: Object.keys(fields).reduce(function (o, k) { o[k] = { stringValue: fields[k] }; return o; }, {}) }),
    });
    if (res.ok) return true;
    if (res.status === 409) return false;
    throw new Error('O banco recusou o registro (' + res.status + ').');
  }

  async function verifyDoc(doc) {
    var f = doc.fields || {};
    var payload = f.c && f.c.stringValue, sig = f.k && f.k.stringValue;
    if (!payload || !sig) return null;
    try {
      var ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, S.verifyKey, unb64(sig), enc.encode(payload));
      if (!ok) return null;
      var o = JSON.parse(payload);
      return o && typeof o.seq === 'number' ? o : null;
    } catch (e) { return null; }
  }
  async function loadCtl() {
    var rows = await rangeQuery('ctl', 10), best = null, maxId = 0;
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].document) continue;
      var n = seqOf(rows[i].document.name.split('/').pop());
      if (n > maxId) maxId = n;
      var v = await verifyDoc(rows[i].document);
      if (v && (!best || v.seq > best.seq)) best = v;
    }
    S.ctl = best || { v: 1, seq: 0 };
    S.maxId = maxId;
    return S.ctl;
  }

  // Publishes a new settings notice on top of the newest published one, so two devices never overwrite
  // each other. "mutate" must only set values, never toggle them.
  async function publish(mutate) {
    await loadCtl();
    var next = clone(S.ctl);
    var seq = Math.max(S.ctl.seq || 0, S.maxId || 0) + 1;
    for (var tries = 0; tries < 6; tries++, seq++) {
      next.v = 1; next.seq = seq; next.t = new Date().toISOString();
      mutate(next);
      var payload = JSON.stringify(next);
      var sig = b64(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, S.signKey, enc.encode(payload)));
      if (await createDoc('ctl-' + inv(seq), { t: next.t, k: sig, iv: 'ctl1', c: payload })) { S.ctl = next; S.maxId = seq; return seq; }
    }
    throw new Error('Não consegui um número livre para o aviso. Tente de novo.');
  }

  var busyCount = 0;
  // Runs a change: buttons are locked while it works, the result is announced, the screen is redrawn.
  async function act(okMessage, fn) {
    busyCount++;
    document.querySelectorAll('#panel-view button, #dlg button').forEach(function (b) { b.disabled = true; });
    try {
      await fn();
      if (okMessage) toast(okMessage + ' Os sites aplicam em até 5 segundos.');
      return true;
    } catch (e) {
      toast('Não publicou: ' + (e && e.message || e), true);
      return false;
    } finally {
      busyCount--;
      document.querySelectorAll('#panel-view button, #dlg button').forEach(function (b) { b.disabled = false; });
      render();
    }
  }

  // ---- logins: the directory and the keyrings ---------------------------------------------------

  function sigOf(L) { return JSON.stringify([L.user, L.pass, L.name, L.role, L.welcome, L.folders, (L.docs || []).slice().sort()]); }
  function plainLogin(L) { return { key: L.key, user: L.user, pass: L.pass, name: L.name, role: L.role, welcome: L.welcome || '', folders: L.folders || [], docs: L.docs || [], ver: L.ver || 0, sig: L.sig || '' }; }

  async function decryptDir(doc) {
    var f = doc.fields || {};
    try {
      var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(f.iv.stringValue) }, S.dirKey, unb64(f.c.stringValue));
      var o = JSON.parse(new TextDecoder().decode(plain));
      return o && Array.isArray(o.logins) ? o : null;
    } catch (e) { return null; }
  }
  async function loadDir() {
    var rows = await rangeQuery('dir', 10), found = null;
    for (var i = 0; i < rows.length && !found; i++) {
      if (!rows[i].document) continue;
      var o = await decryptDir(rows[i].document);
      if (o) { o.seq = seqOf(rows[i].document.name.split('/').pop()); found = o; }
    }
    if (!found) {
      // First time: start from the logins the package was built with.
      found = { seq: 0, logins: [] };
      for (var a = 0; a < (S.cfg.accounts || []).length; a++) {
        var acc = S.cfg.accounts[a];
        found.logins.push({ key: 'l' + (await hashOf(acc.user)).slice(0, 10), user: acc.user, pass: acc.pass, name: acc.name, role: acc.role, welcome: acc.welcome || '',
          folders: acc.folders || [], docs: acc.docs || [], ver: 0, sig: '' });
      }
    }
    for (var j = 0; j < found.logins.length; j++) found.logins[j].hash = await hashOf(found.logins[j].user);
    S.dir = { seq: found.seq, logins: found.logins };
    return S.dir;
  }

  async function putKeyring(L) {
    var ring = { v: 1, name: L.name, role: L.role, welcome: L.welcome || '', folders: L.folders || [],
      docs: (L.docs || []).filter(function (id) { return S.lib[id]; }).map(function (id) {
        var d = S.lib[id];
        return { id: d.id, folder: d.folder || '', title: d.title, number: d.number, date: d.date, classification: d.classification, description: d.description || '', lib: d.id, key: d.key };
      }) };
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    var base = await crypto.subtle.importKey('raw', enc.encode(L.user + '\n' + L.pass), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ROUNDS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    var ct = b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(JSON.stringify(ring))));
    if (ct.length > 39000) throw new Error('O chaveiro de ' + L.name + ' ficou grande demais (' + ring.docs.length + ' documentos).');
    for (var tries = 0; tries < 6; tries++, L.ver++) {
      if (await createDoc('acc-' + L.hash + '-' + inv(L.ver), { t: new Date().toISOString(), k: b64(salt), iv: b64(iv), c: ct })) return;
    }
    throw new Error('Não consegui publicar o chaveiro de ' + L.name + '.');
  }
  async function putDir(logins) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var seq = (S.dir.seq || 0) + 1;
    for (var tries = 0; tries < 6; tries++, seq++) {
      var body = { v: 1, seq: seq, t: new Date().toISOString(), logins: logins.map(plainLogin) };
      var ct = b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, S.dirKey, enc.encode(JSON.stringify(body))));
      if (ct.length > 39000) throw new Error('A lista de logins ficou grande demais para um registro.');
      if (await createDoc('dir-' + inv(seq), { t: body.t, k: 'dir1', iv: b64(iv), c: ct })) return seq;
      iv = crypto.getRandomValues(new Uint8Array(12));
    }
    throw new Error('Não consegui publicar a lista de logins.');
  }

  // Writes the whole set of logins: a keyring for every login that changed, the directory, and the
  // versions in the signed settings (a login that is gone or renamed gets version 0).
  async function saveLogins(next) {
    await loadCtl();
    await loadDir();
    var old = S.dir.logins;
    var seen = {};
    for (var i = 0; i < next.length; i++) {
      var L = next[i];
      L.user = L.user.trim().toLowerCase();
      L.hash = await hashOf(L.user);
      if (seen[L.user]) throw new Error('Dois logins com o mesmo usuário (' + L.user + ').');
      seen[L.user] = true;
      var o = old.filter(function (x) { return x.key === L.key; })[0];
      var sig = sigOf(L);
      if (!o || !o.ver || o.sig !== sig || o.hash !== L.hash) {
        L.ver = ((o && o.ver) || L.ver || 0) + 1;
        await putKeyring(L);
        L.sig = sig;
      } else { L.ver = o.ver; L.sig = o.sig; }
    }
    var seq = await putDir(next);
    var gone = old.filter(function (o) { return !next.some(function (n) { return n.key === o.key && n.hash === o.hash; }); });
    await publish(function (n) {
      n.dir = n.dir || {};
      n.accounts = n.accounts || {};
      gone.forEach(function (o) { n.dir[o.hash] = 0; delete n.accounts[o.hash]; delete n.accounts[o.user]; });
      next.forEach(function (L) { n.dir[L.hash] = L.ver; });
    });
    S.dir = { seq: seq, logins: next };
    S.pend = {};
  }

  function acctOf(L) { var a = S.ctl.accounts || {}; return a[L.hash] || a[L.user] || {}; }
  function setAcct(n, L, fn) {
    n.accounts = n.accounts || {};
    var cur = n.accounts[L.hash] || n.accounts[L.user] || {};
    delete n.accounts[L.user];
    n.accounts[L.hash] = cur;
    fn(cur);
  }

  // ---- messages (the activity log) ------------------------------------------------------------

  async function decryptEntry(doc) {
    var f = doc.fields || {};
    var raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, S.priv, unb64(f.k.stringValue));
    var key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(f.iv.stringValue) }, key, unb64(f.c.stringValue));
    return JSON.parse(new TextDecoder().decode(plain));
  }
  async function toEntry(doc) {
    var id = doc.name.split('/').pop();
    if (/^(ctl|dir|acc)-/.test(id)) return null;
    try { var e = await decryptEntry(doc); e.id = id; return e; }
    catch (err) { return { id: id, t: ((doc.fields || {}).t || {}).stringValue || '', form: 'unreadable', site: '', ref: '', fields: [{ label: 'Erro', value: 'Esta entrada não pôde ser decifrada.' }] }; }
  }
  async function loadMessages(first) {
    var q = first
      ? { from: [{ collectionId: 'submissions' }], orderBy: [{ field: { fieldPath: 't' }, direction: 'DESCENDING' }], limit: 500 }
      : { from: [{ collectionId: 'submissions' }], where: { fieldFilter: { field: { fieldPath: 't' }, op: 'GREATER_THAN', value: { stringValue: S.newest } } },
          orderBy: [{ field: { fieldPath: 't' }, direction: 'ASCENDING' }], limit: 200 };
    var rows = await runQuery(q), added = 0;
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].document) continue;
      var tv = ((rows[i].document.fields || {}).t || {}).stringValue || '';
      if (tv > S.newest) S.newest = tv; // also for settings records, so they are not fetched again
      var e = await toEntry(rows[i].document);
      if (!e) continue;
      if (!S.entries.some(function (x) { return x.id === e.id; })) { S.entries.push(e); added++; }
    }
    S.entries.sort(function (a, b) { return a.t < b.t ? 1 : -1; });
    return added;
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
    return e.fields.slice(0, 3).map(function (f) { return f.value; }).filter(Boolean).join(' · ');
  }
  function when(e) { var d = new Date(e.t); return isNaN(d) ? e.t : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }); }
  function typeName(f) { for (var i = 0; i < TYPES.length; i++) if (TYPES[i][0] === f) return TYPES[i][1]; return f; }
  function visibleEntries() {
    var q = S.q.toLowerCase();
    return S.entries.filter(function (e) {
      if (S.type !== 'all' && e.form !== S.type) return false;
      if (!q) return true;
      return (e.form + ' ' + e.site + ' ' + e.ref + ' ' + e.fields.map(function (f) { return f.label + ' ' + f.value; }).join(' ')).toLowerCase().indexOf(q) >= 0;
    });
  }
  function csv(list) {
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var lines = [['hora', 'site', 'tipo', 'referencia', 'pagina', 'idioma', 'detalhes'].map(q).join(',')];
    list.forEach(function (e) {
      lines.push([e.t, e.site, e.form, e.ref, e.page, e.lang, e.fields.map(function (f) { return f.label + ': ' + f.value; }).join(' | ')].map(q).join(','));
    });
    return lines.join('\r\n');
  }
  function dlgOpen() { return $('dlg').open; }
  function closeDlg() { var d = $('dlg'); if (d.open) d.close(); }
  async function pollMessages(manual) {
    try {
      var added = await loadMessages(false);
      if ((S.tab === 'mensagens' || S.tab === 'visao') && (added || manual) && !dlgOpen() && !busyCount) render();
      var st = $('msg-status');
      if (st) st.textContent = S.entries.length + ' entradas · atualizado às ' + new Date().toLocaleTimeString('pt-BR');
      updateCounts();
    } catch (e) { var s2 = $('msg-status'); if (s2) s2.textContent = (e && e.message) || 'Não foi possível ler as mensagens.'; }
  }

  // ---- views ----------------------------------------------------------------------------------

  function head(title, sub, actions) {
    return h('div', { class: 'page-head' }, h('div', {}, h('h1', { text: title }), sub ? h('p', { text: sub }) : null), actions ? h('div', { class: 'row' }, actions) : null);
  }
  function stat(k, v, s) { return h('div', { class: 'card stat' }, h('div', { class: 'k', text: k }), h('div', { class: 'v', text: String(v) }), h('div', { class: 's', text: s || '' })); }

  function viewVisao() {
    var logins = S.dir.logins, blocked = logins.filter(function (L) { return acctOf(L).blocked; }).length;
    var assigned = logins.reduce(function (n, L) { return n + (L.docs || []).length; }, 0);
    var libN = Object.keys(S.lib).length;
    var fresh = S.entries.filter(function (e) { return S.prevSeen && e.t > S.prevSeen; }).length;
    var banners = Object.keys(S.ctl.banner || {}).filter(function (k) { var b = S.ctl.banner[k]; return b && b.on && b.text; }).length;
    var closed = Object.keys(S.ctl.jobs || {}).filter(function (k) { return S.ctl.jobs[k] === 'closed'; }).length;
    var base = S.cfg.baseDate || '2028-10-19';
    var wrap = h('div');
    wrap.appendChild(head('Visão geral', 'O que está acontecendo nos sites agora.', [
      h('button', { class: 'btn primary', type: 'button', onclick: function () { openLoginDialog(null); } }, 'Novo login')]));
    wrap.appendChild(h('div', { class: 'grid stats' },
      stat('Mensagens', S.entries.length, fresh ? fresh + ' novas desde a última visita' : 'nenhuma nova desde a última visita'),
      stat('Logins', logins.length, blocked ? blocked + ' bloqueado' + (blocked > 1 ? 's' : '') : 'todos ativos'),
      stat('Documentos', libN, assigned + ' atribuições aos logins'),
      stat('Data do jogo', S.ctl.today ? longDate(S.ctl.today) : longDate(base), S.ctl.today ? 'alterada pelo mestre' : 'data padrão'),
      stat('Avisos no ar', banners, banners ? 'em ' + banners + ' site' + (banners > 1 ? 's' : '') : 'nenhum aviso'),
      stat('Vagas', (S.cfg.jobs || []).length - closed, closed ? closed + ' preenchida' + (closed > 1 ? 's' : '') : 'todas abertas')));
    var recent = h('div', { class: 'card', style: 'margin-top:.9rem' }, h('div', { class: 'row between' }, h('h2', { text: 'Atividade recente' }),
      h('button', { class: 'btn small ghost', type: 'button', onclick: function () { S.tab = 'mensagens'; render(); } }, 'Ver todas')));
    var feed = h('div', { class: 'feed' });
    S.entries.slice(0, 8).forEach(function (e) {
      feed.appendChild(h('div', { class: 'item' }, h('span', { class: 'chip plain', text: typeName(e.form) }), h('span', { text: summary(e) || e.ref || '—', style: 'overflow-wrap:anywhere' }), h('span', { class: 'muted small', text: when(e) })));
    });
    if (!S.entries.length) feed.appendChild(h('p', { class: 'empty', text: 'Ainda não chegou nenhuma mensagem.' }));
    recent.appendChild(feed);
    wrap.appendChild(recent);
    return wrap;
  }

  function viewMensagens() {
    var counts = { all: S.entries.length };
    S.entries.forEach(function (e) { counts[e.form] = (counts[e.form] || 0) + 1; });
    var wrap = h('div');
    var search = h('input', { type: 'search', id: 'msg-q', placeholder: 'Buscar nas mensagens', 'aria-label': 'Buscar nas mensagens', value: S.q });
    search.addEventListener('input', function (ev) { S.q = ev.target.value; drawRows(); });
    wrap.appendChild(head('Mensagens', 'Tudo que os jogadores mandam pelos sites, já decifrado.'));
    wrap.appendChild(h('div', { class: 'toolbar' }, search,
      h('button', { class: 'btn', type: 'button', onclick: function () { pollMessages(true); } }, 'Atualizar'),
      h('button', { class: 'btn', type: 'button', onclick: function () {
        var a = h('a', { href: URL.createObjectURL(new Blob([csv(visibleEntries())], { type: 'text/csv;charset=utf-8' })), download: 'mensagens.csv' });
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      } }, 'Baixar CSV'),
      h('span', { class: 'muted small', id: 'msg-status', text: S.entries.length + ' entradas' })));
    var pills = h('div', { class: 'pills' });
    TYPES.forEach(function (t) {
      pills.appendChild(h('button', { type: 'button', 'aria-pressed': String(S.type === t[0]), onclick: function () { S.type = t[0]; render(); } }, t[1] + ' ' + (counts[t[0]] || 0)));
    });
    wrap.appendChild(pills);
    wrap.appendChild(h('div', { class: 'table-wrap' }, h('table', { class: 'list' }, h('thead', {}, h('tr', {}, h('th', {}, 'Quando'), h('th', {}, 'Site'), h('th', {}, 'Tipo'), h('th', {}, 'Ref.'), h('th', {}, 'Detalhes'))), h('tbody', { id: 'msg-rows' }))));
    setTimeout(drawRows, 0);
    return wrap;
  }
  function drawRows() {
    var body = $('msg-rows');
    if (!body) return;
    body.textContent = '';
    var list = visibleEntries();
    if (!list.length) { body.appendChild(h('tr', {}, h('td', { colspan: '5', class: 'empty', text: 'Nada por aqui ainda.' }))); return; }
    list.forEach(function (e) {
      var fresh = S.prevSeen && e.t > S.prevSeen;
      var dl = h('dl');
      e.fields.forEach(function (f) { dl.appendChild(h('dt', { text: f.label })); dl.appendChild(h('dd', { text: f.value })); });
      dl.appendChild(h('dt', { text: 'Página' })); dl.appendChild(h('dd', { text: (e.page || '') + ' (' + (e.lang || '') + ')' }));
      dl.appendChild(h('dt', { text: 'Navegador' })); dl.appendChild(h('dd', { text: e.ua || '' }));
      var detail = h('tr', { class: 'detail', hidden: !S.open[e.id] }, h('td', { colspan: '5' }, dl));
      var row = h('tr', { class: 'entry' + (fresh ? ' fresh' : ''), onclick: function () { S.open[e.id] = !S.open[e.id]; detail.hidden = !S.open[e.id]; } },
        h('td', { text: when(e) }), h('td', { text: e.site }), h('td', { text: typeName(e.form) }), h('td', { class: 'mono', text: e.ref }), h('td', { text: summary(e) }));
      body.appendChild(row); body.appendChild(detail);
    });
  }

  function blockMenu(L) {
    var open = S.menu === L.key;
    var wrap = h('div', { class: 'menu' }, h('button', { class: 'btn danger small', type: 'button', 'aria-expanded': String(open),
      onclick: function (ev) { ev.stopPropagation(); S.menu = open ? '' : L.key; render(); } }, 'Bloquear ▾'));
    if (open) {
      var choose = function (mode) { return function () { S.menu = ''; blockLogin(L, mode); }; };
      wrap.appendChild(h('div', {},
        h('button', { type: 'button', onclick: choose('wait') }, 'Bloquear', h('small', { text: 'Vale no próximo login. Quem já está dentro continua.' })),
        h('button', { type: 'button', onclick: choose('now') }, 'Bloquear agora', h('small', { text: 'Derruba a sessão dele em até 5 segundos.' })),
        h('button', { type: 'button', onclick: choose('reload') }, 'Bloquear e recarregar a página', h('small', { text: 'A página dele recarrega e volta ao login.' }))));
    }
    return wrap;
  }
  function blockLogin(L, mode) {
    act('Login ' + L.user + ' bloqueado.', async function () {
      var msg = (acctOf(L).message || '').trim() || DEFAULT_BLOCK;
      await publish(function (n) { setAcct(n, L, function (a) { a.blocked = true; a.mode = mode; a.message = msg; a.at = n.seq; }); });
    });
  }

  function personCard(L) {
    var st = acctOf(L), blocked = !!st.blocked, shown = !!S.reveal[L.key];
    var docs = (L.docs || []).filter(function (id) { return S.lib[id]; });
    var card = h('div', { class: 'card' });
    card.appendChild(h('div', { class: 'person-head' }, avatar(L), h('div', { class: 't' }, h('h3', { text: L.name }), h('div', { class: 'muted small', text: L.role })),
      h('span', { class: 'chip' + (blocked ? ' off' : ''), text: blocked ? 'Bloqueado' : 'Ativo' })));
    card.appendChild(h('dl', { class: 'creds' },
      h('dt', { text: 'Usuário' }), h('dd', {}, h('span', { class: 'pw', text: L.user }), h('button', { class: 'btn ghost small', type: 'button', onclick: function () { copy(L.user, 'Usuário copiado.'); } }, 'copiar')),
      h('dt', { text: 'Senha' }), h('dd', {}, h('span', { class: 'pw', text: shown ? L.pass : '••••••••••' }),
        h('button', { class: 'btn ghost small', type: 'button', onclick: function () { S.reveal[L.key] = !shown; render(); } }, shown ? 'ocultar' : 'mostrar'),
        h('button', { class: 'btn ghost small', type: 'button', onclick: function () { copy(L.pass, 'Senha copiada.'); } }, 'copiar'))));
    card.appendChild(h('div', { class: 'row', style: 'margin-bottom:.8rem' },
      h('span', { class: 'chip plain', text: docs.length + (docs.length === 1 ? ' documento' : ' documentos') }),
      !L.ver ? h('span', { class: 'chip warn', text: 'ainda não publicado' }) : null,
      st.note ? h('span', { class: 'chip plain', text: 'tem aviso ao entrar' }) : null));
    var foot = h('div', { class: 'person-foot' },
      h('button', { class: 'btn small', type: 'button', onclick: function () { openLoginDialog(L); } }, 'Editar'),
      h('button', { class: 'btn small', type: 'button', onclick: function () { S.tab = 'documentos'; S.docQ = ''; render(); } }, 'Documentos'));
    if (blocked) foot.appendChild(h('button', { class: 'btn primary small', type: 'button', onclick: function () {
      act('Login ' + L.user + ' liberado.', function () { return publish(function (n) { setAcct(n, L, function (a) { a.blocked = false; a.at = n.seq; }); }); });
    } }, 'Desbloquear'));
    else foot.appendChild(blockMenu(L));
    card.appendChild(foot);
    if (blocked) card.appendChild(h('p', { class: 'muted small', style: 'margin:.7rem 0 0', text: 'Modo: ' + ({ wait: 'vale no próximo login', now: 'derrubou a sessão', reload: 'recarregou a página' }[st.mode] || 'vale no próximo login') }));
    return card;
  }
  function viewLogins() {
    var wrap = h('div');
    var unpublished = S.dir.logins.filter(function (L) { return !L.ver; });
    wrap.appendChild(head('Logins', 'Quem entra no portal de parceiros, com que senha e com quais documentos.', [
      h('button', { class: 'btn primary', type: 'button', onclick: function () { openLoginDialog(null); } }, 'Novo login')]));
    if (unpublished.length) {
      wrap.appendChild(h('div', { class: 'note info' }, h('div', { class: 'row between' },
        h('span', { text: unpublished.length + ' login' + (unpublished.length > 1 ? 's' : '') + ' ainda ' + (unpublished.length > 1 ? 'usam' : 'usa') + ' o modelo antigo. Publique para que o painel possa mudar usuário, senha e documentos deles.' }),
        h('button', { class: 'btn primary small', type: 'button', onclick: function () {
          act('Logins publicados.', function () { return saveLogins(clone(S.dir.logins)); });
        } }, 'Publicar logins agora'))));
    }
    wrap.appendChild(h('div', { class: 'note' }, 'Bloquear vale no navegador do jogador: quem entende de código consegue contornar. Para a mesa, funciona como um interruptor.'));
    var grid = h('div', { class: 'grid people' });
    S.dir.logins.forEach(function (L) { grid.appendChild(personCard(L)); });
    if (!S.dir.logins.length) grid.appendChild(h('p', { class: 'empty', text: 'Nenhum login ainda. Crie o primeiro com "Novo login".' }));
    wrap.appendChild(grid);
    return wrap;
  }

  // ---- access matrix --------------------------------------------------------------------------

  function wanted(L) { return S.pend[L.key] ? S.pend[L.key] : (L.docs || []); }
  function pendingCount() {
    var n = 0;
    S.dir.logins.forEach(function (L) {
      if (!S.pend[L.key]) return;
      var cur = {}, now = {};
      (L.docs || []).forEach(function (d) { cur[d] = 1; });
      S.pend[L.key].forEach(function (d) { now[d] = 1; });
      Object.keys(Object.assign({}, cur, now)).forEach(function (d) { if (!!cur[d] !== !!now[d]) n++; });
    });
    return n;
  }
  function setCell(L, docId, on) {
    var cur = (S.pend[L.key] || (L.docs || [])).slice();
    var i = cur.indexOf(docId);
    if (on && i < 0) cur.push(docId);
    if (!on && i >= 0) cur.splice(i, 1);
    S.pend[L.key] = cur;
  }
  function visibleDocs() {
    var q = S.docQ.toLowerCase();
    return Object.keys(S.lib).map(function (k) { return S.lib[k]; }).filter(function (d) {
      if (S.docFilter !== 'all' && d.folder !== S.docFilter && d.account !== S.docFilter) return false;
      return !q || (d.title + ' ' + d.number + ' ' + d.folder + ' ' + d.classification + ' ' + d.account).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return a.account === b.account ? (a.date < b.date ? 1 : -1) : (a.account < b.account ? -1 : 1); });
  }
  function keepMatrix(fn) {
    var w = $('matrix-wrap'), top = w ? w.scrollTop : 0, left = w ? w.scrollLeft : 0;
    fn();
    var w2 = $('matrix-wrap');
    if (w2) { w2.scrollTop = top; w2.scrollLeft = left; }
  }
  function viewDocumentos() {
    var wrap = h('div'), logins = S.dir.logins, docs = visibleDocs();
    wrap.appendChild(head('Documentos', 'Marque quem recebe cada documento. Desmarque para tirar. As mudanças só valem depois de Aplicar.'));
    var search = h('input', { type: 'search', id: 'doc-q', placeholder: 'Buscar documento, número, pasta', 'aria-label': 'Buscar documentos', value: S.docQ });
    search.addEventListener('input', function (ev) { S.docQ = ev.target.value; keepMatrix(render); var q = $('doc-q'); q.focus(); q.setSelectionRange(q.value.length, q.value.length); });
    var folders = {}, accounts = {};
    Object.keys(S.lib).forEach(function (k) { if (S.lib[k].folder) folders[S.lib[k].folder] = 1; accounts[S.lib[k].account] = 1; });
    var filter = h('select', { id: 'doc-f', 'aria-label': 'Filtrar' }, h('option', { value: 'all', text: 'Todos os documentos' }));
    Object.keys(accounts).sort().forEach(function (a) { filter.appendChild(h('option', { value: a, selected: S.docFilter === a, text: 'Origem: ' + a })); });
    Object.keys(folders).sort().forEach(function (f) { filter.appendChild(h('option', { value: f, selected: S.docFilter === f, text: 'Pasta: ' + f })); });
    filter.addEventListener('change', function (ev) { S.docFilter = ev.target.value; keepMatrix(render); });
    wrap.appendChild(h('div', { class: 'toolbar' }, search, filter, h('span', { class: 'muted small', text: docs.length + ' de ' + Object.keys(S.lib).length + ' documentos' })));
    if (!logins.length) { wrap.appendChild(h('p', { class: 'empty', text: 'Crie um login primeiro, na aba Logins.' })); return wrap; }

    var table = h('table', { class: 'matrix' });
    var trh = h('tr', {}, h('th', { scope: 'col' }, 'Documento'));
    logins.forEach(function (L) {
      var ids = docs.map(function (d) { return d.id; });
      var on = ids.filter(function (id) { return wanted(L).indexOf(id) >= 0; }).length;
      var box = h('input', { type: 'checkbox', 'aria-label': 'Marcar todos os documentos para ' + L.name });
      box.checked = ids.length > 0 && on === ids.length;
      box.indeterminate = on > 0 && on < ids.length;
      box.addEventListener('change', function () { var to = box.checked; ids.forEach(function (id) { setCell(L, id, to); }); keepMatrix(render); });
      trh.appendChild(h('th', { scope: 'col' }, h('div', { class: 'col-head' }, avatar(L, true), h('span', { text: L.name.split(' ')[0] }), h('label', { class: 'cell', style: 'min-height:30px' }, box))));
    });
    table.appendChild(h('thead', {}, trh));
    var tbody = h('tbody');
    docs.forEach(function (d) {
      var tr = h('tr');
      var onCount = logins.filter(function (L) { return wanted(L).indexOf(d.id) >= 0; }).length;
      var rowBox = h('input', { type: 'checkbox', 'aria-label': 'Marcar ' + d.title + ' para todos' });
      rowBox.checked = onCount === logins.length; rowBox.indeterminate = onCount > 0 && onCount < logins.length;
      rowBox.addEventListener('change', function () { var to = rowBox.checked; logins.forEach(function (L) { setCell(L, d.id, to); }); keepMatrix(render); });
      tr.appendChild(h('th', { scope: 'row' }, h('span', { class: 'doc-t', text: d.title }),
        h('span', { class: 'doc-m' }, h('span', { class: 'mono', text: d.number }), h('span', { text: longDate(d.date) }), h('span', { class: 'chip plain', text: d.classification }),
          d.folder ? h('span', { class: 'chip plain', text: d.folder }) : null, h('span', { class: 'chip plain', text: 'origem ' + d.account }),
          h('label', { style: 'display:inline-flex;gap:.35rem;align-items:center;cursor:pointer' }, rowBox, 'todos'))));
      logins.forEach(function (L) {
        var has = (L.docs || []).indexOf(d.id) >= 0, now = wanted(L).indexOf(d.id) >= 0;
        var cb = h('input', { type: 'checkbox', 'aria-label': d.title + ' para ' + L.name });
        cb.checked = now;
        cb.addEventListener('change', function () { setCell(L, d.id, cb.checked); keepMatrix(render); });
        tr.appendChild(h('td', { class: has !== now ? 'changed' : '' }, h('label', { class: 'cell' }, cb)));
      });
      tbody.appendChild(tr);
    });
    if (!docs.length) tbody.appendChild(h('tr', {}, h('td', { colspan: String(logins.length + 1), class: 'empty', text: 'Nenhum documento com esse filtro.' })));
    table.appendChild(tbody);
    wrap.appendChild(h('div', { class: 'matrix-wrap', id: 'matrix-wrap' }, table));

    var n = pendingCount();
    if (n) wrap.appendChild(h('div', { class: 'savebar' }, h('span', { text: n + (n === 1 ? ' mudança não aplicada' : ' mudanças não aplicadas') }), h('div', { class: 'row' },
      h('button', { class: 'btn ghost', type: 'button', onclick: function () { S.pend = {}; keepMatrix(render); } }, 'Descartar'),
      h('button', { class: 'btn primary', type: 'button', onclick: function () {
        var next = clone(S.dir.logins);
        next.forEach(function (L) { if (S.pend[L.key]) L.docs = S.pend[L.key].slice(); });
        act('Documentos atualizados.', function () { return saveLogins(next); });
      } }, 'Aplicar'))));
    return wrap;
  }

  // ---- the login dialog -----------------------------------------------------------------------

  function openLoginDialog(L) {
    var isNew = !L;
    var draft = L ? clone(L) : { key: newKey(), user: '', pass: genPassword(), name: '', role: '', welcome: '', folders: [], docs: [], ver: 0, sig: '' };
    var st = L ? acctOf(L) : {};
    var d = $('dlg');
    d.textContent = '';
    var f = {
      user: h('input', { type: 'text', id: 'f-user', value: draft.user, autocapitalize: 'none', spellcheck: 'false', autocomplete: 'off' }),
      pass: h('input', { type: 'text', id: 'f-pass', value: draft.pass, spellcheck: 'false', autocomplete: 'off' }),
      name: h('input', { type: 'text', id: 'f-name', value: draft.name, autocomplete: 'off' }),
      role: h('input', { type: 'text', id: 'f-role', value: draft.role, autocomplete: 'off' }),
      welcome: h('textarea', { id: 'f-welcome', text: draft.welcome || '' }),
      folders: h('textarea', { id: 'f-folders', text: (draft.folders || []).map(function (x) { return x.note ? x.name + ' | ' + x.note : x.name; }).join('\n') }),
      note: h('textarea', { id: 'f-note', text: st.note || '' }),
      msg: h('input', { type: 'text', id: 'f-msg', value: st.message || DEFAULT_BLOCK }),
    };
    var err = h('p', { class: 'note', hidden: true, role: 'alert' });
    var delStep = false;
    var delBtn = h('button', { class: 'btn danger', type: 'button', hidden: isNew }, 'Excluir login');
    delBtn.addEventListener('click', function () {
      if (!delStep) { delStep = true; delBtn.textContent = 'Confirmar exclusão'; return; }
      closeDlg();
      var next = clone(S.dir.logins).filter(function (x) { return x.key !== draft.key; });
      act('Login excluído.', function () { return saveLogins(next); });
    });
    d.appendChild(h('div', { class: 'dlg-head' }, h('div', {}, h('h2', { id: 'dlg-title', text: isNew ? 'Novo login' : 'Editar ' + L.name }),
      h('p', { class: 'muted small', text: 'Salvar publica o login. Quem estiver dentro do portal é atualizado em segundos.' })),
      h('button', { class: 'btn ghost small', type: 'button', onclick: closeDlg, 'aria-label': 'Fechar' }, '✕')));
    d.appendChild(h('div', { class: 'two' }, h('div', {}, h('label', { class: 'l', for: 'f-name', text: 'Nome' }), f.name), h('div', {}, h('label', { class: 'l', for: 'f-role', text: 'Função' }), f.role)));
    d.appendChild(h('div', { class: 'two' }, h('div', {}, h('label', { class: 'l', for: 'f-user', text: 'Usuário' }), f.user),
      h('div', {}, h('label', { class: 'l', for: 'f-pass', text: 'Senha' }), h('div', { class: 'pwrow' }, f.pass,
        h('button', { class: 'btn small', type: 'button', onclick: function () { f.pass.value = genPassword(); } }, 'Gerar')))));
    d.appendChild(h('label', { class: 'l', for: 'f-welcome', text: 'Mensagem de boas-vindas no portal' })); d.appendChild(f.welcome);
    d.appendChild(h('label', { class: 'l', for: 'f-folders', text: 'Pastas do portal (uma por linha; use "Nome | nota" para uma nota)' })); d.appendChild(f.folders);
    d.appendChild(h('label', { class: 'l', for: 'f-note', text: 'Aviso mostrado quando ele entra' })); d.appendChild(f.note);
    d.appendChild(h('label', { class: 'l', for: 'f-msg', text: 'Mensagem quando estiver bloqueado' })); d.appendChild(f.msg);
    d.appendChild(err);
    d.appendChild(h('div', { class: 'dlg-foot' }, h('div', {}, delBtn), h('div', { class: 'row' },
      h('button', { class: 'btn ghost', type: 'button', onclick: closeDlg }, 'Cancelar'),
      h('button', { class: 'btn primary', type: 'button', onclick: function () {
        var user = f.user.value.trim().toLowerCase();
        var problem = '';
        if (!/^[a-z0-9._-]{2,32}$/.test(user)) problem = 'O usuário deve ter de 2 a 32 letras minúsculas, números, ponto, hífen ou sublinhado.';
        else if (!f.pass.value.trim()) problem = 'Escreva uma senha.';
        else if (!f.name.value.trim()) problem = 'Escreva um nome.';
        else if (S.dir.logins.some(function (x) { return x.key !== draft.key && x.user === user; })) problem = 'Já existe um login com esse usuário.';
        if (problem) { err.textContent = problem; err.hidden = false; return; }
        var next = clone(S.dir.logins);
        var cur = next.filter(function (x) { return x.key === draft.key; })[0];
        if (!cur) { cur = { key: draft.key, docs: [], ver: 0, sig: '' }; next.push(cur); }
        cur.user = user; cur.pass = f.pass.value.trim(); cur.name = f.name.value.trim(); cur.role = f.role.value.trim(); cur.welcome = f.welcome.value.trim();
        cur.folders = f.folders.value.split('\n').map(function (ln) { return ln.trim(); }).filter(Boolean).map(function (ln) { var p = ln.split('|'); return { name: p[0].trim(), note: (p[1] || '').trim() }; });
        var note = f.note.value.trim(), msg = f.msg.value.trim() || DEFAULT_BLOCK;
        closeDlg();
        act(isNew ? 'Login criado.' : 'Login atualizado.', async function () {
          await saveLogins(next);
          var saved = S.dir.logins.filter(function (x) { return x.key === draft.key; })[0];
          if (saved && ((st.note || '') !== note || (st.message || DEFAULT_BLOCK) !== msg)) {
            await publish(function (n) { setAcct(n, saved, function (a) { a.note = note; a.message = msg; }); });
          }
        });
      } }, isNew ? 'Criar login' : 'Salvar'))));
    d.showModal();
    f.name.focus();
  }

  // ---- notices, vacancies, date -----------------------------------------------------------------

  function viewAvisos() {
    var wrap = h('div');
    wrap.appendChild(head('Avisos', 'Uma faixa no topo de todas as páginas de um site, ou uma mensagem que cobre a tela. Serve para uma queda de sistema, um comunicado ou "estamos fora do ar".'));
    var grid = h('div', { class: 'grid people' });
    (S.cfg.sites || []).forEach(function (site) {
      var cur = ((S.ctl.banner || {})[site]) || {};
      var on = !!(cur.on && cur.text);
      var card = h('div', { class: 'card' });
      card.appendChild(h('div', { class: 'row between' }, h('h3', { text: site }), h('span', { class: 'chip' + (on ? '' : ' off'), text: on ? 'No ar' : 'Sem aviso' })));
      card.appendChild(h('label', { class: 'l', for: 'tone-' + site, text: 'Tipo' }));
      var sel = h('select', { id: 'tone-' + site });
      TONES.forEach(function (t) { sel.appendChild(h('option', { value: t[0], selected: (cur.tone || 'info') === t[0], text: t[1] })); });
      card.appendChild(sel);
      card.appendChild(h('label', { class: 'l', for: 'txt-' + site, text: 'Texto (em inglês, como o site)' }));
      card.appendChild(h('textarea', { id: 'txt-' + site, text: cur.text || '' }));
      card.appendChild(h('div', { class: 'row', style: 'margin-top:.7rem' },
        h('button', { class: 'btn primary', type: 'button', onclick: function () {
          var text = ($('txt-' + site).value || '').trim();
          if (!text) { toast('Escreva o texto do aviso primeiro.', true); return; }
          var tone = $('tone-' + site).value;
          act('Aviso no ar em ' + site + '.', function () { return publish(function (n) { n.banner = n.banner || {}; n.banner[site] = { on: true, text: text, tone: tone }; }); });
        } }, on ? 'Atualizar aviso' : 'Publicar aviso'),
        on ? h('button', { class: 'btn', type: 'button', onclick: function () {
          act('Aviso retirado de ' + site + '.', function () { return publish(function (n) { n.banner = n.banner || {}; n.banner[site] = { on: false, text: cur.text || '', tone: cur.tone || 'info' }; }); });
        } }, 'Retirar aviso') : null));
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }
  function viewVagas() {
    var wrap = h('div');
    wrap.appendChild(head('Vagas', 'Uma vaga preenchida some do site da Kelvara (lista, contagem, formulário e diagrama), e os textos com "três vagas" se ajustam.'));
    var grid = h('div', { class: 'grid people' });
    (S.cfg.jobs || []).forEach(function (j) {
      var closed = ((S.ctl.jobs || {})[j.reference]) === 'closed';
      grid.appendChild(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('div', {}, h('h3', { text: j.title }), h('div', { class: 'muted small mono', text: j.reference })),
        h('span', { class: 'chip' + (closed ? ' off' : ''), text: closed ? 'Preenchida' : 'Aberta' })),
        h('div', { style: 'margin-top:.8rem' }, h('button', { class: closed ? 'btn primary' : 'btn danger', type: 'button', onclick: function () {
          act(closed ? j.title + ' reaberta.' : j.title + ' marcada como preenchida.', function () {
            return publish(function (n) { n.jobs = n.jobs || {}; if (closed) delete n.jobs[j.reference]; else n.jobs[j.reference] = 'closed'; });
          });
        } }, closed ? 'Reabrir vaga' : 'Marcar como preenchida'))));
    });
    if (!(S.cfg.jobs || []).length) grid.appendChild(h('p', { class: 'empty', text: 'Nenhuma vaga encontrada no pacote.' }));
    wrap.appendChild(grid);
    return wrap;
  }
  function viewData() {
    var base = S.cfg.baseDate || '2028-10-19';
    var cur = S.ctl.today || base;
    var wrap = h('div');
    wrap.appendChild(head('Data compartilhada', 'Vale para todos os sites, os atuais e os futuros. Notícias, relatórios, vagas, produtos, estudos, a história, o preço da ação e os documentos do portal com data depois dela ficam escondidos.'));
    var input = h('input', { type: 'date', id: 'date-in', value: cur });
    var apply = function (iso) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) { toast('Escolha uma data.', true); return; }
      act('Data definida para ' + longDate(iso) + '.', function () { return publish(function (n) { if (iso === base) delete n.today; else n.today = iso; }); });
    };
    wrap.appendChild(h('div', { class: 'card', style: 'max-width:640px' },
      h('div', { class: 'row between' }, h('h3', { text: 'Hoje, no jogo' }), h('span', { class: 'chip' + (S.ctl.today ? ' warn' : ''), text: S.ctl.today ? 'Alterada' : 'Padrão' })),
      h('p', { style: 'font-size:1.6rem;font-weight:650;margin:.4rem 0 .8rem', text: longDate(cur) }),
      h('div', { class: 'row' }, h('div', { class: 'grow' }, input), h('button', { class: 'btn primary', type: 'button', onclick: function () { apply($('date-in').value); } }, 'Aplicar')),
      h('div', { class: 'row', style: 'margin-top:.8rem' },
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, -1)); } }, '−1 dia'),
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, 1)); } }, '+1 dia'),
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, 7)); } }, '+1 semana'),
        h('button', { class: 'btn ghost', type: 'button', onclick: function () { apply(base); } }, 'Voltar ao padrão (' + longDate(base) + ')'))));
    wrap.appendChild(h('p', { class: 'muted small', style: 'margin-top:1rem;max-width:70ch', text: 'Para liberar uma notícia no dia certo, escreva-a com data futura e marque scheduled: true no arquivo. Ela vai no código da página escondida e aparece quando a data chega nela. Documentos do portal ficam dentro de arquivos criptografados e não têm esse limite.' }));
    return wrap;
  }

  // ---- frame ----------------------------------------------------------------------------------

  function updateCounts() {
    var m = $('count-mensagens');
    if (m) m.textContent = String(S.entries.length);
  }
  function countFor(id) {
    if (id === 'mensagens') return S.entries.length;
    if (id === 'logins') return S.dir.logins.length;
    if (id === 'documentos') return Object.keys(S.lib).length;
    return null;
  }
  function renderTabs() {
    var tabs = $('tabs');
    tabs.textContent = '';
    TABS.forEach(function (t) {
      var b = h('button', { type: 'button', role: 'tab', 'aria-selected': String(S.tab === t[0]), onclick: function () { S.tab = t[0]; S.menu = ''; render(); window.scrollTo(0, 0); } });
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[t[0]] + '</svg>';
      b.appendChild(h('span', { text: t[1] }));
      var c = countFor(t[0]);
      if (c !== null) b.appendChild(h('span', { class: 'n', id: 'count-' + t[0], text: String(c) }));
      tabs.appendChild(b);
    });
  }
  function render() {
    if (!S.cfg) return;
    renderTabs();
    var body = $('tab-body');
    body.textContent = '';
    body.appendChild({ visao: viewVisao, mensagens: viewMensagens, logins: viewLogins, documentos: viewDocumentos, avisos: viewAvisos, vagas: viewVagas, data: viewData }[S.tab]());
    var c = S.ctl;
    $('state-line').textContent = (c.seq ? 'Aviso #' + c.seq + ' · ' + new Date(c.t).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Nenhum aviso publicado') + ' · jogo em ' + longDate(c.today || S.cfg.baseDate);
  }
  document.addEventListener('click', function (ev) {
    if (S.menu && !ev.target.closest('.menu')) { S.menu = ''; render(); }
  });

  async function start(bundle) {
    var cfg = bundle.admin;
    if (!cfg.projectId || !cfg.apiKey) throw new Error('O pacote não tem o projeto do banco.');
    if (!cfg.privateJwk || !cfg.signJwk) throw new Error('O pacote não tem as chaves. Rode o panel-bundle de novo.');
    S.cfg = cfg; S.entries = []; S.newest = ''; S.pend = {}; S.menu = ''; S.lib = {};
    (cfg.library || []).forEach(function (d) { S.lib[d.id] = d; });
    try { S.prevSeen = localStorage.getItem(SEEN_KEY) || ''; } catch (e) { S.prevSeen = ''; }
    S.priv = await crypto.subtle.importKey('jwk', cfg.privateJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
    S.signKey = await crypto.subtle.importKey('jwk', cfg.signJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    S.verifyKey = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: cfg.signJwk.x, y: cfg.signJwk.y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    S.dirKey = await crypto.subtle.importKey('raw', unb64(cfg.dirKey), 'AES-GCM', false, ['encrypt', 'decrypt']);
    lockScreen(false);
    await loadCtl().catch(function () { /* shown below */ });
    try { await loadDir(); } catch (e) { toast('Não consegui ler a lista de logins: ' + (e && e.message || e), true); }
    try { await loadMessages(true); } catch (e) { toast((e && e.message) || 'Não foi possível ler as mensagens.', true); }
    if (S.newest) { try { localStorage.setItem(SEEN_KEY, S.newest); } catch (e) { /* ignore */ } }
    render();
    S.timers.push(setInterval(function () { if (!document.hidden) pollMessages(false); }, 8000));
    // Pick up changes made from another device, without touching a form somebody is typing in.
    S.timers.push(setInterval(function () {
      if (document.hidden || busyCount || dlgOpen()) return;
      var before = S.ctl.seq, beforeDir = S.dir.seq;
      Promise.all([loadCtl(), loadDir()]).then(function () {
        var a = document.activeElement, typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
        if (S.cfg && (S.ctl.seq !== before || S.dir.seq !== beforeDir) && !typing && !Object.keys(S.pend).length) render();
      }, function () { /* ignore */ });
    }, 30000));
  }

  $('reload-all').addEventListener('click', function () {
    act('Pedido de recarregar enviado.', function () { return publish(function (n) { n.reload = n.seq; }); });
  });
  $('sign-out').addEventListener('click', function () {
    S.timers.forEach(clearInterval); S.timers = [];
    S.cfg = null; S.priv = null; S.signKey = null; S.dirKey = null; S.entries = []; S.pend = {}; S.dir = { seq: 0, logins: [] };
    closeDlg();
    typed = '';
    lockScreen(true);
  });
})();
