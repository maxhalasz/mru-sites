/* Painel do Mestre.
   A página abre preta, sem nada escrito. Ao digitar a palavra certa, o pacote criptografado ao lado
   desta página é aberto aqui, no navegador, com a palavra e um segredo longo que vem no endereço
   (depois do #) e que o navegador lembra. Dentro do pacote estão as chaves e a lista de logins.
   Cada mudança vira um aviso assinado que os sites leem a cada poucos segundos. */
(function () {
  'use strict';

  var ROUNDS = 600000;
  var KEY_STORE = 'painel_k';
  var SEEN_KEY = 'painel_seen';
  // Only used to skip pointless work: the typed word is checked here before the slow decryption starts.
  var PHRASE_HASH = '85d800049636a686c8a502c08760c93e482d02ae87639a7a7103f46e53ab41a2';
  var WORD_LEN = 8;
  var enc = new TextEncoder();

  var S = { cfg: null, bundle: null, ctl: { v: 1, seq: 0 }, maxId: 0, priv: null, signKey: null, verifyKey: null,
    entries: [], newest: '', prevSeen: '', tab: 'mensagens', type: 'all', q: '', open: {}, timers: [] };

  var TABS = [['mensagens', 'Mensagens'], ['logins', 'Logins'], ['documentos', 'Documentos'], ['avisos', 'Avisos'], ['vagas', 'Vagas'], ['data', 'Data']];
  var TYPES = [['all', 'Todas'], ['application', 'Candidaturas'], ['contact', 'Contato'], ['boreas-screening', 'Triagem BOREAS-2'],
    ['newsletter', 'Newsletter'], ['investor-alert', 'Alertas de investidores'], ['portal-login', 'Entradas no portal'], ['portal-open', 'Documentos abertos']];
  var TONES = [['info', 'Faixa informativa'], ['alert', 'Faixa de alerta'], ['full', 'Mensagem em tela cheia']];
  var DEFAULT_BLOCK = 'This account has been suspended. Contact the IT Service Desk.';

  function $(id) { return document.getElementById(id); }
  function h(tag, props) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v === false || v == null) return;
      if (k === 'text') node.textContent = v;
      else if (k === 'class') node.className = v;
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, '');
      else node.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid == null || kid === false) continue;
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    }
    return node;
  }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function b64(buf) { var bytes = new Uint8Array(buf), s = ''; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function unb64(s) { var bin = atob(s), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  var TOP = 999999;
  // Notices are named ctl-<999999 minus the notice number>, so the newest sorts first in the normal order.
  function noticeId(seq) { return 'ctl-' + ('000000' + (TOP - seq)).slice(-6); }
  function noticeSeq(id) { return TOP - parseInt(id.slice(4), 10); }
  function longDate(iso) {
    return new Date(iso + 'T12:00:00Z').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function isoOf(d) { return d.toISOString().slice(0, 10); }
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return isoOf(d); }

  function toast(msg, bad) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast' + (bad ? ' bad' : '');
    t.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { t.hidden = true; }, bad ? 9000 : 4500);
  }

  // ---- sign in --------------------------------------------------------------------------------

  async function openPackage(user, pass) {
    var name = hex(await crypto.subtle.digest('SHA-256', enc.encode('ns-partner:' + user))).slice(0, 32);
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

  function sha256hex(text) { return crypto.subtle.digest('SHA-256', enc.encode(text)).then(hex); }
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
    try { var h = decodeURIComponent(location.hash.slice(1)); if (h) return h; } catch (e) { /* ignore */ }
    try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }
  async function finish(secret, bundle) {
    try { localStorage.setItem(KEY_STORE, secret); } catch (e) { /* ignore */ }
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    typed = '';
    await start(bundle);
  }
  // The word was right but the secret is missing or wrong: ask for it on the same black screen.
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
    if ((await sha256hex('painel:' + word)) !== PHRASE_HASH) return;
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
    } catch (e) { /* fall through to the key prompt */ } finally { show('busy', false); unlocking = false; }
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
  async function runQuery(structuredQuery) {
    var res = await fetch(api(':runQuery') + '?key=' + encodeURIComponent(S.cfg.apiKey), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ structuredQuery: structuredQuery }),
    });
    if (!res.ok) throw new Error('O banco respondeu ' + res.status + '.');
    return res.json();
  }
  function ctlQuery(limit) {
    var f = function (op, id) { return { fieldFilter: { field: { fieldPath: '__name__' }, op: op, value: { referenceValue: docsRef(id) } } }; };
    return runQuery({ from: [{ collectionId: 'submissions' }],
      where: { compositeFilter: { op: 'AND', filters: [f('GREATER_THAN_OR_EQUAL', 'ctl-'), f('LESS_THAN', 'ctl.')] } },
      orderBy: [{ field: { fieldPath: '__name__' }, direction: 'ASCENDING' }], limit: limit });
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
    var rows = await ctlQuery(10), best = null, maxId = 0;
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i].document) continue;
      var id = rows[i].document.name.split('/').pop();
      var n = noticeSeq(id);
      if (n > maxId) maxId = n;
      var v = await verifyDoc(rows[i].document);
      if (v && (!best || v.seq > best.seq)) best = v;
    }
    S.ctl = best || { v: 1, seq: 0 };
    S.maxId = maxId;
    return S.ctl;
  }

  // Publishes a new settings notice. The change is applied to the newest published settings, so
  // two devices never overwrite each other. "mutate" must only set values, never toggle them.
  async function publish(mutate, message) {
    var busy = document.querySelectorAll('button');
    busy.forEach(function (b) { b.disabled = true; });
    try {
      await loadCtl();
      var next = clone(S.ctl);
      var seq = Math.max(S.ctl.seq || 0, S.maxId || 0) + 1;
      for (var tries = 0; tries < 6; tries++, seq++) {
        next.v = 1; next.seq = seq; next.t = new Date().toISOString();
        mutate(next);
        var payload = JSON.stringify(next);
        var sig = b64(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, S.signKey, enc.encode(payload)));
        var res = await fetch(api('/submissions') + '?documentId=' + noticeId(seq) + '&key=' + encodeURIComponent(S.cfg.apiKey), {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { t: { stringValue: next.t }, k: { stringValue: sig }, iv: { stringValue: 'ctl1' }, c: { stringValue: payload } } }),
        });
        if (res.ok) {
          S.ctl = next; S.maxId = seq;
          toast((message || 'Publicado') + ' (#' + seq + '). Os sites aplicam em até 5 segundos.');
          return true;
        }
        if (res.status !== 409) throw new Error('O banco recusou o aviso (' + res.status + ').');
      }
      throw new Error('Não consegui um número livre para o aviso. Tente de novo.');
    } catch (e) {
      toast('Não publicou: ' + (e && e.message || e), true);
      return false;
    } finally {
      document.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      render();
    }
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
    if (id.indexOf('ctl-') === 0) return null;
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
      if (tv > S.newest) S.newest = tv; // also for settings notices, so they are not fetched again
      var e = await toEntry(rows[i].document);
      if (!e) continue;
      if (!S.entries.some(function (x) { return x.id === e.id; })) { S.entries.push(e); added++; }
      if (e.t > S.newest) S.newest = e.t;
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

  function viewMensagens() {
    var counts = { all: S.entries.length };
    S.entries.forEach(function (e) { counts[e.form] = (counts[e.form] || 0) + 1; });
    var wrap = h('div');
    var search = h('input', { type: 'search', id: 'msg-q', placeholder: 'Buscar', 'aria-label': 'Buscar nas mensagens', value: S.q });
    search.addEventListener('input', function (ev) { S.q = ev.target.value; drawRows(); });
    wrap.appendChild(h('div', { class: 'logbar' }, search,
      h('button', { class: 'btn', type: 'button', onclick: function () { pollMessages(true); } }, 'Atualizar'),
      h('button', { class: 'btn', type: 'button', onclick: function () {
        var a = h('a', { href: URL.createObjectURL(new Blob([csv(visibleEntries())], { type: 'text/csv;charset=utf-8' })), download: 'mensagens.csv' });
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      } }, 'Baixar CSV'),
      h('span', { class: 'muted small', id: 'msg-status' }, '')));
    var pills = h('div', { class: 'pills' });
    TYPES.forEach(function (t) {
      pills.appendChild(h('button', { type: 'button', 'aria-pressed': String(S.type === t[0]), onclick: function () { S.type = t[0]; render(); } }, t[1] + ' ' + (counts[t[0]] || 0)));
    });
    wrap.appendChild(pills);
    wrap.appendChild(h('div', { class: 'table-wrap' }, h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'Quando'), h('th', {}, 'Site'), h('th', {}, 'Tipo'), h('th', {}, 'Ref.'), h('th', {}, 'Detalhes'))), h('tbody', { id: 'msg-rows' }))));
    setTimeout(drawRows, 0);
    return wrap;
  }
  function typeName(f) { for (var i = 0; i < TYPES.length; i++) if (TYPES[i][0] === f) return TYPES[i][1]; return f; }
  function drawRows() {
    var body = $('msg-rows');
    if (!body) return;
    body.textContent = '';
    var list = visibleEntries();
    if (!list.length) { body.appendChild(h('tr', {}, h('td', { colspan: '5', class: 'muted' }, 'Nada por aqui ainda.'))); return; }
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
  async function pollMessages(manual) {
    try {
      var added = await loadMessages(false);
      if (S.tab === 'mensagens' && (added || manual)) render();
      var st = $('msg-status');
      if (st) st.textContent = S.entries.length + ' entradas · atualizado às ' + new Date().toLocaleTimeString('pt-BR');
      updateTabCounts();
    } catch (e) { var s2 = $('msg-status'); if (s2) s2.textContent = (e && e.message) || 'Não foi possível ler as mensagens.'; }
  }

  // ---- logins ---------------------------------------------------------------------------------

  function acct(user) { return ((S.ctl.accounts || {})[user]) || {}; }
  function blockButton(user, mode, label, area) {
    return h('button', { class: 'btn danger', type: 'button', onclick: function () {
      var msg = (document.getElementById('msg-' + user).value || '').trim() || DEFAULT_BLOCK;
      publish(function (n) { n.accounts = n.accounts || {}; var a = n.accounts[user] = n.accounts[user] || {}; a.blocked = true; a.mode = mode; a.message = msg; a.at = n.seq; }, 'Login ' + user + ' bloqueado');
    } }, label);
  }
  function viewLogins() {
    var wrap = h('div');
    wrap.appendChild(h('p', { class: 'note' }, 'Bloquear e esconder valem no navegador do jogador: quem entende de código consegue contornar. Para a mesa, funciona como um interruptor de verdade.'));
    (S.cfg.accounts || []).forEach(function (a) {
      var st = acct(a.user), blocked = !!st.blocked;
      var shown = false;
      var pw = h('span', { class: 'pw', text: '••••••••••' });
      var card = h('div', { class: 'card' });
      card.appendChild(h('div', { class: 'card-head' }, h('h3', { text: a.name + ' · ' + a.role }),
        h('span', { class: 'chip' + (blocked ? ' off' : ''), text: blocked ? 'Bloqueado' : 'Ativo' })));
      card.appendChild(h('dl', { class: 'creds' }, h('dt', { text: 'Usuário' }), h('dd', { class: 'mono', text: a.user }),
        h('dt', { text: 'Senha' }), h('dd', {}, pw, ' ',
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { shown = !shown; pw.textContent = shown ? a.pass : '••••••••••'; } }, 'mostrar'), ' ',
          h('button', { class: 'btn ghost', type: 'button', onclick: function () {
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(a.pass).then(function () { toast('Senha copiada.'); }, function () { toast('Não consegui copiar. Use "mostrar" e copie à mão.', true); });
          } }, 'copiar'))));
      card.appendChild(h('label', { for: 'msg-' + a.user, text: 'Mensagem que o jogador vê quando está bloqueado' }));
      card.appendChild(h('input', { id: 'msg-' + a.user, type: 'text', value: st.message || DEFAULT_BLOCK }));
      var actions = h('div', { class: 'row', style: 'margin-top:.7rem' });
      if (blocked) {
        actions.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: function () {
          publish(function (n) { var x = (n.accounts = n.accounts || {})[a.user] = (n.accounts[a.user] || {}); x.blocked = false; x.at = n.seq; }, 'Login ' + a.user + ' liberado');
        } }, 'Desbloquear'));
        actions.appendChild(h('span', { class: 'muted small', text: 'Modo atual: ' + ({ wait: 'vale no próximo login', now: 'derrubou a sessão', reload: 'recarregou a página' }[st.mode] || 'vale no próximo login') }));
      } else {
        actions.appendChild(blockButton(a.user, 'wait', 'Bloquear (vale no próximo login)'));
        actions.appendChild(blockButton(a.user, 'now', 'Bloquear agora (derruba a sessão)'));
        actions.appendChild(blockButton(a.user, 'reload', 'Bloquear e recarregar a página dele'));
      }
      card.appendChild(actions);
      card.appendChild(h('label', { for: 'note-' + a.user, text: 'Aviso que aparece no portal quando ele entra' }));
      card.appendChild(h('textarea', { id: 'note-' + a.user, text: st.note || '' }));
      card.appendChild(h('div', { class: 'row', style: 'margin-top:.5rem' },
        h('button', { class: 'btn', type: 'button', onclick: function () {
          var text = (document.getElementById('note-' + a.user).value || '').trim();
          publish(function (n) { var x = (n.accounts = n.accounts || {})[a.user] = (n.accounts[a.user] || {}); x.note = text; }, text ? 'Aviso salvo' : 'Aviso removido');
        } }, 'Salvar aviso')));
      wrap.appendChild(card);
    });
    if (!(S.cfg.accounts || []).length) wrap.appendChild(h('p', { class: 'muted', text: 'Nenhum login de portal encontrado no pacote.' }));
    return wrap;
  }

  // ---- documents ------------------------------------------------------------------------------

  function viewDocumentos() {
    var wrap = h('div');
    wrap.appendChild(h('p', { class: 'note' }, 'Desmarque um documento para escondê-lo daquele login e marque de novo para liberar. Documentos com data depois da data compartilhada (aba Data) ficam escondidos sozinhos.'));
    var today = S.ctl.today || S.cfg.baseDate;
    (S.cfg.accounts || []).forEach(function (a) {
      var hidden = (acct(a.user).hidden || []).slice();
      var card = h('div', { class: 'card' });
      card.appendChild(h('div', { class: 'card-head' }, h('h3', { text: a.name + ' (' + a.user + ')' })));
      var list = h('ul', { class: 'doclist' }), boxes = [];
      a.docs.forEach(function (d) {
        var box = h('input', { type: 'checkbox', id: 'doc-' + a.user + '-' + d.id, 'data-id': d.id, checked: hidden.indexOf(d.id) < 0 });
        boxes.push(box);
        var future = d.date > today;
        list.appendChild(h('li', {}, h('label', {}, box, h('span', {}, d.title), h('span', { class: 'num', text: d.number + ' · ' + d.date }),
          h('span', { class: 'muted small', text: d.classification }), future ? h('span', { class: 'chip warn', text: 'escondido pela data' }) : null)));
      });
      card.appendChild(list);
      card.appendChild(h('button', { class: 'btn primary', type: 'button', onclick: function () {
        var off = boxes.filter(function (b) { return !b.checked; }).map(function (b) { return b.getAttribute('data-id'); });
        publish(function (n) { var x = (n.accounts = n.accounts || {})[a.user] = (n.accounts[a.user] || {}); x.hidden = off; }, 'Documentos de ' + a.user + ' atualizados');
      } }, 'Aplicar'));
      wrap.appendChild(card);
    });
    return wrap;
  }

  // ---- notices --------------------------------------------------------------------------------

  function viewAvisos() {
    var wrap = h('div');
    wrap.appendChild(h('p', { class: 'note' }, 'O aviso aparece no topo de todas as páginas do site, ou cobre a tela inteira. Serve para uma queda de sistema, um comunicado ou "estamos fora do ar".'));
    (S.cfg.sites || []).forEach(function (site) {
      var cur = ((S.ctl.banner || {})[site]) || {};
      var on = !!(cur.on && cur.text);
      var card = h('div', { class: 'card' });
      card.appendChild(h('div', { class: 'card-head' }, h('h3', { text: site }), h('span', { class: 'chip' + (on ? '' : ' off'), text: on ? 'No ar' : 'Sem aviso' })));
      card.appendChild(h('label', { for: 'tone-' + site, text: 'Tipo' }));
      var sel = h('select', { id: 'tone-' + site });
      TONES.forEach(function (t) { sel.appendChild(h('option', { value: t[0], selected: (cur.tone || 'info') === t[0], text: t[1] })); });
      card.appendChild(sel);
      card.appendChild(h('label', { for: 'txt-' + site, text: 'Texto (em inglês, como o site)' }));
      card.appendChild(h('textarea', { id: 'txt-' + site, text: cur.text || '' }));
      card.appendChild(h('div', { class: 'row', style: 'margin-top:.6rem' },
        h('button', { class: 'btn primary', type: 'button', onclick: function () {
          var text = (document.getElementById('txt-' + site).value || '').trim();
          if (!text) { toast('Escreva o texto do aviso primeiro.', true); return; }
          var tone = document.getElementById('tone-' + site).value;
          publish(function (n) { n.banner = n.banner || {}; n.banner[site] = { on: true, text: text, tone: tone }; }, 'Aviso no ar em ' + site);
        } }, on ? 'Atualizar aviso' : 'Publicar aviso'),
        on ? h('button', { class: 'btn', type: 'button', onclick: function () {
          publish(function (n) { n.banner = n.banner || {}; n.banner[site] = { on: false, text: cur.text || '', tone: cur.tone || 'info' }; }, 'Aviso retirado de ' + site);
        } }, 'Retirar aviso') : null));
      wrap.appendChild(card);
    });
    return wrap;
  }

  // ---- vacancies ------------------------------------------------------------------------------

  function viewVagas() {
    var wrap = h('div');
    wrap.appendChild(h('p', { class: 'note' }, 'Uma vaga preenchida some do site da Kelvara (lista, contagem, formulário e diagrama), e os textos com "três vagas" se ajustam.'));
    (S.cfg.jobs || []).forEach(function (j) {
      var closed = ((S.ctl.jobs || {})[j.reference]) === 'closed';
      wrap.appendChild(h('div', { class: 'card' }, h('div', { class: 'card-head' },
        h('h3', { text: j.title + ' · ' + j.reference }), h('span', { class: 'chip' + (closed ? ' off' : ''), text: closed ? 'Preenchida' : 'Aberta' })),
        h('button', { class: closed ? 'btn primary' : 'btn danger', type: 'button', onclick: function () {
          publish(function (n) { n.jobs = n.jobs || {}; if (closed) delete n.jobs[j.reference]; else n.jobs[j.reference] = 'closed'; }, closed ? j.title + ' reaberta' : j.title + ' marcada como preenchida');
        } }, closed ? 'Reabrir vaga' : 'Marcar como preenchida')));
    });
    if (!(S.cfg.jobs || []).length) wrap.appendChild(h('p', { class: 'muted', text: 'Nenhuma vaga encontrada no pacote.' }));
    return wrap;
  }

  // ---- shared date ----------------------------------------------------------------------------

  function viewData() {
    var base = S.cfg.baseDate || '2028-10-19';
    var cur = S.ctl.today || base;
    var wrap = h('div');
    wrap.appendChild(h('p', { class: 'note' }, 'A data compartilhada vale para todos os sites, os atuais e os futuros. Notícias, vagas e documentos do portal com data depois dela ficam escondidos, e o ano do rodapé acompanha.'));
    var input = h('input', { type: 'date', id: 'date-in', value: cur });
    var apply = function (iso) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) { toast('Escolha uma data.', true); return; }
      publish(function (n) { if (iso === base) delete n.today; else n.today = iso; }, 'Data definida para ' + longDate(iso));
    };
    wrap.appendChild(h('div', { class: 'card' },
      h('div', { class: 'card-head' }, h('h3', { text: 'Data de hoje no jogo' }), h('span', { class: 'chip' + (S.ctl.today ? ' warn' : ''), text: S.ctl.today ? 'Alterada' : 'Padrão' })),
      h('p', { text: longDate(cur) }),
      h('div', { class: 'row' }, h('div', { class: 'grow' }, input),
        h('button', { class: 'btn primary', type: 'button', onclick: function () { apply($('date-in').value); } }, 'Aplicar')),
      h('div', { class: 'row', style: 'margin-top:.7rem' },
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, -1)); } }, '−1 dia'),
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, 1)); } }, '+1 dia'),
        h('button', { class: 'btn', type: 'button', onclick: function () { apply(addDays(cur, 7)); } }, '+1 semana'),
        h('button', { class: 'btn ghost', type: 'button', onclick: function () { apply(base); } }, 'Voltar ao padrão (' + longDate(base) + ')'))));
    wrap.appendChild(h('p', { class: 'muted small', text: 'Para liberar uma notícia no dia certo, escreva-a com data futura e marque scheduled: true no arquivo. Ela vai no código da página escondida e aparece quando a data compartilhada chega nela. Documentos do portal não têm esse limite: ficam dentro do pacote criptografado.' }));
    return wrap;
  }

  // ---- frame ----------------------------------------------------------------------------------

  function updateTabCounts() { var n = $('tab-msg-n'); if (n) n.textContent = String(S.entries.length); }
  function renderTabs() {
    var tabs = $('tabs');
    tabs.textContent = '';
    TABS.forEach(function (t) {
      var b = h('button', { type: 'button', role: 'tab', 'aria-selected': String(S.tab === t[0]), onclick: function () { S.tab = t[0]; render(); } }, t[1]);
      if (t[0] === 'mensagens') b.appendChild(h('span', { class: 'badge-n', id: 'tab-msg-n', text: String(S.entries.length) }));
      tabs.appendChild(b);
    });
  }
  function render() {
    if (!S.cfg) return;
    renderTabs();
    var body = $('tab-body');
    body.textContent = '';
    body.appendChild({ mensagens: viewMensagens, logins: viewLogins, documentos: viewDocumentos, avisos: viewAvisos, vagas: viewVagas, data: viewData }[S.tab]());
    var c = S.ctl;
    $('state-line').textContent = c.seq ? 'Último aviso publicado: #' + c.seq + ' em ' + new Date(c.t).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) + ' · data do jogo: ' + longDate(c.today || S.cfg.baseDate) : 'Nenhum aviso publicado ainda · data do jogo: ' + longDate(S.cfg.baseDate);
  }

  async function start(bundle) {
    var cfg = bundle.admin;
    if (!cfg.projectId || !cfg.apiKey) throw new Error('O pacote não tem o projeto do banco.');
    if (!cfg.privateJwk || !cfg.signJwk) throw new Error('O pacote não tem as chaves. Rode o gm-bundle de novo.');
    S.cfg = cfg; S.bundle = bundle; S.entries = []; S.newest = '';
    try { S.prevSeen = localStorage.getItem(SEEN_KEY) || ''; } catch (e) { S.prevSeen = ''; }
    S.priv = await crypto.subtle.importKey('jwk', cfg.privateJwk, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
    S.signKey = await crypto.subtle.importKey('jwk', cfg.signJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
    S.verifyKey = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: cfg.signJwk.x, y: cfg.signJwk.y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    lockScreen(false);
    await loadCtl().catch(function () { /* shown below */ });
    try { await loadMessages(true); } catch (e) { toast((e && e.message) || 'Não foi possível ler as mensagens.', true); }
    if (S.newest) { try { localStorage.setItem(SEEN_KEY, S.newest); } catch (e) { /* ignore */ } }
    render();
    S.timers.push(setInterval(function () { if (!document.hidden) pollMessages(false); }, 8000));
    // Pick up changes made from another device, without touching a form somebody is typing in.
    S.timers.push(setInterval(function () {
      if (document.hidden) return;
      var before = S.ctl.seq;
      loadCtl().then(function () {
        var a = document.activeElement, typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
        if (S.cfg && S.ctl.seq !== before && !typing) render();
      }, function () { /* ignore */ });
    }, 30000));
  }

  $('reload-all').addEventListener('click', function () {
    publish(function (n) { n.reload = n.seq; }, 'Pedido de recarregar enviado');
  });
  $('sign-out').addEventListener('click', function () {
    S.timers.forEach(clearInterval); S.timers = [];
    S.cfg = null; S.bundle = null; S.priv = null; S.signKey = null; S.entries = [];
    typed = '';
    lockScreen(true);
  });
})();
