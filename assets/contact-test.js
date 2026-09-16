/* MASOON TREUHAND V2
   Testseite für Kontaktformularzustände.
   Es werden keine Nachrichten versendet.
*/

const testForm = document.querySelector('.contact-test-form');
const testFields = document.querySelector('.contact-test__fields');
const successView = document.querySelector('.contact-test__response--success');
const errorView = document.querySelector('.contact-test__response--error');
const testButtons = document.querySelectorAll('[data-test-view]');

const showTestView = view => {
  if (!testForm || !testFields || !successView || !errorView) return;

  testFields.hidden = view !== 'form';
  successView.hidden = view !== 'success';
  errorView.hidden = view !== 'error';

  testButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.testView === view));
  });
};

/* TESTANSICHT: Erfolg standardmässig anzeigen
   Beispiel: "Vielen Dank für Ihre Anfrage." */
showTestView('success');

testButtons.forEach(button => {
  button.addEventListener('click', () => {
    showTestView(button.dataset.testView);
  });
});

/* TESTVERSAND: Klick auf "Nachricht senden" zeigt nur die Erfolgsansicht
   Beispiel: "Nachricht senden" */
if (testForm) {
  testForm.addEventListener('submit', event => {
    event.preventDefault();
    showTestView('success');
  });
}
