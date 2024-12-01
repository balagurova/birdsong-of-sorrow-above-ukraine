function loadLanguage(lang) {
  fetch('./assets/translations/translation.json')
    .then((response) => response.json())
    .then((data) => {
      applyTranslations(data[lang]);
      if (window.p5Instance) {
        window.p5Instance.updateData({
          months: data[lang].months,
          notes: data[lang].notes,
        });
      }
    });
}

function applyTranslations(translations) {
  for (const key in translations) {
    const elements = document.querySelectorAll(`#${key}`);
    elements.forEach((element) => {
      element.innerHTML = translations[key];
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadLanguage('en');
});

function selectLanguage(lang) {
  loadLanguage(lang);
  document
    .querySelectorAll('.language-option')
    .forEach((el) => el.classList.remove('selected'));
  document
    .querySelector(`.language-option[onclick="selectLanguage('${lang}')"]`)
    .classList.add('selected');
}

function drawNotesAndBirds() {
  for (let note of notes) {
    p.push();
    p.translate(note.x, note.y);
    p.fill('#fff');

    // Draw the note text
    p.text(note.text, 0, 0);

    // Check if 'n' is defined and not zero
    if (note.n && note.n !== 0) {
      // Generate 'n' number of birds
      for (let i = 0; i < note.n; i++) {
        // Random position around the note
        let birdX = -16;
        let birdY = -4;

        // Draw the bird at the random position
        p.push();
        p.translate(birdX, birdY);
        p.fill('#fff');
        BirdShapes.bird(p, 0, 0, 15, '#fff');
        p.pop();
      }
    }

    p.pop();
  }
}
