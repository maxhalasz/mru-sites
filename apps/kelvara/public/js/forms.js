/* Form handling. Each form shows an on-page confirmation with a reference number, and the enquiry
   is passed on to the support queue (see site-log.js). */
(function () {
  'use strict';

  // "Apply now" on a vacancy preselects that position in the application form.
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-apply]');
    if (!a) return;
    var sel = document.getElementById('a-job');
    if (sel) sel.value = a.getAttribute('data-apply');
  });

  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    if (!form || !form.hasAttribute('data-confirm')) return;
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var bot = form.querySelector('[data-hp]');
    if (bot && bot.value) return;

    var box = document.getElementById(form.getAttribute('data-confirm'));
    var out = box && box.querySelector('[data-ref]');
    var prefix = form.getAttribute('data-ref-prefix') || 'KV';
    var ref = prefix + '-' + Math.floor(10000 + Math.random() * 89999);
    if (out) out.textContent = ref;

    if (window.siteLog && form.hasAttribute('data-log')) {
      window.siteLog.send(form.getAttribute('data-log'), ref, window.siteLog.collect(form));
    }

    if (box) {
      box.hidden = false;
      box.setAttribute('tabindex', '-1');
      box.focus();
    }
    form.hidden = true;
  });
})();
