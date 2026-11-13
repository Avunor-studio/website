const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.addEventListener('pointerdown', event => { if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu(); });
matchMedia('(min-width: 1001px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
const contact = window.AVUNOR_CONTACT || {};
const holder = document.querySelector('#contact-links');
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email || '');
const phone = (contact.whatsapp || '').replace(/[\s+()-]/g, '');
const validPhone = /^[1-9]\d{6,14}$/.test(phone);
const contactActions = {
  gmail: validEmail ? { label: contact.email + ' ↗', title: 'Email via Gmail', detail: contact.email, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(contact.email), newTab: true } : null,
  mailApp: validEmail ? { label: 'Use another email app ↗', href: 'mailto:' + contact.email } : null,
  whatsapp: validPhone ? { label: 'WhatsApp ' + contact.whatsapp + ' ↗', title: 'WhatsApp', detail: contact.whatsapp, href: 'https://wa.me/' + phone } : null,
  call: validPhone ? { label: 'Call ' + contact.whatsapp, title: 'Call us', detail: contact.whatsapp, href: 'tel:+' + phone } : null,
};
function contactLink(action, className = 'button') {
  const link = document.createElement('a');
  link.textContent = action.label;
  link.href = action.href;
  link.className = className;
  if (action.newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Email ' + contact.email + ' via Gmail (opens in a new tab)');
  }
  return link;
}
if (validEmail || validPhone) holder.replaceChildren();
if (validEmail) {
  const group = document.createElement('div');
  group.className = 'contact-email-group';
  const gmail = contactLink(contactActions.gmail);
  const mailApp = contactLink(contactActions.mailApp, 'contact-email-app');
  group.append(gmail, mailApp);
  holder.append(group);
}
if (validPhone) holder.append(contactLink(contactActions.whatsapp));

const launcher = document.querySelector('#contact-launcher');
const panel = document.querySelector('#contact-panel');
const panelActions = document.querySelector('#contact-panel-actions');
for (const action of [contactActions.call, contactActions.whatsapp, contactActions.gmail].filter(Boolean)) {
  const link = contactLink(action, 'panel-contact-action');
  const title = document.createElement('strong'); title.textContent = action.title;
  const detail = document.createElement('span'); detail.textContent = action.detail;
  link.replaceChildren(title, detail);
  panelActions.append(link);
}
if (contactActions.mailApp) panelActions.append(contactLink(contactActions.mailApp, 'contact-email-app'));
if (validEmail || validPhone) launcher.hidden = false;
function closeContactPanel() {
  if (panel.hidden) return;
  panel.hidden = true;
  launcher.setAttribute('aria-expanded', 'false');
  launcher.focus({ preventScroll: true });
}
launcher.addEventListener('click', () => {
  if (!panel.hidden) { closeContactPanel(); return; }
  closeMenu();
  panel.hidden = false;
  panel.scrollTop = 0;
  launcher.setAttribute('aria-expanded', 'true');
  panel.querySelector('a').focus({ preventScroll: true });
});
panel.querySelector('.contact-panel-close').addEventListener('click', closeContactPanel);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closeContactPanel(); } });
// Close after an outside click so a normal pointer focus change cannot override restoration.
document.addEventListener('click', event => { if (!panel.hidden && !panel.contains(event.target) && !launcher.contains(event.target)) closeContactPanel(); });
menu.addEventListener('click', () => { if (!panel.hidden) closeContactPanel(); });
