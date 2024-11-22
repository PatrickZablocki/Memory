// script.js

// Karten-Daten 
const cardSymbols = ['🍎', '🍌', '🍓', '🍇', '🍍', '🥝', '🍉', '🍒'];
let cards = [...cardSymbols, ...cardSymbols]; // Doppelte Symbole für Paare

// Variablen
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerInterval;
let timeElapsed = 0;

// Elemente
const cardGrid = document.querySelector('.card-grid');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

// Timer starten
function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `Zeit: ${minutes}:${seconds}`;
  }, 1000);
}

// Timer stoppen
function stopTimer() {
  clearInterval(timerInterval);
}

// Karten mischen (Fisher-Yates-Algorithmus)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Spielfeld initialisieren
function initializeGame() {
  // Zurücksetzen
  cardGrid.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timeElapsed = 0;
  stopTimer();
  timerDisplay.textContent = 'Zeit: 00:00';
  scoreDisplay.textContent = 'Züge: 0';

  // Karten mischen
  shuffle(cards);

  // Karten erstellen
  cards.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    cardGrid.appendChild(card);
  });
}

// Karte umdrehen
function flipCard(card) {
  // Timer starten, wenn die erste Karte umgedreht wird
  if (moves === 0 && flippedCards.length === 0) {
    startTimer();
  }

  // Wenn die Karte schon umgedreht ist, nichts tun
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  // Karte umdrehen
  card.classList.add('flipped');
  flippedCards.push(card);

  // Überprüfen, ob ein Paar gefunden wurde
  if (flippedCards.length === 2) {
    moves++;
    scoreDisplay.textContent = `Züge: ${moves}`;
    checkMatch();
  }
}

// Überprüfen, ob die Karten zusammenpassen
function checkMatch() {
  const [card1, card2] = flippedCards;
  const symbol1 = card1.querySelector('.card-back').textContent;
  const symbol2 = card2.querySelector('.card-back').textContent;

  if (symbol1 === symbol2) {
    // Paar gefunden
    matchedPairs++;
    flippedCards = [];

    // Spiel gewonnen?
    if (matchedPairs === cardSymbols.length) {
      stopTimer();
      setTimeout(() => alert(`Herzlichen Glückwunsch! Du hast das Spiel in ${moves} Zügen und ${timeElapsed} Sekunden beendet.`), 500);
    }
  } else {
    // Kein Paar - Karten zurückdrehen
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

// Neustart-Button
restartBtn.addEventListener('click', initializeGame);

// Spiel starten
initializeGame();
