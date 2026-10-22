/* Forms: nothing is sent anywhere. Each form shows an on-page confirmation with a reference number. */
(function () {
  'use strict';

  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    if (!form || !form.hasAttribute('data-confirm')) return;
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var box = document.getElementById(form.getAttribute('data-confirm'));
    var out = box && box.querySelector('[data-ref]');
    var prefix = form.getAttribute('data-ref-prefix') || 'KV';
    if (out) out.textContent = prefix + '-' + Math.floor(10000 + Math.random() * 89999);
    if (box) {
      box.hidden = false;
      box.setAttribute('tabindex', '-1');
      box.focus();
    }
    form.hidden = true;
  });
})();
