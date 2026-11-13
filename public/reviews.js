const list = document.querySelector('#client-reviews');
const status = document.querySelector('#reviews-status');
const form = document.querySelector('#review-form');
const feedback = document.querySelector('#review-feedback');
let submissionId = crypto.randomUUID();
const anonymous = form.elements.anonymous;
const nameInput = form.elements.name;
anonymous.addEventListener('change', () => {
  nameInput.disabled = anonymous.checked;
  nameInput.required = !anonymous.checked;
});
function showReview(review, prepend = false) {
  if (document.getElementById('review-' + review.id)) return;
  const article = document.createElement('article');
  article.id = 'review-' + review.id;
  article.className = 'review-card';
  const stars = document.createElement('p'); stars.className = 'stars'; stars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating); stars.setAttribute('aria-label', review.rating + ' out of 5 stars');
  const quote = document.createElement('blockquote'); quote.textContent = review.text;
  const author = document.createElement('p'); author.className = 'review-author'; author.textContent = review.name + ' · ' + review.project;
  article.append(stars, quote, author);
  prepend ? list.prepend(article) : list.append(article);
}
async function loadReviews() {
  try {
    const response = await fetch('/api/reviews');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    data.reviews.forEach(review => showReview(review));
    status.textContent = data.reviews.length ? 'Feedback shared by clients. Project completion is self-reported.' : 'No client reviews yet. Your feedback could be the first.';
  } catch { status.textContent = 'Client reviews couldn’t load. Please refresh to try again.'; }
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button'); button.disabled = true;
  feedback.classList.remove('review-feedback-error'); feedback.textContent = 'Submitting your review…';
  const values = new FormData(form);
  try {
    const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: submissionId, name: values.has('anonymous') ? 'Anonymous client' : values.get('name'), project: values.get('project'), text: values.get('text'), rating: Number(values.get('rating')), completed: values.has('completed'), consent: values.has('consent') }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Your review couldn’t be saved. Please try again.');
    showReview(data.review, true); form.reset(); nameInput.disabled = false; nameInput.required = true; submissionId = crypto.randomUUID();
    feedback.textContent = 'Thank you! Your review has been saved and is now displayed above.';
    status.textContent = 'Feedback shared by clients. Project completion is self-reported.';
  } catch (error) { feedback.classList.add('review-feedback-error'); feedback.textContent = error.message || 'Your review couldn’t be saved. Please try again.'; }
  finally { button.disabled = false; }
});
loadReviews();
