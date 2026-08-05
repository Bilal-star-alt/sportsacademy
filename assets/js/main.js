const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-navigation');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('.main-navigation a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const googleFormEndpoint = 'https://docs.google.com/forms/d/e/1FAIpQLSebivWbzxA-8i3GZ9TGWqmw5A-oHCiDSzHffmiVRvsVw4c2Ig/formResponse';

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const selectedSports = formData.getAll('sports').join(', ');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  formStatus.textContent = 'Sending your enquiry…';
  submitButton.disabled = true;

  const googleFormData = new URLSearchParams({
    'entry.1950664988': formData.get('name'),
    'entry.447491214': formData.get('email'),
    'entry.2039856179': formData.get('mobile'),
    'entry.1436272463': selectedSports || 'Not selected',
    'entry.399795905': formData.get('message'),
  });

  try {
    await fetch(googleFormEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: googleFormData.toString(),
    });
    formStatus.textContent = 'Thanks! Your enquiry has been sent.';
    contactForm.reset();
  } catch {
    formStatus.textContent = 'We could not send your enquiry. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

const coachForm = document.querySelector('#coach-form');
const coachQuestion = document.querySelector('#coach-question');
const chatMessages = document.querySelector('#chat-messages');
const config = window.academyConfig || {};
let academyKnowledge = [];

function parseKnowledge(text) {
  return text.trim().split(/\n\s*\n/).map((entry) => {
    const tags = entry.match(/^Tags:\s*(.*)$/m)?.[1].toLowerCase().split(',').map((tag) => tag.trim()) || [];
    const question = entry.match(/^Q:\s*(.*)$/m)?.[1] || '';
    const answer = entry.match(/^A:\s*(.*)$/m)?.[1] || '';
    return { tags, question, answer };
  }).filter((entry) => entry.question && entry.answer);
}

function fillAcademyDetails(answer) {
  return answer
    .replace('{{timings}}', config.timings || 'Please contact the academy for current timings.')
    .replace('{{fees}}', config.fees || 'Please contact the academy for current fees.')
    .replace('{{registration}}', config.registration || 'Please contact the academy to register.')
    .replace('{{contact}}', config.contact || 'the academy');
}

async function loadAcademyKnowledge() {
  try {
    const knowledgeUrl = new URL('assets/data/academy-knowledge.txt', window.location.href);
    const response = await fetch(knowledgeUrl);
    if (!response.ok) throw new Error('Knowledge base unavailable');
    academyKnowledge = parseKnowledge(await response.text());
  } catch {
    academyKnowledge = [];
  }
}

const academyKnowledgeReady = loadAcademyKnowledge();

function coachReply(question) {
  const normalized = question.toLowerCase();
  const matchingEntry = academyKnowledge.map((entry) => ({
    ...entry,
    score: (normalized.includes(entry.question.toLowerCase()) ? 1000 : 0) + entry.tags.reduce((score, tag) => score + (normalized.includes(tag) ? tag.length : 0), 0),
  })).sort((first, second) => second.score - first.score)[0];
  if (matchingEntry?.score > 0) return fillAcademyDetails(matchingEntry.answer);
  if (/(8.year|eight.year|child|kid|young)/.test(normalized) && /(sport|suit|recommend)/.test(normalized)) {
    return 'For an 8-year-old, try a few sports before choosing one. Soccer, basketball, swimming, tennis, and athletics are great for building coordination, confidence, and teamwork. The best fit is the sport they enjoy and want to return to.';
  }
  if (/(equipment|gear|need|bring)/.test(normalized)) {
    return 'Start with comfortable sportswear, a water bottle, and trainers suited to the activity. Your coach can confirm any sport-specific equipment, such as a soccer ball, cricket bat, or swimwear, before the first session.';
  }
  if (/(timing|time|schedule|open|hour)/.test(normalized)) return config.timings;
  if (/(fee|cost|price|payment|how much)/.test(normalized)) return config.fees;
  if (/(register|registration|sign.?up|join|enrol|enroll)/.test(normalized)) return config.registration;
  return `I can help with sports for children, equipment, timings, fees, and registration. For a specific question, please contact us at ${config.contact || 'the academy'}.`;
}

function addChatMessage(text, sender) {
  const message = document.createElement('article');
  message.className = `chat-message chat-message--${sender}`;
  const name = sender === 'assistant' ? 'AI Coach' : 'You';
  message.innerHTML = `<strong>${name}</strong><p></p>`;
  message.querySelector('p').textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function askCoach(question) {
  const cleanedQuestion = question.trim();
  if (!cleanedQuestion) return;
  addChatMessage(cleanedQuestion, 'user');
  const loadingMessage = document.createElement('article');
  loadingMessage.className = 'chat-message chat-message--assistant chat-message--loading';
  loadingMessage.innerHTML = '<strong>AI Coach</strong><p>Finding the best answer…</p>';
  chatMessages.append(loadingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  await academyKnowledgeReady;
  loadingMessage.remove();
  addChatMessage(coachReply(cleanedQuestion), 'assistant');
}

coachForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  askCoach(coachQuestion.value);
  coachQuestion.value = '';
  coachQuestion.focus();
});

document.querySelectorAll('.quick-questions button').forEach((button) => {
  button.addEventListener('click', () => askCoach(button.textContent));
});

const coachLauncher = document.querySelector('#coach-launcher');
const coachAssistant = document.querySelector('#coach-assistant');
const coachClose = document.querySelector('#coach-close');

function setCoachOpen(isOpen) {
  coachAssistant.classList.toggle('is-open', isOpen);
  coachAssistant.setAttribute('aria-hidden', String(!isOpen));
  coachLauncher.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) coachQuestion.focus();
}

coachLauncher?.addEventListener('click', () => setCoachOpen(true));
coachClose?.addEventListener('click', () => setCoachOpen(false));
