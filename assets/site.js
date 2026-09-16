/* MASOON TREUHAND V2
   JavaScript nur für Verhalten und Interaktion.
   Keine CSS-Regeln oder Style-Injections in dieser Datei.
*/

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
