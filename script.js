// Game settings
const ROWS = 6;
const COLS = 7;

// Get DOM elements
const board = document.getElementById('board');
const message = document.getElementById('message');

// Track current player
let currentPlayer = 'red';

// Create 2D array to store game state
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Get audio elements for sounds
const redSound = document.getElementById('drop-red');
const yellowSound = document.getElementById('drop-yellow');
const winSound = document.getElementById('win_sound');
const resetSound = document.getElementById('reset-sound');

// Build the board dynamically
function createBoard() {
  board.innerHTML = ''; // Clear existing cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      // Add click event for dropping a piece
      cell.addEventListener('click', () => handleClick(c));
      board.appendChild(cell);
    }
  }
}

// Handle column click
function handleClick(col) {
  // If the top cell is filled, column is full
  if (grid[0][col] !== null) {
    errorSound.play();
    return;
  }

  // Find the bottom-most empty row in this column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!grid[row][col]) {
      grid[row][col] = currentPlayer; // Store move
      updateCell(row, col);           // Update UI
      playDropSound(currentPlayer);   // Play sound

      // Check if this move wins the game
      if (checkWin(row, col)) {
        message.textContent = `Player ${capitalize(currentPlayer)} Wins!`;
        winSound.play();
        disableClicks(); // Stop further moves
      } else {
        // Switch player and update message
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        message.textContent = `Player ${capitalize(currentPlayer)}'s Turn`;
      }
      break;
    }
  }
}

// Add color class to cell
function updateCell(row, col) {
  const index = row * COLS + col;
  board.children[index].classList.add(currentPlayer);
}

// Check all directions for win condition (4 in a row)
function checkWin(r, c) {
  const directions = [
    [[0, 1], [0, -1]],     // Horizontal
    [[1, 0], [-1, 0]],     // Vertical
    [[1, 1], [-1, -1]],    // Diagonal \
    [[1, -1], [-1, 1]]     // Diagonal /
  ];

  for (let dir of directions) {
    let count = 1;
    for (let [dx, dy] of dir) {
      let row = r + dx;
      let col = c + dy;
      while (
        row >= 0 && row < ROWS &&
        col >= 0 && col < COLS &&
        grid[row][col] === currentPlayer
      ) {
        count++;
        row += dx;
        col += dy;
      }
    }
    if (count >= 4) return true; // Winner!
  }
  return false;
}

// Prevent any more moves after winning
function disableClicks() {
  board.querySelectorAll('.cell').forEach(cell => {
    const clone = cell.cloneNode(true);
    cell.replaceWith(clone); // Remove all event listeners
  });
}

// Capitalize first letter (for display)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Play sound depending on current player
function playDropSound(player) {
  if (player === 'red') redSound.play();
  else yellowSound.play();
}

// Handle game reset
document.getElementById('reset-btn').addEventListener('click', () => {
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentPlayer = 'red';
  message.textContent = "Player Red's Turn";
  createBoard();
  resetSound.play();
});

// Initialize the game board
createBoard();
