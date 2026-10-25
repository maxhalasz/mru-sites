/* Sends what visitors submit to the game master's private Google Sheet (see docs/REGISTRO.md).
   Nothing is sent until an address is set in log-config.js. Passwords are never collected. */
(function () {
  'use strict';

  function labelFor(el) {
    var short = el.getAttribute('data-label');
    if (short) return short;
    var l = el.id && document.querySelector('label[for="' + el.id + '"]');
    if (!l) l = el.closest('label');
    return (l ? l.textContent : el.name || el.id || 'Field').replace(/\s+/g, ' ').trim().slice(0, 90);
  }

  function collect(form) {
    var out = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      var t = el.type;
      if (!el.tagName || t === 'submit' || t === 'button' || t === 'reset' || t === 'password' || el.hasAttribute('data-hp')) return;
      var v;
      if (t === 'checkbox') v = el.checked ? 'yes' : 'no';
      else if (t === 'radio') { if (!el.checked) return; v = el.value; }
      else if (el.tagName === 'SELECT') v = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
      else v = el.value;
      out.push({ label: labelFor(el), value: String(v).slice(0, 2000) });
    });
    return out;
  }

  function send(kind, ref, fields) {
    var c = window.SITE_LOG;
    if (!c || !c.url) return;
    var b = new URLSearchParams();
    b.set('site', c.site || '');
    b.set('form', kind);
    b.set('ref', ref || '');
    b.set('page', location.pathname);
    b.set('lang', document.documentElement.lang || '');
    b.set('ua', navigator.userAgent || '');
    b.set('fields', JSON.stringify(fields || []));
    try {
      fetch(c.url, { method: 'POST', mode: 'no-cors', body: b, keepalive: true });
    } catch (e) { /* the visitor never sees logging problems */ }
  }

  // Hidden field that only bots fill in.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-log]').forEach(function (f) {
      var hp = document.createElement('input');
      hp.type = 'text';
      hp.name = 'website';
      hp.tabIndex = -1;
      hp.autocomplete = 'off';
      hp.setAttribute('aria-hidden', 'true');
      hp.setAttribute('data-hp', '');
      hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
      f.appendChild(hp);
    });
  });

  window.siteLog = { collect: collect, send: send };
})();
