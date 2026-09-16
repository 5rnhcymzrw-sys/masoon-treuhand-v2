/* MASOON TREUHAND V2
   JavaScript nur für Verhalten und Interaktion.
   Keine CSS-Regeln oder Style-Injections in dieser Datei.
*/

/* KOPFZEILE: beim Herunterscrollen ausblenden, beim Hochscrollen schwarz einblenden
   Beispiel: Seite nach unten scrollen und danach wieder nach oben */
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  let lastScrollY = window.scrollY;

  if (lastScrollY > 2) {
    siteHeader.classList.add('is-scrolling-up');
  }

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - lastScrollY;

    if (currentScrollY <= 2) {
      siteHeader.classList.remove('is-scrolling-down', 'is-scrolling-up');
      lastScrollY = 0;
      return;
    }

    if (Math.abs(scrollDifference) < 4) {
      return;
    }

    if (scrollDifference > 0) {
      siteHeader.classList.add('is-scrolling-down');
      siteHeader.classList.remove('is-scrolling-up');
    } else {
      siteHeader.classList.add('is-scrolling-up');
      siteHeader.classList.remove('is-scrolling-down');
    }

    lastScrollY = currentScrollY;
  }, { passive:true });
}

/* KONTAKTFORMULAR: individuelle Fehlermeldungen für Pflichtfelder
   Beispiel: "Bitte geben Sie Ihren Nachnamen ein." */
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const validationMessages = {
    nachname: 'Bitte geben Sie Ihren Nachnamen ein.',
    vorname: 'Bitte geben Sie Ihren Vornamen ein.',
    email: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
    nachricht: 'Bitte geben Sie eine Nachricht ein.'
  };

  Object.entries(validationMessages).forEach(([fieldId, message]) => {
    const field = contactForm.querySelector(`#${fieldId}`);
    if (!field) return;

    field.addEventListener('invalid', () => {
      field.setCustomValidity('');

      if (field.validity.valueMissing) {
        field.setCustomValidity(message);
      } else if (fieldId === 'email' && field.validity.typeMismatch) {
        field.setCustomValidity('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      }
    });

    field.addEventListener('input', () => {
      field.setCustomValidity('');
    });
  });

  /* KONTAKTFORMULAR TESTANSICHT: Erfolg oder Fehler ohne echten Versand anzeigen
     Beispiel: "Vielen Dank für Ihre Anfrage." */
  const previewState = new URLSearchParams(window.location.search).get('formular-test');
  const response = contactForm.querySelector('.contact-form__response');
  const responseTitle = contactForm.querySelector('.contact-form__response-title');
  const responseCopy = contactForm.querySelector('.contact-form__response-copy');

  if (response && responseTitle && responseCopy && (previewState === 'erfolg' || previewState === 'fehler')) {
    contactForm.classList.add('is-preview-status');
    response.hidden = false;

    if (previewState === 'fehler') {
      contactForm.classList.add('is-preview-error');
      responseTitle.innerHTML = 'Ihre Nachricht konnte<br>nicht gesendet werden.';
      responseCopy.replaceChildren(
        'Bitte versuchen Sie es erneut oder',
        document.createElement('br'),
        'kontaktieren Sie uns direkt per E-Mail.'
      );
    }
  }
}
