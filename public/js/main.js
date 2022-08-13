document.addEventListener('DOMContentLoaded', () => {
  let titleSent = 'Decide For Me';
  let title = document.querySelector('#title');
  let string = title.innerHTML;
  let letters = [];
  title.innerHTML = '';
  for (let i = 0; i < titleSent.length; i++) {
      letters[i] = document.createElement('span');
      letters[i].innerHTML = titleSent[i];
      letters[i].style.color = getRandomColor();
      title.appendChild(letters[i]);
  }
  let askInput = document.querySelector('#query').focus();
})

let judgeBtn = document.querySelector('#judge');
let askInput = document.querySelector('#query');
askInput.addEventListener('keypress', (e) => {
  let decision;
  if (e.key === 'Enter') {
      decision = getDecision();
      removeNote()
      reportDecision(decision);
  }
});

askInput.addEventListener('input', () => {
});
judgeBtn.addEventListener('click', (e) => {
  let decision;
  decision = getDecision();
  removeNote()
  reportDecision(decision);
});

function reportDecision(decision) {
  let resultElement = document.querySelector('#result');
  resultElement.innerHTML = decision.toUpperCase();
}

function removeNote() {
  let note = document.querySelector('#note');
  if (note)
      note.parentNode.removeChild(note);
}


function getDecision() {
  let query = askInput.value;
  let queryTrimed = query.trim();

  let choices;
  choices = queryTrimed.split(',');
  let numberOfChoices = choices.length;

  decisionIndex = getRandomNumber(numberOfChoices);
  return choices[decisionIndex];
}

function getRandomNumber(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}

function getRandomColor() {
  let ReturnColor = '#';
  for (let i = 0; i < 6; i++) {
      let colorIndex = Math.floor(Math.random() * 16);
      let colorIndexString;
      switch(colorIndex) {
          case 15:
              colorIndexString = 'F';
              break;
          case 14:
              colorIndexString = 'E';
              break;
          case 13:
              colorIndexString = 'D';
              break;
          case 12:
              colorIndexString = 'C';
              break;
          case 11:
              colorIndexString = 'B';
              break;
          case 10:
              colorIndexString = 'A';
              break;
          default:
              colorIndexString = colorIndex.toString();
              break;
      }
      ReturnColor += colorIndexString;
  }
  return ReturnColor;
}