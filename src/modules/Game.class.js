'use strict';

/**
 * 2048 Game implementation.
 * Status: 'idle' | 'playing' | 'win' | 'lose'
 */
class Game {
  /**
   * @param {number[][]} initialState
   */
  constructor(initialState) {
    this.size = 4;
    this.target = 2048;
    this.score = 0;
    this.status = 'idle';

    const empty = this._emptyBoard();
    const given =
      initialState && initialState.length
        ? this._cloneBoard(initialState)
        : empty;

    // Store both working board and a frozen copy for restart()
    this.board = this._cloneBoard(given);
    this._initialBoard = this._cloneBoard(given);
  }

  /** ---------------- Public API ---------------- */

  /** @returns {number} */
  getScore() {
    return this.score;
  }

  /** @returns {number[][]} */
  getState() {
    return this._cloneBoard(this.board);
  }

  /** @returns {'idle'|'playing'|'win'|'lose'} */
  getStatus() {
    return this.status;
  }

  /** Starts the game: add up to two tiles and set status to 'playing'. */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    // Always try to add two tiles (tests expect this even with a custom state)
    this._spawnRandomTile();
    this._spawnRandomTile();

    this.status = 'playing';
    this._updateWinLoseStatus();
  }

  /** Resets the game to the initial state (no random tiles). */
  restart() {
    this.board = this._cloneBoard(this._initialBoard);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this._move('left');
  }
  moveRight() {
    return this._move('right');
  }
  moveUp() {
    return this._move('up');
  }
  moveDown() {
    return this._move('down');
  }

  /** ---------------- Internals ---------------- */

  _move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    // Rename 'before' and 'after' to avoid shadowing globals
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

    const nextSerialized = this._serialize(this.board);
    const changed = prevSerialized !== nextSerialized;

    if (changed) {
      this._spawnRandomTile();
      this._updateWinLoseStatus();
    }

    return changed;
  }

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

  _hasAnyMergeAvailable() {
    // horizontal neighbors
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    // vertical neighbors
    for (let cc = 0; cc < this.size; cc++) {
      for (let rr = 0; rr < this.size - 1; rr++) {
        if (this.board[rr][cc] === this.board[rr + 1][cc]) {
          return true;
        }
      }
    }

    return false;
  }

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

    // 90% chance 2, 10% chance 4 (tests rely on 2 being more common)
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

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

  _emptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _cloneBoard(b) {
    return b.map((row) => row.slice());
  }

  _serialize(b) {
    return b.map((row) => row.join(',')).join('|');
  }
}

module.exports = Game;

// 'use strict';

// /**
//  * This class represents the game.
//  * Now it has a basic structure, that is needed for testing.
//  */
// class Game {
//   /**
//    * Creating a new game instance.
//    *
//    * @param {number[][]} initialState
//    * The initial state of the board.
//    * @default
//    * [[0, 0, 0, 0],
//    *  [0, 0, 0, 0],
//    *  [0, 0, 0, 0],
//    *  [0, 0, 0, 0]]
//    *
//    * If passed, the board will be initialized with the provided
//    * initial state.
//    */
//   constructor(initialState) {
//     // eslint-disable-next-line no-console
//     console.log(initialState);
//   }

//   moveLeft() {}
//   moveRight() {}
//   moveUp() {}
//   moveDown() {}

//   /**
//    * @returns {number}
//    */
//   getScore() {}

//   /**
//    * @returns {number[][]}
//    */
//   getState() {}

//   /**
//    * Returns the current game status.
//    *
//    * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
//    *
//    * `idle` - the game has not started yet (the initial state);
//    * `playing` - the game is in progress;
//    * `win` - the game is won;
//    * `lose` - the game is lost
//    */
//   getStatus() {}

//   /**
//    * Starts the game.
//    */
//   start() {}

//   /**
//    * Resets the game.
//    */
//   restart() {}

//   // Add your own methods here
// }

// module.exports = Game;
