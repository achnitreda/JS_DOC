var gameData = {
    movesP1 : [],
    movesP2 : [], // store the square id to an array
    score1 : 0,
    score2 : 0,
    token1 : "x",
    token2 : "o",
} // store game data

var isOver = false; // see whether game is ended
var turns = 0;
var size = 3; //3x3 grid default
var canSave = true;

// =================== All the functions =============================

  // load game
  if (canSave) {
    if (localStorage.gameData !== undefined) {
      gameData = JSON.parse(localStorage.getItem("gameData"));
      turns = JSON.parse(localStorage.getItem("turns"));
      isOver = JSON.parse(localStorage.getItem("isOver"));

      for (var i = 0; i < gameData.movesP1.length; i++) {
        document
          .getElementById(gameData.movesP1[i])
          .classList.add(gameData.token1);
      }

      for (var i = 0; i < gameData.movesP2.length; i++) {
        document
          .getElementById(gameData.movesP2[i])
          .classList.add(gameData.token2);
      }

      document.querySelector("#player1 .num").textContent =
        "" + gameData.score1;
      document.querySelector("#player2 .num").textContent =
        "" + gameData.score2;

      document.querySelector("#message").textContent = "Game continued!";
    }
  }

  var restart = function () {
    gameData.movesP1 = [];
    gameData.movesP2 = [];
    turns = 0;
    isOver = false;
    document.querySelectorAll("td").forEach(e => {
      e.classList.remove(gameData.token1)
      e.classList.remove(gameData.token2)
    })
    document.querySelector("#message").textContent = "Let's play the game! Player1 first.";
  };

  document.querySelector("#restart").addEventListener("click", function () {
    restart();
    saveGame();
  }); // START button click event, reset game

function saveGame() {
    localStorage.setItem("gameData", JSON.stringify(gameData));
    localStorage.setItem("turns", JSON.stringify(turns));
    localStorage.setItem("isOver", JSON.stringify(isOver));
  }

  // when player clicks squares to play!!!!
  document.querySelectorAll("td").forEach(e => { 
    e.addEventListener("click", function () {
    if (isOver) {
        // console.log(isOver);
      return;
    } // if game is ended, clicks become invalid

    var token1 = gameData.token1;
    var token2 = gameData.token2;

    var marked = this; // get the square that player selects
    // console.log(marked);
    if (
      marked.classList.contains(token1) ||
      marked.classList.contains(token2)
    ) {
      // if the square has already been selected then alert else markes the square
      alert("Please choose another square!")
      return;
    }

    // first see which turn
    if (turns % 2 === 0) {

      document.querySelector("#message").textContent = "It's Player1's turn!"; // change the prompt message
      marked.classList.add(token1)
      gameData.movesP1.push(this.id); // store the sqaure id to an array

      turns++; //player2's turn

      if (checkWin(gameData.movesP1, size)) {
        document.querySelector("#message").textContent= "Player1 wins!";
        isOver = true; // game is ended
        gameData.score1 += 1;
        document.querySelector("#player1 .num").textContent=+ gameData.score1;
      } else {
        if (turns === size ** 2) {
          document.querySelector("#message").textContent= "It's a draw!";
          isOver = true;
          saveGame();
          return;
        } // players reach the last turn and not winning, it's a draw

        document.querySelector("#message").textContent = "It's Player2's turn!";
        //normally switch to player O and change prompt message
      }
      saveGame();
    } else {
      document.querySelector("#message").textContent = "It's Players2's turn!";
      marked.classList.add(token2)
      gameData.movesP2.push(this.id);

      turns++;

      if (checkWin(gameData.movesP2, size)) {
        document.querySelector("#message").textContent = "Player2 wins!";
        isOver = true;
        gameData.score2 += 1;
        document.querySelector("#player2 .num").textContent =+ gameData.score2;
        saveGame();
      } else {
        if (turns === size ** 2) {
          document.querySelector("#message").textContent = "It's a draw!";
          isOver = true;
          saveGame();
          return;
        }

        document.querySelector("#message").textContent = "It's Player1's turn!";
        saveGame();
      }
    }
  })}); // all player the moves


    // get 2 arrays with all the square ids on the diagonal directions
  // pattern here is seperate first number and second number, reverse the array with second numbers
  var diagArr = function (size, booleanNum) {
    var row = [];
    var col = [];
    var diagonal = [];

    for (var i = 1; i <= size; i++) {
      i = String(i); 
      row.push(i);
      // console.log(row); // [1,2,3]

      

      if (booleanNum) {
        col.unshift(i);
        // console.log(col); // [3,2,1]
      } else {
        col.push(i);
      }
    }

    // console.log(row.length); // 3 3
    for (var i = 0; i < row.length; i++) {
      diagonal.push(row[i] + col[i]);
    }
    // console.log(diagonal);
    return diagonal; 
  };

   // to check whether all the square ids are included in the player's selected squares.
   var checkDiag = function (diagonal, playerMoves) {
    for (var i = 0; i < diagonal.length; i++) {
      // console.log(diagonal[i])
      if (playerMoves.indexOf(diagonal[i]) === -1) {
        return false; // first index exits in array / -1 not present
      }
    }
    return true;
  };

   // seperate row ids and column ids, and check if the player's selected squares have 3
  // same row ids or column ids.
  // to check whether it's winning horizontally or vertically
  var checkOther = function (playerMoves, size) {
    //check horizontally and vertically
    var row = [];
    var col = [];

    for (var i = 0; i < playerMoves.length; i++) {
      row.push(Number(playerMoves[i][0]));
      col.push(Number(playerMoves[i][1]));
    }
    
    // row.sort();
    // col.sort();
    // console.log(row);


      for (var i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1] && row[i] === row[i + 2]) {
          return true;
        }
      }

      for (var i = 0; i < col.length; i++) {
        if (col[i] === col[i + 1] && col[i] === col[i + 2]) {
          return true;
        }
      }
      return false;
    }

  //=============== Total check to win function =============

  var checkWin = function (moves, size) {
    var diagonal1 = diagArr(size, 0); // [11,22,33]
    var diagonal2 = diagArr(size, 1); // // [13,22,31]
    if (
      checkDiag(diagonal1, moves) ||
      checkDiag(diagonal2, moves) ||
      checkOther(moves, size)
    ) {
      return true;
    }
    return false;
  };