class Player {
  constructor(num, color) {
    this.num = num;
    this.color = color.toLowerCase();
  }
}

class Game {
  constructor () {
    this.WIDTH = 7;
    this.HEIGHT = 6;    
    this.makeBoard();        
    this.makeHtmlBoard();
  }

  startListener(e) {    
    // Initialize the board in memory and on the page
    this.makeBoard();        
    this.makeHtmlBoard();

    // Enable the user to drop pieces by making the top row visible
    const top = document.getElementById("column-top");
    top.classList.remove("hide");
    top.classList.add("show");

    // instantiate the players' objects and initialize thier properties
    const p1Color = document.getElementById("color-1");
    const p2Color = document.getElementById("color-2");
    this.player1 = new Player(1, p1Color.value);
    this.player2 = new Player(2, p2Color.value);  
    this.currPlayer = this.player1.num;     
  }
  
  // Initialize the board in memory
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }

  }

  // Draw the board on the page
  makeHtmlBoard() {
      const board = document.getElementById('board');   
      board.innerHTML = '';  

      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      this.boundClickHandler = this.handleClick.bind(this);
      top.addEventListener('click', this.boundClickHandler);

      // Prevent the user from dropping pieces until he presses the Start button
      top.classList.add("hide");

      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }

      board.append(top);

      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }

        board.append(row);
      }

      // Bind the start button listener to thie object and add the listener to the start button
      const start = document.getElementById("start");
      const boundStart = this.startListener.bind(this);
      start.addEventListener('click', boundStart);
  }
  
  // Drop a piece with the right color unto the board
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer === this.player1.num ? this.player1.color : this.player2.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  // When the games ends, delete the players' objects, displya a message and prevent 
  // the user from dropping more pieces by hiding the top row
  endGame(msg) {
    const top = document.getElementById('column-top');
    top.classList.remove("show");
    top.classList.add("hide");
    delete this.player1;
    delete this.player2;
    alert(msg);
  }
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    console.log("x=", x);

    // get next spot in column (if none, ignore click)
    // const y = this.findSpotForCol(x);
    const y = this.findSpotForCol(x);
    if (this.y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1.num ? this.player2.num : this.player1.num;
  }

  findSpotForCol(col) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][col]) {
        return y;
      }
    }
    return null;
  }

  

  checkForWin() {

    const _win = function (cells) {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }.bind(this);
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

// Initialize a new game object
const letsPlay =  new (Game);
