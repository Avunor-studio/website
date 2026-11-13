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
function contactLink(label, href, primary = true) {
  const link = document.createElement('a');
  link.textContent = label;
  link.href = href;
  link.className = primary ? 'button' : 'contact-email-app';
  return link;
}
if (validEmail || validPhone) holder.replaceChildren();
if (validEmail) {
  const group = document.createElement('div');
  group.className = 'contact-email-group';
  const gmail = contactLink(contact.email + ' ↗', 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(contact.email));
  gmail.target = '_blank';
  gmail.rel = 'noopener noreferrer';
  gmail.setAttribute('aria-label', 'Email ' + contact.email + ' via Gmail (opens in a new tab)');
  const mailApp = contactLink('Use another email app ↗', 'mailto:' + contact.email, false);
  group.append(gmail, mailApp);
  holder.append(group);
}
if (validPhone) holder.append(contactLink('WhatsApp ' + contact.whatsapp + ' ↗', 'https://wa.me/' + phone));
