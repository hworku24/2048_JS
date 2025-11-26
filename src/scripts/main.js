'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// HIGH SCORE: This saves and remembers the best score even after refreshing the page
const BEST_KEY = '2048:bestScore';
let bestScore = Number(localStorage.getItem(BEST_KEY)) || 0;

// Getting important parts of the page (buttons, score, board, messages)
const els = {
  container: document.querySelector('.container'),
  startBtn: document.querySelector('.button.start'),
  controls: document.querySelector('.controls'),
  scoreEl: document.querySelector('.game-score'), 
  cells: Array.from(document.querySelectorAll('.field-cell')),
  msgStart: document.querySelector('.message-start'),
  msgWin: document.querySelector('.message-win'),
  msgLose: document.querySelector('.message-lose'),
  board: document.querySelector('.game-field'),
};

// Making sure there only one Restart button 
let restartBtn = document.querySelector('.button.restart');

if (!restartBtn) {
  restartBtn = document.createElement('button');
  restartBtn.className = 'button restart';
  restartBtn.textContent = 'Restart';

  if (els.controls) {
    els.controls.appendChild(restartBtn);
  } else if (els.startBtn) {
    els.startBtn.insertAdjacentElement('afterend', restartBtn);
  } else {
    document.body.appendChild(restartBtn);
  }
}

// Make sure the score is a text box the game can update
if (els.scoreEl && els.scoreEl.tagName !== 'INPUT') {
  const input = document.createElement('input');

  input.className = 'game-score';
  input.readOnly = true;
  input.value = (els.scoreEl.textContent || '0').trim() || '0';
  els.scoreEl.replaceWith(input);
  els.scoreEl = input;
}

//If score element doesn't exist, create one
if (!els.scoreEl) {
  els.scoreEl = document.createElement('input');
  els.scoreEl.className = 'game-score';
  els.scoreEl.readOnly = true;
  els.scoreEl.value = '0';
}

//Turn the top gray box into a "Best Score" display
const bestBox = els.controls && els.controls.querySelector('.info');
let bestInput = document.querySelector('.best-score');

if (bestBox) {
  bestBox.innerHTML = '';

  const bestLabel = document.createElement('span');
  bestLabel.textContent = 'Best:';
  
  bestInput = document.createElement('input');
  bestInput.className = 'best-score';
  bestInput.readOnly = true;
  bestInput.value = String(bestScore);
  bestBox.append(bestLabel, bestInput);
}

// Keeps only one side score card if more than one exists
const removeExtras = (nodes) => {
  nodes.forEach((n, i) => {
    if (i > 0) {
      n.remove();
    }
  });
};

let sideScore = document.querySelector('.side-score');

// If multiple exist for any reason, keep only the first
removeExtras(Array.from(document.querySelectorAll('.side-score')));

// Create a side score box if missing
if (!sideScore && els.container) {
  sideScore = document.createElement('p');
  sideScore.className = 'info side-score';
  els.container.appendChild(sideScore);
}

// Fill the side score box with label + score
if (sideScore) {
  sideScore.innerHTML = '';

  const label = document.createElement('span');

  label.textContent = 'Score:';
  sideScore.append(label, els.scoreEl);
}

// Draw the game board on the screen
function renderBoard() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = els.cells[r * 4 + c];
      const val = state[r][c];
        // Show number if it exists, otherwise leave blank
      cell.textContent = val ? String(val) : '';
      cell.className = 'field-cell' + (val ? ` tile-${val}` : '');
    }
  }
}

// Shows the correct message (start, win, or lose)
function renderMessages() {
  const gameStatus = game.getStatus();

  if (els.msgStart) {
    els.msgStart.classList.add('hidden');
  }

  if (els.msgWin) {
    els.msgWin.classList.add('hidden');
  }

  if (els.msgLose) {
    els.msgLose.classList.add('hidden');
  }

  if (gameStatus === 'idle' && els.msgStart) {
    els.msgStart.classList.remove('hidden');
  }

  if (gameStatus === 'win' && els.msgWin) {
    els.msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose' && els.msgLose) {
    els.msgLose.classList.remove('hidden');
  }
}

// Updates the score display
function renderScore() {
  const s = game.getScore();

  if (els.scoreEl) {
    els.scoreEl.value = String(s); // for Cypress .value checks
    els.scoreEl.textContent = String(s);
  }

   // Save new best score if higher
  if (s > bestScore) {
    bestScore = s;
    localStorage.setItem(BEST_KEY, String(bestScore));
  }

  if (bestInput) {
    bestInput.value = String(bestScore);
  }
}

// Updates everything on screen
function renderAll() {
  renderBoard();
  renderScore();
  renderMessages();
}

// Handles arrow key movement
function handleMove(key) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moved =
    key === 'ArrowLeft'
      ? game.moveLeft()
      : key === 'ArrowRight'
        ? game.moveRight()
        : key === 'ArrowUp'
          ? game.moveUp()
          : key === 'ArrowDown'
            ? game.moveDown()
            : false;

  if (moved) {
    renderAll();
  }
}
// Starts the game when Start is clicked
function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
  }
  renderAll();
}

// Restarts the game and clears the score
function restartGame() {
  game.restart();

  if (els.scoreEl) {
    els.scoreEl.value = '';
    els.scoreEl.textContent = '';
  }
  renderAll();
}

//Listen for keyboard arrows
document.addEventListener('keydown', (e) => {
  handleMove(e.key);
});
// Start button click
if (els.startBtn) {
  els.startBtn.addEventListener('click', startGame);
}
// Restart button click
if (els.restartBtn) {
  els.restartBtn.addEventListener('click', restartGame);
}

//Show the game when page loads
renderAll();
