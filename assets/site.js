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

/* DIENSTLEISTUNGEN: einheitliche Höhe für geschlossene und geöffnete Kästen. */
const serviceDetailToggles = document.querySelectorAll('.service-detail__toggle');
const serviceDetails = Array.from(document.querySelectorAll('.service-detail'));

const measureServiceHeights = () => {
  serviceDetails.forEach((service) => {
    service.style.minHeight = '';
  });

  const closedHeight = Math.max(
    ...serviceDetails.map((service) => service.getBoundingClientRect().height)
  );

  const openHeights = serviceDetails.map((service) => {
    const toggle = service.querySelector('.service-detail__toggle');
    const listId = toggle?.getAttribute('aria-controls');
    const list = listId ? document.getElementById(listId) : null;
    if (!toggle || !list) return 0;

    const wasHidden = list.hidden;
    list.hidden = false;
    const height = service.getBoundingClientRect().height;
    list.hidden = wasHidden;
    return height;
  });

  const openHeight = Math.max(...openHeights);

  serviceDetails.forEach((service) => {
    const toggle = service.querySelector('.service-detail__toggle');
    const isOpen = toggle?.getAttribute('aria-expanded') === 'true';
    service.style.minHeight = `${isOpen ? openHeight : closedHeight}px`;
  });

  return { closedHeight, openHeight };
};

let serviceHeights = measureServiceHeights();

serviceDetailToggles.forEach((toggle) => {
  const listId = toggle.getAttribute('aria-controls');
  const list = listId ? document.getElementById(listId) : null;
  const service = toggle.closest('.service-detail');
  if (!list || !service) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const nextOpen = !isOpen;
    toggle.setAttribute('aria-expanded', String(nextOpen));
    toggle.setAttribute('aria-label', nextOpen ? 'Tätigkeiten ausblenden' : 'Tätigkeiten anzeigen');
    toggle.textContent = nextOpen ? 'Weniger anzeigen' : 'Mehr anzeigen';
    toggle.style.setProperty('--action-symbol', nextOpen ? '"–"' : '"+"');
    toggle.style.setProperty('--action-symbol-top', nextOpen ? '-1px' : '2px');
    list.hidden = !nextOpen;
    service.style.minHeight = `${nextOpen ? serviceHeights.openHeight : serviceHeights.closedHeight}px`;
  });
});

window.addEventListener('resize', () => {
  serviceHeights = measureServiceHeights();
});

/* FACHBEITRÄGE: Zurücklink zur vorherigen Position
   Bei direktem Aufruf bleibt die Fachwissen-Übersicht das normale Linkziel. */
const articleBackLinks = document.querySelectorAll('.article-back');

articleBackLinks.forEach((articleBackLink) => {
  articleBackLink.addEventListener('click', (event) => {
    if (!document.referrer || window.history.length <= 1) return;

    const previousUrl = new URL(document.referrer);

    if (previousUrl.origin !== window.location.origin) return;

    event.preventDefault();
    window.history.back();
  });
});

/* GLOBALE KOPIERSPERRE: Inhalte und Bilder vor einfachem Kopieren schützen
   Formulareingaben bleiben von der Sperre ausgenommen. */
const isEditableElement = (target) =>
  target instanceof Element &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

document.addEventListener('selectstart', (event) => {
  if (!isEditableElement(event.target)) event.preventDefault();
});

document.addEventListener('copy', (event) => {
  if (!isEditableElement(event.target)) event.preventDefault();
});

document.addEventListener('contextmenu', (event) => {
  if (!isEditableElement(event.target)) event.preventDefault();
});

document.addEventListener('dragstart', (event) => {
  if (event.target instanceof Element && event.target.closest('img')) {
    event.preventDefault();
  }
});

/* STARTSEITE FACHWISSEN: automatisch die drei neuesten Fachbeiträge anzeigen
   Die Fachwissen-Hauptseite bleibt die einzige Inhaltsquelle. */
const latestKnowledgeGrid = document.querySelector('.home-knowledge .knowledge-grid');

if (latestKnowledgeGrid) {
  const knowledgeOverviewUrl = new URL('fachwissen/', document.baseURI);

  fetch(knowledgeOverviewUrl, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error('Fachwissen-Hauptseite konnte nicht geladen werden.');
      return response.text();
    })
    .then((html) => {
      const documentCopy = new DOMParser().parseFromString(html, 'text/html');
      const knowledgeCards = Array.from(
        documentCopy.querySelectorAll('.knowledge-grid .knowledge-card')
      );

      const dateValue = (card) => {
        const dateText = card.querySelector('.knowledge-card__date')?.textContent ?? '';
        const dateParts = dateText.match(/(\d{2})\.(\d{4})/);

        return dateParts ? Number(dateParts[2]) * 100 + Number(dateParts[1]) : 0;
      };

      const latestCards = knowledgeCards
        .sort((firstCard, secondCard) => dateValue(secondCard) - dateValue(firstCard))
        .slice(0, 3)
        .map((card) => {
          const cardCopy = card.cloneNode(true);
          const relativeUrl = cardCopy.getAttribute('href');
          const articleUrl = relativeUrl ? new URL(relativeUrl, knowledgeOverviewUrl).href : '';

          if (articleUrl) {
            cardCopy.setAttribute('href', articleUrl);
          }

          const wrapper = document.createElement('div');
          wrapper.append(cardCopy);

          if (articleUrl) {
            const action = document.createElement('a');
            action.className = 'action';
            action.href = articleUrl;
            action.textContent = 'Beitrag anzeigen';
            wrapper.append(action);
          }

          return wrapper;
        });

      const currentCards = Array.from(
        latestKnowledgeGrid.querySelectorAll('.knowledge-card')
      );

      const cardSignature = (card) => {
        const href = card.getAttribute('href');
        const resolvedHref = href ? new URL(href, document.baseURI).href : '';

        return [
          resolvedHref,
          card.querySelector('.knowledge-card__date')?.textContent?.trim() ?? '',
          card.querySelector('h3')?.textContent?.trim() ?? '',
          card.querySelector('p')?.textContent?.trim() ?? ''
        ].join('|');
      };

      const currentSignatures = currentCards.map(cardSignature);
      const latestSignatures = latestCards.map((wrapper) =>
        cardSignature(wrapper.querySelector('.knowledge-card'))
      );

      const cardsChanged =
        currentSignatures.length !== latestSignatures.length ||
        currentSignatures.some((signature, index) => signature !== latestSignatures[index]);

      if (cardsChanged) {
        latestKnowledgeGrid.replaceChildren(...latestCards);
      }
    })
    .catch(() => {
      /* Die bereits im HTML vorhandenen Kacheln bleiben als sichere Anzeige bestehen. */
    });
}
