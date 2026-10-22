/* Kelvara cookie notice. The visitor's choice is stored in localStorage only. */
(function () {
  'use strict';

  var KEY = 'kv_cookie_choice';
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }

  banner.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-consent]');
    if (!btn) return;
    write(btn.getAttribute('data-consent'));
    banner.hidden = true;
  });

  var reopen = document.getElementById('cookie-settings');
  if (reopen) {
    reopen.addEventListener('click', function (ev) {
      ev.preventDefault();
      banner.hidden = false;
    });
  }

  if (!read()) banner.hidden = false;
})();
