/*
 * js/pages/signin.js — Sign-in / create-account page
 * Path: js/pages/signin.js · Owner: Part 1 · Purpose: tabbed sign-in, register and forgot-password forms via SITE.submit
 * Depends on: SITE, UI (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var cls = UI.cls, root = document.getElementById('auth-forms');
    var hm = document.getElementById('hero-mount');
    if (hm) hm.remove();
    if (!root) return;

    function submitBtn(label) { return '<button type="submit" class="' + cls.btnInk + ' w-full">' + UI.esc(label) + UI.icon('arrow-right', 'h-5 w-5') + '</button>'; }
    function toggle(target) {
      return '<button type="button" data-toggle-password="f-' + target + '" aria-pressed="false" class="mt-2 inline-flex min-h-[44px] items-center gap-2 font-mono text-xs font-bold uppercase underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + UI.icon('eye', 'h-4 w-4') + '<span>Show password</span></button>';
    }
    var terms = 'I agree to the terms of use and understand that this site is not for emergencies.';

    var signinForm = '<form id="signin-form" novalidate data-component="SignInForm" class="space-y-5">' +
      UI.field({ label: 'Mobile number or email', name: 'identifier', required: true, autocomplete: 'username' }) +
      '<div>' + UI.field({ label: 'Password', name: 'password', type: 'password', required: true, autocomplete: 'current-password' }) + toggle('password') + '</div>' +
      UI.field({ type: 'checkbox', name: 'remember', labelHTML: 'Remember me on this device' }) +
      submitBtn('Sign in') +
      '<p><button type="button" data-view="forgot" class="min-h-[44px] font-mono text-xs font-bold uppercase underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">Forgot password?</button></p></form>';
    var forgotForm = '<form id="forgot-form" novalidate data-component="ForgotPasswordForm" class="space-y-5"><h2 class="' + cls.h3 + '">Reset your password</h2>' +
      '<p class="leading-relaxed">Enter the mobile number or email you used to register. If an account matches, we will send reset instructions.</p>' +
      UI.field({ label: 'Mobile number or email', name: 'forgot-identifier', required: true, autocomplete: 'username' }) + submitBtn('Send reset instructions') +
      '<p><button type="button" data-view="signin" class="min-h-[44px] font-mono text-xs font-bold uppercase underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">Back to sign in</button></p></form>';
    var registerForm = '<form id="register-form" novalidate data-component="RegisterForm" class="space-y-5">' +
      UI.field({ label: 'Full name', name: 'reg-name', required: true, autocomplete: 'name', minlength: 3 }) +
      UI.field({ label: 'Mobile number', name: 'reg-phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel' }) +
      UI.field({ label: 'Email', name: 'reg-email', type: 'email', required: true, autocomplete: 'email' }) +
      '<div>' + UI.field({ label: 'Password', name: 'reg-password', type: 'password', required: true, minlength: 8, autocomplete: 'new-password', hint: 'At least 8 characters. Mix letters, numbers and symbols.' }) + toggle('reg-password f-reg-confirm') +
      '<div class="mt-3 flex gap-2" aria-hidden="true">' + [0, 1, 2, 3].map(function () { return '<span data-seg class="h-3 flex-1 border-2 border-ink bg-white"></span>'; }).join('') + '</div>' +
      '<p id="strength-label" role="status" aria-live="polite" class="mt-2 ' + cls.mono + '">Strength: enter a password</p></div>' +
      UI.field({ label: 'Confirm password', name: 'reg-confirm', type: 'password', required: true, autocomplete: 'new-password' }) +
      UI.field({ type: 'checkbox', name: 'reg-terms', required: true, labelHTML: UI.esc(terms) }) + submitBtn('Create account') + '</form>';

    root.innerHTML = '<div data-tabs data-component="AuthTabs"><div role="tablist" aria-label="Account options" class="flex flex-wrap gap-3">' +
      '<button type="button" role="tab" id="tab-signin" data-tab="signin" aria-selected="true" aria-controls="panel-signin" class="' + cls.tab + '">Sign in</button>' +
      '<button type="button" role="tab" id="tab-register" data-tab="register" aria-selected="false" aria-controls="panel-register" class="' + cls.tab + '">Create account</button></div>' +
      '<div role="tabpanel" id="panel-signin" data-tab-panel="signin" aria-labelledby="tab-signin" class="mt-8"><div id="signin-view">' + signinForm + '</div><div id="forgot-view" class="hidden">' + forgotForm + '</div></div>' +
      '<div role="tabpanel" id="panel-register" data-tab-panel="register" aria-labelledby="tab-register" class="mt-8 hidden">' + registerForm + '</div></div>' +
      '<p class="mt-10 border-t-4 border-ink pt-4 text-sm leading-relaxed">This site is not for emergencies. In a crisis call ' + UI.esc(SITE.contact.nationalEmergency) + ' or go to the nearest hospital emergency department.</p>';
    UI.mount(root);
    var help = document.getElementById('help-actions');
    if (help) help.innerHTML = '<a href="tel:' + SITE.contact.phone.e164 + '" class="' + cls.btnLime + ' !px-4 !py-2.5 text-xs">' + UI.icon('phone', 'h-4 w-4') + UI.esc(SITE.contact.phone.display) + '</a>';

    /* show / hide password */
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-toggle-password]');
      if (t) {
        var inputs = t.getAttribute('data-toggle-password').split(' ').map(function (id) { return document.getElementById(id); }), show = inputs[0].type === 'password';
        inputs.forEach(function (input) { input.type = show ? 'text' : 'password'; });
        t.setAttribute('aria-pressed', String(show));
        t.innerHTML = UI.icon(show ? 'eye-off' : 'eye', 'h-4 w-4') + '<span>' + (show ? 'Hide password' : 'Show password') + '</span>';
      }
      var v = e.target.closest('[data-view]');
      if (v) {
        var forgot = v.getAttribute('data-view') === 'forgot';
        document.getElementById('signin-view').classList.toggle('hidden', forgot);
        document.getElementById('forgot-view').classList.toggle('hidden', !forgot);
      }
    });

    /* live password strength meter */
    var COLORS = ['bg-alert', 'bg-tang', 'bg-lime', 'bg-ultra'], LABELS = ['Weak', 'Fair', 'Good', 'Strong'];
    var pw = document.getElementById('f-reg-password'), segs = UI.qsa('[data-seg]', root);
    pw.addEventListener('input', function () {
      var v = pw.value, score = 0;
      if (v.length >= 8) score++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
      segs.forEach(function (s, i) {
        COLORS.forEach(function (c) { s.classList.remove(c); });
        s.classList.toggle('bg-white', i >= score);
        if (i < score) s.classList.add(COLORS[score - 1]);
      });
      document.getElementById('strength-label').textContent = 'Strength: ' + (v ? LABELS[Math.max(0, score - 1)] : 'enter a password');
    });

    /* shared submit flow */
    function wire(form, name, payloadFn, title, message, redirect, extraCheck) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = UI.validateForm(form);
        if (ok && extraCheck && !extraCheck(form)) ok = false;
        if (!ok) return;
        var btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.classList.add('opacity-60');
        SITE.submit(name, payloadFn(form.elements)).then(function (res) {
          var box = document.createElement('div');
          box.setAttribute('role', 'status');
          box.tabIndex = -1;
          box.className = 'border-4 border-ink bg-lime p-6 text-ink shadow-hard';
          box.innerHTML = '<p class="' + cls.mono + '">' + UI.icon('check-circle', 'mr-2 inline h-5 w-5') + 'Done</p><h2 class="' + cls.h3 + ' mt-3">' + UI.esc(title) + '</h2><p class="mt-3 leading-relaxed">' + UI.esc(message) + '</p><p class="mt-4 ' + cls.mono + '">Reference: ' + UI.esc(res.id) + '</p>';
          form.replaceWith(box);
          box.focus();
          UI.toast(title, 'success');
          if (redirect) setTimeout(function () { window.location.href = SITE.routes.appointment; }, 1400);
        });
      });
    }
    wire(document.getElementById('signin-form'), 'signin', function (f) { return { identifier: f.identifier.value.trim(), remember: f.remember.checked }; }, 'You are signed in', 'Taking you to appointments now.', true);
    wire(document.getElementById('forgot-form'), 'forgot-password', function (f) { return { identifier: f['forgot-identifier'].value.trim() }; }, 'Check your messages', 'If an account matches, reset instructions are on their way.', false);
    wire(document.getElementById('register-form'), 'register', function (f) { return { fullName: f['reg-name'].value.trim(), phone: f['reg-phone'].value.trim(), email: f['reg-email'].value.trim(), acceptedTerms: f['reg-terms'].checked }; }, 'Account created', 'Taking you to appointments now.', true, function (form) {
      var a = form.elements['reg-password'], b = form.elements['reg-confirm'], m = form.querySelector('[data-error-for="reg-confirm"]'), same = a.value === b.value;
      b.setAttribute('aria-invalid', same ? 'false' : 'true');
      m.textContent = same ? '' : 'Passwords do not match.';
      m.classList.toggle('hidden', same);
      if (!same) b.focus();
      return same;
    });
  });
})();
