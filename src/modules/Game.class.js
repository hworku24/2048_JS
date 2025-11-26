
'use strict';

/**
 * Main class for the 2048 game.
 * 4 kinds of game status:
 * 'idle' = not started
 * 'playing' = currently running
 * 'win' = player reached 2048
 * 'lose' = no more moves
 */
class Game {
  constructor(initialState) {
    this.size = 4; // 4x4 grid
    this.target = 2048;  // number needed to win
    this.score = 0;  // starting score
    this.status = 'idle'; // game starts not running

     // Create an empty board
    const empty = this._emptyBoard();
    // Use saved board if provided, otherwise use empty board
    const given =
      initialState && initialState.length
        ? this._cloneBoard(initialState)
        : empty;

    // Store both working board and a frozen copy for restarts
    this.board = this._cloneBoard(given);
    this._initialBoard = this._cloneBoard(given);
  }



  // Returns the current score as a number
  getScore() {
    return this.score;
  }

  // Returns the current board layout (where all the tiles are)
  getState() {
    return this._cloneBoard(this.board);
  }

//Tells what stage the game is in right now
  getStatus() {
    return this.status;
  }

 // Starts the game: Adds two number tiles to the board and changes the game to "playing".
  start() {
    if (this.status !== 'idle') {
      return;
    }

     // Add two random tiles to begin
    this._spawnRandomTile();
    this._spawnRandomTile();

    this.status = 'playing';
    this._updateWinLoseStatus();
  }

  // Resets the game back to the original empty board. Score goes back to 0 and the game stops.
  restart() {
    this.board = this._cloneBoard(this._initialBoard);
    this.score = 0;
    this.status = 'idle';
  }

  //Move tiles left */
  moveLeft() {
    return this._move('left');
  }
  //Move tiles right 
  moveRight() {
    return this._move('right');
  }
  //Move tiles up 
  moveUp() {
    return this._move('up');
  }
  // Move tiles down
  moveDown() {
    return this._move('down');
  }

 
//Handles moving tiles in the given direction and returns true if anything changed on the board.
  _move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    // Save the board before moving so we can compare later
    const prevSerialized = this._serialize(this.board);

    if (direction === 'left' || direction === 'right') {
      this._moveRows(direction === 'right');
    } else if (direction === 'up' || direction === 'down') {
      this._transpose();
      this._moveRows(direction === 'down'); // 'down' == 'right' on transposed
      this._transpose();
    } else {
      return false;
    }

     // Check if the board actually changed
    const nextSerialized = this._serialize(this.board);
    const changed = prevSerialized !== nextSerialized;

    // If movement happened, add a new tile and update game status
    if (changed) {
      this._spawnRandomTile();
      this._updateWinLoseStatus();
    }

    return changed;
  }

  //Moves all rows left or right depending on the direction. */
  _moveRows(reverse) {
    for (let r = 0; r < this.size; r++) {
      const row = this.board[r].slice();

      this.board[r] = this._slideAndMerge(row, reverse);
    }
  }

  /**
   * Slide zeros out, merge equals once, slide again.
   * reverse=true => move to right; false => left.
   */
  _slideAndMerge(row, reverse) {
    const line = reverse ? row.slice().reverse() : row.slice();

    // compress (remove zeros)
    let compact = line.filter((v) => v !== 0);

    // merge once per pair
    for (let i = 0; i < compact.length - 1; i++) {
      if (compact[i] !== 0 && compact[i] === compact[i + 1]) {
        compact[i] *= 2;
        this.score += compact[i];
        compact[i + 1] = 0;
        i++; // skip the next (already merged)
      }
    }

    // compress again
    compact = compact.filter((v) => v !== 0);

    // pad with zeros
    while (compact.length < this.size) {
      compact.push(0);
    }

    return reverse ? compact.slice().reverse() : compact;
  }
//Checks if the player has won or lost and updates the status.
 */
  _updateWinLoseStatus() {
    if (this._hasReachedTarget()) {
      this.status = 'win';

      return;
    }

    if (!this._hasEmptyCell() && !this._hasAnyMergeAvailable()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
//Checks if the player reached 2048 
  _hasReachedTarget() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] >= this.target) {
          return true;
        }
      }
    }

    return false;
  }

  //Checks if there is at least one empty space on the board
  _hasEmptyCell() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  // Checks if any tiles can still be merged 
  _hasAnyMergeAvailable() {
    // check side-by-side tiles
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    //Check tiles above/below
    for (let cc = 0; cc < this.size; cc++) {
      for (let rr = 0; rr < this.size - 1; rr++) {
        if (this.board[rr][cc] === this.board[rr + 1][cc]) {
          return true;
        }
      }
    }

    return false;
  }
  
  // Places a new number on a random empty square: mostly adds 2, sometimes adds 4.
  
  _spawnRandomTile() {
    const empties = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empties.push([r, c]);
        }
      }
    }

    if (!empties.length) {
      return;
    }

    const [row, col] = empties[Math.floor(Math.random() * empties.length)];

    // 90% chance 2, 10% chance 4 
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  //Flips the board diagonally to make vertical movement work.
  _transpose() {
    const n = this.size;

    for (let r = 0; r < n; r++) {
      for (let c = r + 1; c < n; c++) {
        const tmp = this.board[r][c];

        this.board[r][c] = this.board[c][r];
        this.board[c][r] = tmp;
      }
    }
  }

  //Creates a fresh empty board filled with zeros 
  _emptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  // Makes a copy of the board so the original stays safe 
  _cloneBoard(b) {
    return b.map((row) => row.slice());
  }

  // Turns the board into text so we can compare changes
  _serialize(b) {
    return b.map((row) => row.join(',')).join('|');
  }
}

module.exports = Game;
