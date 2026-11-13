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
const links = [];
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email || '')) links.push([contact.email + ' ↗', 'mailto:' + contact.email]);
const phone = (contact.whatsapp || '').replace(/[\s+()-]/g, '');
if (/^[1-9]\d{6,14}$/.test(phone)) links.push(['WhatsApp ' + contact.whatsapp + ' ↗', 'https://wa.me/' + phone]);
if (links.length) { const holder = document.querySelector('#contact-links'); holder.replaceChildren(); links.forEach(([label, href]) => { const link = document.createElement('a'); link.className = 'button'; link.textContent = label; link.href = href; holder.append(link); }); }
