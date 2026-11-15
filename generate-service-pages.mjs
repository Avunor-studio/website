import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const origin = 'https://www.avunorstudio.store';
let home = readFileSync('public/index.html', 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
// Render real contact details into HTML as well as the interactive contact panel.
const configuration = { window: {} };
runInNewContext(readFileSync('public/config.js', 'utf8'), configuration);
const business = configuration.window.AVUNOR_CONTACT;
const contactLinks = [];
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email || '')) contactLinks.push(`<a class="button" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=${encodeURIComponent(business.email)}" target="_blank" rel="noopener noreferrer" aria-label="Email ${escape(business.email)} via Gmail (opens in a new tab)">${escape(business.email)} ↗</a>`);
const phone = (business.whatsapp || '').replace(/[\s+()-]/g, '');
if (/^[1-9]\d{6,14}$/.test(phone)) contactLinks.push(`<a class="button" href="https://wa.me/${phone}">WhatsApp ${escape(business.whatsapp)} ↗</a>`);
if (contactLinks.length) home = home.replace(/<div id="contact-links">[\s\S]*?<\/div>/, `<div id="contact-links">${contactLinks.join('')}</div>`);
writeFileSync('public/index.html', home);
const pages = [
  {
    file: 'website-development.html', name: 'Website development', title: 'Website Development Services | AVUNOR',
    description: 'Custom website development for startups and businesses worldwide. AVUNOR creates responsive business websites and landing pages. Discuss your project.',
    headline: 'Website development.<br>A clearer digital presence.',
    intro: 'A business website should help visitors understand what you do and take the next step. AVUNOR designs and develops responsive websites and landing pages for startups and businesses worldwide.',
    section: 'Give your business a home online.',
    explanation: 'We start with your audience and the questions they need answered. That direction shapes the page structure, content, navigation, and calls to action, whether you are launching your first website or replacing an existing one.',
    offerings: [
      ['Business websites', 'Introduce your business, explain your services, and make contact details easy to find. We organise the essential information into clear pages and sections so visitors can understand your offer.'],
      ['Landing pages', 'Present a product, campaign, or service with a focused message and a clear next step. Content and layout are shaped around the enquiry or action you want visitors to take.'],
      ['Responsive development', 'Build layouts that adapt across phones, tablets, laptops, and monitors. Navigation, text, images, and forms are checked at relevant screen sizes before launch.'],
    ],
    preparation: 'Share your business goals, audience, existing website if you have one, brand assets, required pages, and examples of designs you like. We use that information to agree on the scope and identify content that needs to be prepared.',
    faqs: [
      ['Can you work with customers worldwide?', 'Yes. AVUNOR offers website development to customers worldwide. Communication arrangements and delivery milestones are agreed when the project is scoped.'],
      ['Can you redesign an existing website?', 'We can discuss a redesign around your current content, business needs, and the problems you want to solve. Share the current URL and the changes you have in mind.'],
      ['Will the website work on mobile?', 'Responsive layouts are part of our website development approach. The pages and key interactions are checked on phone, tablet, and desktop-sized screens.'],
      ['How are cost and delivery dates decided?', 'They depend on the required pages, design work, content, and functionality. We agree on the project scope before confirming a quotation and delivery plan.'],
    ],
  },
  {
    file: 'mobile-app-development.html', name: 'Mobile app development', title: 'Mobile App Development Services | AVUNOR',
    description: 'Mobile app development for startups and businesses worldwide. Plan, design, and build iOS and Android app experiences with AVUNOR. Discuss your idea.',
    headline: 'Mobile app development.<br>Useful, from the first tap.',
    intro: 'Turn a service or product idea into an app experience people can understand and use. AVUNOR offers mobile app design and development for startups and businesses serving customers worldwide.',
    section: 'Start with the journey your users need.',
    explanation: 'An app begins with a clear purpose: who it helps, what they need to do, and why mobile is the right place for that task. We map the essential journeys before defining screens and development scope.',
    offerings: [
      ['iOS and Android experiences', 'Define the platforms your audience uses and plan a consistent experience around them. The development approach is selected during scoping based on the app’s requirements and constraints.'],
      ['Booking and service apps', 'Plan journeys such as discovering a service, choosing a time, and managing a booking. We identify the screens, information, and business rules needed for the agreed workflow.'],
      ['Product design and development', 'Connect interface design with the functionality behind it. We work through screen flows, interactions, and required integrations, then build and test the agreed version of the app.'],
    ],
    preparation: 'Bring a description of the problem, your intended users, target platforms, essential features, and any existing systems the app must connect to. If you have sketches or a prototype, those can help clarify the first version.',
    faqs: [
      ['Can we start with a smaller first version?', 'Yes. We can define an initial version around the core user journey, separating essential features from ideas that can be considered after launch.'],
      ['Do you plan for both iOS and Android?', 'We discuss the platforms your customers need during discovery. The project scope defines which platforms are included and how the app will be developed for them.'],
      ['What needs to be tested before launch?', 'The agreed user journeys, navigation, forms, and integrations need validation, including relevant device and screen-size checks. Testing is planned around the app’s features.'],
      ['Can international businesses work with AVUNOR?', 'Yes. We work with customers worldwide, agreeing on project communication, requirements, and milestones at the start.'],
    ],
  },
  {
    file: 'saas-development.html', name: 'SaaS development', title: 'SaaS Development Services | AVUNOR',
    description: 'SaaS development for startups and businesses worldwide. AVUNOR helps shape MVPs, dashboards, and business tools around real workflows. Discuss your product.',
    headline: 'SaaS development.<br>Make complex work simpler.',
    intro: 'Build software around a problem worth solving. AVUNOR offers SaaS product design and development for startups and businesses worldwide, from an initial MVP to dashboards and focused business tools.',
    section: 'Define the product before expanding it.',
    explanation: 'A useful SaaS product connects customer needs with clear workflows and business rules. We help shape the first release around the work users need to complete, rather than an unbounded feature list.',
    offerings: [
      ['MVP development', 'Identify the core customer problem and the smallest useful product scope. We turn those priorities into interface flows and an agreed implementation plan for the first release.'],
      ['Dashboards and business tools', 'Organise the information and actions users need in one interface. A dashboard can help people understand activity and take the next step within the workflows defined for your product.'],
      ['Product iteration', 'Use feedback from an existing version to decide what to improve next. We discuss usability issues, workflow changes, and additional features before defining the next development scope.'],
    ],
    preparation: 'Share the customer problem, intended users, essential workflows, business rules, and any existing product or prototype. Requirements for data, user access, and integrations should be discussed early so the scope is clear.',
    faqs: [
      ['What is included in a SaaS MVP?', 'That depends on the product. Discovery identifies the essential workflows and features needed for a useful first release; the agreed scope defines what will be built.'],
      ['Can you work on an existing SaaS product?', 'We can discuss improvements to an existing product after reviewing its current workflows, technical setup, and the changes you need.'],
      ['How are features prioritised?', 'We start with the tasks your users need to complete and the problem the product solves. Additional ideas can be grouped into later releases instead of expanding the initial build indefinitely.'],
      ['Do you offer SaaS development worldwide?', 'Yes. AVUNOR serves customers worldwide. Project communication and delivery milestones are agreed during scoping.'],
    ],
  },
];
const contact = home.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0];
if (!contact) throw new Error('Missing shared contact section');
for (const page of pages) {
  const url = origin + '/' + page.file;
  let html = home.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(page.description)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escape(page.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escape(page.description)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escape(page.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escape(page.description)}">`)
    .replace('<script src="reviews.js" defer></script>', '');
  const graph = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const webPage = graph['@graph'].find(item => item['@type'] === 'WebPage');
  Object.assign(webPage, { '@id': url + '#webpage', url, name: page.title, description: page.description, mainEntity: { '@id': url + '#service' } });
  graph['@graph'].push(
    { '@type': 'Service', '@id': url + '#service', name: page.name, serviceType: page.name, url, description: page.description, areaServed: 'Worldwide', provider: { '@id': origin + '/#organization' } },
    {
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: page.name, item: url },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: page.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  );
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(graph)}</script>`);
  const related = pages.filter(other => other !== page).map(other => `<a href="${other.file}">${other.name} <span aria-hidden="true">↗</span></a>`).join('');
  const content = `<main id="main" class="service-detail"><section class="wrap service-detail-hero"><a class="service-back" href="/#services">← All services</a><p class="eyebrow">AVUNOR / SERVICES FOR CUSTOMERS WORLDWIDE</p><h1>${page.headline}</h1><p class="service-lead">${page.intro}</p><a class="button" href="#contact">Discuss your project <span aria-hidden="true">↗</span></a></section><section class="section services"><div class="wrap"><h2>${page.section}</h2><p class="service-explanation">${page.explanation}</p><div class="service-grid">${page.offerings.map(([title,description]) => `<article><h3>${title}</h3><p>${description}</p></article>`).join('')}</div></div></section><section class="section wrap"><p class="eyebrow">GETTING STARTED</p><h2>Bring your idea.<br>We’ll shape the next step.</h2><p class="service-explanation">${page.preparation}</p><ol class="service-process"><li><strong>Discover</strong><span>Agree on your audience, goals, and project scope.</span></li><li><strong>Design</strong><span>Map the key journeys and review the interface direction.</span></li><li><strong>Build</strong><span>Develop and test the agreed features, sharing progress along the way.</span></li><li><strong>Launch</strong><span>Prepare the release and hand over the completed project.</span></li></ol></section><section class="section service-faq-section"><div class="wrap"><h2>Your questions, answered.</h2><div class="service-faq">${page.faqs.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></div></section><section class="section wrap related-services"><p class="eyebrow">EXPLORE MORE</p><h2>More ways to build.</h2><nav aria-label="Related services">${related}</nav></section>${contact}</main>`;
  html = html.replace(/<main id="main">[\s\S]*?<\/main>/, content);
  html = html.replaceAll('href="#" class="brand"', 'href="/" class="brand"');
  for (const anchor of ['services', 'completed-projects', 'approach', 'reviews']) html = html.replaceAll(`href="#${anchor}"`, `href="/#${anchor}"`);
  writeFileSync('public/' + page.file, html);
}
const urls = [origin + '/', ...pages.map(page => origin + '/' + page.file)];
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url=>`  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log('Generated three service pages and the four-page sitemap.');
