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
