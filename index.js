"use strict"

const Domain = (() => {
    const gameBoardDiv = document.getElementById("gameBoard");
    const playersDiv = document.getElementById("playersDiv")
    const victoryInfo = document.getElementById("victoryInfo")
    const victoryAlert = document.getElementById("victoryAlert")
    const playAgain = document.getElementById("playAgain")
    const startButton = document.getElementById("startButton")
    const gameBoardHolder = document.getElementById("gameBoardHolder")
    const playerButtons = document.querySelectorAll(".playerButtons")
    const scoreCounters = document.querySelectorAll(".scoreCounter")
    const scoreOne = document.getElementById("scoreOne")
    const scoreTwo = document.getElementById("scoreTwo")

    return {
        playersDiv, victoryInfo, victoryAlert, playAgain, startButton, gameBoardHolder, playerButtons,
        scoreCounters, scoreOne, scoreTwo, gameBoardDiv
    }
})()

const Players = (() => {
    const playerFactory = (name) => {
        let playerTurn; // Boolean to keep track of which player's turn it is
        let score = 0; // Variable to keep track of how many victories the player has had (score is lost when page refreshed)
        let playerType; // "human" or "machine"
        return { playerTurn, name, score, playerType }
    }

    const playerOne = playerFactory("Player One")
    const playerTwo = playerFactory("Player Two")

    return { playerOne, playerTwo }
})()



const Gameboard = (() => {

    // 2D array to hold state of gameboard
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    // tiles array to hold DOM elements
    const tiles = [];
    for (let row = 0; row < gameboard.length; row++) {
        let rowHolder = [];
        for (let col = 0; col < gameboard.length; col++) {
            let tile = Domain.gameBoardDiv.querySelector(`#tile-${row}-${col}`)
            tile.setAttribute("data-row", row);
            tile.setAttribute("data-col", col);
            rowHolder.push(tile)
        }
        tiles.push(rowHolder)
    }

    // Render the DOM elements - Public
    const render = () => {
        for (let row = 0; row < gameboard.length; row++) {
            for (let col = 0; col < gameboard.length; col++) {
                if (gameboard[row][col] == true) {
                    tiles[row][col].textContent = "X"
                } else if (gameboard[row][col] == false) {
                    tiles[row][col].textContent = "O"
                } else {
                    tiles[row][col].textContent = " "
                }
            }
        }
    }

    return { gameboard, render, tiles }
})()

const Game = (() => {
    const getActivePlayer = () => {
        if (!Players.playerOne.playerTurn && !Players.playerTwo.playerTurn) {
            Players.playerOne.playerTurn = true;
            Players.playerTwo.playerTurn = false;
            return Players.playerOne
        } else if (Players.playerOne.playerTurn) {
            return Players.playerOne
        } else {
            return Players.playerTwo
        }
    }

    const toggleActivePlayer = () => {
        Players.playerOne.playerTurn = !Players.playerOne.playerTurn;
        Players.playerTwo.playerTurn = !Players.playerTwo.playerTurn;
    }

    const _highlightActivePlayer = () => {
        const playerTitles = document.querySelectorAll(".playerTitle")
        const activePlayer = Game.getActivePlayer()
        playerTitles.forEach((player) => {
            let DOMtitle = player.innerHTML
            let activePlayerTitle = activePlayer.name
            if (DOMtitle == activePlayerTitle) {
                player.classList.add("activeTitle")
            } else {
                player.classList.remove("activeTitle")
            }
        })
    }

    const _rematch = () => {
        // Clear gameboard
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            Gameboard.gameboard[i].fill(null)
        }
        // Unhighlight victory cells or unhighlight "draw" effect from prior game
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            for (let j = 0; j < Gameboard.gameboard.length; j++) {
                Gameboard.tiles[i][j].classList.remove("victoryTile")
                Gameboard.tiles[i][j].classList.remove("drawTile")
            }
        }
        // Hide victoryInfo and reveal playerDiv
        Domain.playersDiv.style.display = "flex"
        Domain.victoryInfo.style.display = "none"

        // Show cleared gameboard
        Gameboard.render();

        // Begin next game
        let player = getActivePlayer()
        if (player.playerType == "human") {
            Game.waitForHumanMove();
        } else {
            makeMove(player)
        }
    }

    const waitForHumanMove = () => {
        Gameboard.tiles.forEach((row) => {
            for (let col = 0; col < row.length; col++) {
                let tile = row[col]
                tile.addEventListener("click", inputMove);
            }
        })
    }

    const stopWaitingForHumanMove = () => {
        for (let row = 0; row < Gameboard.tiles.length; row++) {
            for (let col = 0; col < Gameboard.tiles.length; col++) {
                Gameboard.tiles[row][col].removeEventListener("click", Game.inputMove)
            }
        }
    }

    const _endGame = (player, victoryType, index) => {

        const _highlightTiles = (tiles) => {
            for (let tile = 0; tile < tiles.length; tile++) {
                tiles[tile].classList.add("victoryTile")
            }
        }

        const _updateScores = (player) => {
            player.score += 1;
            Domain.scoreOne.textContent = ` ${Players.playerOne.score}`;
            Domain.scoreTwo.textContent = ` ${Players.playerTwo.score}`;
        }

        let victoryTiles = [];
        // Row victory
        if (victoryType == "row") {
            victoryTiles = Gameboard.tiles[index];
        }
        // Column victory
        else if (victoryType == "column") {
            for (let row = 0; row < Gameboard.gameboard.length; row++) {
                victoryTiles.push(Gameboard.tiles[row][index])
            }
        }
        // Diagonal victory (top left - bottom right)
        else if (victoryType == "diagonal") {
            for (let index = 0; index < Gameboard.gameboard.length; index++) {
                victoryTiles.push(Gameboard.tiles[index][index])
            }
        }
        // Diagonal victory (top right - bottom left)
        else if (victoryType == "reverseDiagonal") {
            for (let index = 0; index < Gameboard.gameboard.length; index++) {
                victoryTiles.push(Gameboard.tiles[index][2 - index])
            }
        }
        _highlightTiles(victoryTiles)
        stopWaitingForHumanMove()
        _updateScores(player)

        Domain.victoryInfo.style.display = "flex"
        Domain.victoryAlert.textContent = `${player.name} won the game!`

        // Play again button
        Domain.playAgain.addEventListener("click", _rematch)
    }

    // draw meaning a non-win outcome, not "draw" as in render an image
    const _drawGame = () => {
        Gameboard.tiles.forEach((row) => {
            for (let tile = 0; tile < Gameboard.tiles.length; tile++) {
                row[tile].classList.add("drawTile")
            }
        })
        // const playersDiv = document.getElementById("playersDiv")
        // Domain.playersDiv.style.display = "none"
        // const victoryAlert = document.getElementById("victoryAlert")
        Domain.victoryAlert.textContent = `Draw!`
        // const victoryInfo = document.getElementById("victoryInfo")
        Domain.victoryInfo.style.display = "flex"

        // Play again button
        Domain.playAgain.addEventListener("click", _rematch)

        return "draw"
    }

    // Returns victor and victory type (row/col/diag)
    const checkVictory = () => {

        // Checks array to see if all the same, i.e a winning combination
        const _checkWin = (array) => {
            if (array[0] == array[1] && array[1] == array[2] && array[0] != null) {
                return true
            } else {
                return false
            }
        }

        const _getWinner = (array) => {
            if (array[0] == true) {
                return Players.playerOne
            } else if (array[0] == false) {
                return Players.playerTwo
            }
        }

        // Analyse gameboard for victory
        // Check rows for victory
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            let row = Gameboard.gameboard[i];
            if (_checkWin(row)) {
                return [_getWinner(row), "row", i]
            }
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colArray = [];
            for (let row = 0; row < Gameboard.gameboard.length; row++) {
                colArray.push(Gameboard.gameboard[row][col])
            }
            if (_checkWin(colArray)) {
                return [_getWinner(colArray), "column", col]
            }
        }
        // Check diagonals for victory
        let diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][index]);
        }
        if (_checkWin(diagArray)) {
            return [_getWinner(diagArray), "diagonal", null]
        }
        diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][2 - index])
        }
        if (_checkWin(diagArray)) {
            return [_getWinner(diagArray), "reverseDiagonal", null]
        }
        // Check if draw
        for (let row = 0; row < Gameboard.gameboard.length; row++) {
            for (let col = 0; col < Gameboard.gameboard.length; col++) {
                if (Gameboard.gameboard[row][col] == null) {
                    return [null, null]
                }
            }
        }
        return ["tie", null]
    }

    const inputMove = (event) => {
        let tile = event.target;
        let row = tile.dataset.row
        let col = tile.dataset.col
        let player = Game.getActivePlayer();
        Gameboard.gameboard[row][col] = (player == Players.playerOne) ? true : false;
        Gameboard.render();
        let victory = checkVictory();
        let victor = victory[0]
        let victoryType = victory[1]
        let index = victory[2]
        if (victor == Players.playerOne || victor == Players.playerTwo) {
            _endGame(victor, victoryType, index)
        }
        if (victory[0] == "tie") {
            _drawGame()
        }
        toggleActivePlayer();
        _highlightActivePlayer();
        tile.removeEventListener("click", Game.inputMove)
        player = Game.getActivePlayer();
        makeMove(player)
    }

    const makeMachineMove = (player) => {
        let gameboard = Gameboard.gameboard
        let token;
        let isMaximisingPlayer
        if (player == Players.playerOne) {
            token = true;
            isMaximisingPlayer = true
        } else {
            token = false;
            isMaximisingPlayer = false
        }


        // start with loop over available moves first, and then recursive loop after

        ////// MINIMAX ALGORITHM //////
        const minimax = (board, isMaximisingPlayer) => {

            const evaluateBoard = (board) => {
                // Analyse gameboard for victory
                // Check rows for victory
                for (let i = 0; i < board.length; i++) {
                    let row = board[i];
                    if (row[0] != null && row[0] == row[1] && row[1] == row[2]) {
                        if (row[0] == true) {
                            return 10
                        } else {
                            return -10
                        }
                    }
                }
                // Check cols for victory
                for (let col = 0; col < 3; col++) {
                    let colArray = [];
                    for (let row = 0; row < board.length; row++) {
                        colArray.push(board[row][col])
                    }
                    if (colArray[0] != null && colArray[0] == colArray[1] && colArray[1] == colArray[2]) {
                        if (colArray[0] == true) {
                            return 10
                        } else {
                            return -10
                        }
                    }
                }

                // Check diagonals for victory
                let diagArray = [];
                for (let index = 0; index < board.length; index++) {
                    diagArray.push(board[index][index]);
                }
                if (diagArray[0] != null && diagArray[0] == diagArray[1] && diagArray[1] == diagArray[2]) {
                    if (diagArray[0] == true) {
                        return 10
                    } else {
                        return -10
                    }
                }
                diagArray = [];
                for (let index = 0; index < board.length; index++) {
                    diagArray.push(board[index][2 - index])
                }
                if (diagArray[0] != null && diagArray[0] == diagArray[1] && diagArray[1] == diagArray[2]) {
                    if (diagArray[0] == true) {
                        return 10
                    } else {
                        return -10
                    }
                }
                return 0;
            }

            let bestScore = (isMaximisingPlayer) ? -Infinity : Infinity
            let token = isMaximisingPlayer

            // If there are no available moves, it is a terminal state (end of branch)
            // just evaluate the state of the board and return the score
            // No need to return the move itself... that is already stored in {i, j} of parent minimax call
            let victoryCheck = checkVictory(board)
            if (victoryCheck[0] == Players.playerOne || victoryCheck[0] == Players.playerTwo || victoryCheck[0] == "tie") {
                return evaluateBoard(board)
            }

            // Assuming there are available moves, iterate over each possible move
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    // For each gameboard tile
                    if (board[i][j] == null) {
                        // If the tile is empty, make the move
                        board[i][j] = token
                        // Evaluate the score of this move
                        let score = minimax(board, !isMaximisingPlayer)
                        // If this is the best move found, remember the **SCORE**, not the move!
                        // The i, j move data is contained in the parent invocation of minimax, just need to return the score
                        // to decide whether to retain that i,j information or not
                        if (isMaximisingPlayer) {
                            if (score > bestScore) {
                                bestScore = score
                            }
                        } else if (!isMaximisingPlayer) {
                            if (score < bestScore) {
                                bestScore = score
                            }
                        }
                        // Unmake the move
                        board[i][j] = null
                    }
                }
            }
            return bestScore
        }
        ////// MINIMAX ALGORITHM //////

        let bestMove;
        let bestScore = (isMaximisingPlayer) ? -Infinity : Infinity

        for (let i = 0; i < gameboard.length; i++) {
            for (let j = 0; j < gameboard.length; j++) {
                // For each empty gameboard tile
                if (gameboard[i][j] == null) {
                    // If the tile is empty, make the move
                    gameboard[i][j] = token
                    // Evaluate the score of this move
                    let score = minimax(gameboard, !isMaximisingPlayer)
                    // If this is the best move found, remember the move
                    if (isMaximisingPlayer) {
                        if (score > bestScore) {
                            bestMove = { i, j }
                            bestScore = score
                        }
                    } else if (!isMaximisingPlayer) {
                        if (score < bestScore) {
                            bestMove = { i, j }
                            bestScore = score
                        }
                    }
                    // Unmake the move
                    gameboard[i][j] = null
                }
            }
        }

        // ******************************************
        // Actually implement the AI move here...
        let move = bestMove
        // If the board is complete, no moves left to make so just return
        if (move == undefined) {
            Gameboard.render();
            return
        } else {
            console.log(move)
            Gameboard.gameboard[move.i][move.j] = token
            Gameboard.render();
        }
        // ******************************************
    }

    const makeMove = (player) => {
        _highlightActivePlayer()
        console.log(`Player name: ${player.name}`)
        if (player.playerType == "human") {
            waitForHumanMove();
            return "continuePlay"
        }
        else if (player.playerType == "machine") {
            stopWaitingForHumanMove()
            return setTimeout(function () {
                makeMachineMove(player)
                let victorCheck = checkVictory()
                if (victorCheck[0] == Players.playerOne || victorCheck[0] == Players.playerTwo) {
                    console.log("VICTORY")
                    _endGame(victorCheck[0], victorCheck[1], victorCheck[2])
                    toggleActivePlayer();
                } else if (victorCheck[0] == "tie") {
                    console.log("DRAW")
                    _drawGame();
                } else {
                    toggleActivePlayer()
                    let player = getActivePlayer();
                    return makeMove(player)
                }
            }, 200)

        }
    }

    return { getActivePlayer, toggleActivePlayer, inputMove, waitForHumanMove, makeMove }
})()

Gameboard.render();

const Gameplay = (() => {

    // Functionality for human/AI buttons in header before game starts

    const _toggleButtonHumanOrAI = (event) => {
        let target = event.path[0]
        let parent = event.path[1]
        let siblings = [];
        // Update button visual interface
        for (let child = 0; child < parent.children.length; child++) {
            if (parent.children[child] != target) {
                siblings.push(parent.children[child])
            }
        }
        target.classList.add("activeButton")
        for (let child = 0; child < siblings.length; child++) {
            siblings[child].classList.remove("activeButton")
        }
        // Assign player type (AI/Human)
        let selectedPlayer = target.parentElement.dataset.player
        if (selectedPlayer == "playerOne") {
            Players.playerOne.playerType = target.dataset.playertype
        } else if (selectedPlayer == "playerTwo") {
            Players.playerTwo.playerType = target.dataset.playertype
        }
    }

    // Select human or AI
    Domain.playerButtons.forEach((player) => {
        let buttons = player.querySelectorAll("button")
        buttons.forEach((button) => {
            button.addEventListener("click", _toggleButtonHumanOrAI)
        })
    })

    // Start button to show gameboard, hide other buttons and begin game
    Domain.startButton.addEventListener("click", () => {
        if (Players.playerOne.playerType == null || Players.playerTwo.playerType == null) {
            alert("Please select Human or AI for both players")
            return;
        }

        // Update visual header information
        Domain.gameBoardHolder.style.display = "flex";
        Domain.startButton.style.display = "none";
        Domain.playerButtons.forEach((div) => {
            div.style.display = "none";
        })
        Domain.scoreCounters.forEach((div) => {
            div.style.display = "inline-block"
        })

        // Commence game
        let player = Game.getActivePlayer();
        Game.makeMove(player)
    })
})()