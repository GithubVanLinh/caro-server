const { getTurn } = require("../game_service/room.game_service");

class Board {
  #row;
  #col;
  constructor() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.#col = 20;
    this.#row = 20;
  }

  // get board() {
  //   return this.board;
  // }

  /**
   * @param {Number} x x
   * @param {Number} y y
   * @param {Number} value turn
   */
  setBoard(x, y, value) {
    this.board[x][y] = value;
  }

  resetBoard() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  static checkarr(arr) {
    for (i = 0; i <= arr.length - 5; ) {
      if (arr[i] !== 0) {
        if (
          arr[i - 1] &&
          arr[i + 5] &&
          arr[i - 1] !== 0 &&
          arr[i - 1] != arr[i] &&
          arr[i - 1] === arr[i + 5]
        ) {
          i += 1;
        } else {
          switch (true) {
            case arr[i] !== arr[i + 1]:
              i = i + 1;
              break;
            case arr[i] !== arr[i + 2]:
              i = i + 2;
              break;
            case arr[i] !== arr[i + 3]:
              i = i + 3;
              break;
            case arr[i] !== arr[i + 4]:
              i = i + 4;
              break;
            default:
              return arr[i];
          }
        }
      } else {
        i++;
      }
    }
    return -1;
  }

  #checkRows() {
    for (let i = 0; i < this.board.length; i++) {
      const result = Board.checkarr(this.board[i]);
      if (result !== -1) {
        return result;
      }
    }
    return null;
  }
  #checkCols() {
    for (let i = 0; i < this.#col; i++) {
      const arr = [];
      for (let j = 0; j < this.#row; j++) {
        arr.push(this.board[j][i]);
      }
      const result = Board.checkarr(arr);
      if (result !== -1) {
        return result;
      }
    }
    return null;
  }
  #getXLArray(x, y) {
    if (y == 0 && x < this.#col) {
      const arr = [];
      for (let i = x; i >= 0; i--) {
        arr.push(this.board[i][x - i]);
      }
      return arr;
    }
    if (x == this.#col - 1 && y > 0) {
      const arr = [];
      for (let i = y; i < this.#row - 1; i++) {
        arr.push(this.board[this.#row - i - 1][i]);
      }
      return arr;
    }
  }
  #checkXLefts() {
    for (let i = 4; i < this.#col; i++) {
      const result = Board.checkarr(this.#getXLArray(i, 0));
      if (result !== -1) {
        return result;
      }
    }
    for (let i = 1; i < this.#row - 4; i++) {
      const result = Board.checkarr(this.#getXLArray(this.#row - 1, i));
      if (result !== -1) {
        return result;
      }
    }
    return null;
  }
  #getXRArray(x, y) {
    if (y == 0 && x >= 0) {
      const arr = [];
      for (let i = 0; i < this.#row - x; i++) {
        arr.push(this.board[x + i][y + i]);
      }
      return arr;
    }
    if (x == 0 && y > 0) {
      const arr = [];
      for (let i = 0; i < this.#col - y; i++) {
        arr.push(this.board[x + i][y + i]);
      }
      return arr;
    }
  }
  #checkXRights() {
    for (let i = 4; i < this.#col; i++) {
      const result = Board.checkarr(this.#getXRArray(i, 0));
      if (result !== -1) {
        return result;
      }
    }
    for (let i = 1; i < this.#row - 4; i++) {
      const result = Board.checkarr(this.#getXRArray(0, i));
      if (result !== -1) {
        return result;
      }
    }
    return null;
  }

  checkBoard() {
    console.log(this.#checkRows());
    console.log(this.#checkCols());
    console.log(this.#checkXLefts());
    console.log(this.#checkXRights());
    const winner =
      this.#checkRows() ||
      this.#checkCols() ||
      this.#checkXLefts() ||
      this.#checkXRights();

    if (winner) {
      return winner;
    } else {
      return null;
    }
  }
}
module.exports = Board;
