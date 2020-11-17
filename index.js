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
        let playerTurn;
        let score = 0;
        let playerType;
        return { playerTurn, name, score, playerType }
    }

    const playerOne = playerFactory("Player One")
    const playerTwo = playerFactory("Player Two")

    return { playerOne, playerTwo }
})()

const Header = (() => {

    const _toggleButton = (event) => {
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
            button.addEventListener("click", _toggleButton)
        })
    })

    const clearHeader = () => {
        // Update visual header information
        Domain.gameBoardHolder.style.display = "flex";
        Domain.startButton.style.display = "none";
        Domain.playerButtons.forEach((div) => {
            div.style.display = "none";
        })
        Domain.scoreCounters.forEach((div) => {
            div.style.display = "inline-block"
        })
    }

    return { clearHeader }

})()

const Gameboard = (() => {
    // What does a gameboard do? Store information, and update appearance for users
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
        // Unhighlight victory cells or unhighlight "draw" effect
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            for (let j = 0; j < Gameboard.gameboard.length; j++) {
                Gameboard.tiles[i][j].classList.remove("victoryTile")
                Gameboard.tiles[i][j].classList.remove("drawTile")
            }
        }
        // Hide victoryInfo and reveal playerDiv
        Domain.playersDiv.style.display = "flex"
        Domain.victoryInfo.style.display = "none"
        Game.addListeners();
        // Update gameboard
        Gameboard.render();
    }



    const checkVictory = (player) => {

        // draw meaning a non-win outcome, not "draw" as in render an image
        const _drawGame = () => {
            console.log("this game is a draw")
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

        const _endGame = (player, victoryType, index) => {

            const _highlightTiles = (tiles) => {
                for (let tile = 0; tile < tiles.length; tile++) {
                    tiles[tile].classList.add("victoryTile")
                }
            }

            const _removeListeners = () => {
                for (let row = 0; row < Gameboard.tiles.length; row++) {
                    for (let col = 0; col < Gameboard.tiles.length; col++) {
                        Gameboard.tiles[row][col].removeEventListener("click", Game.inputMove)
                    }
                }
            }

            const _updateScores = (player) => {
                console.log("UPDATE SCORES")
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
            _removeListeners()
            _updateScores(player)


            // const playersDiv = document.getElementById("playersDiv")
            // Domain.playersDiv.style.display = "none"
            // const victoryInfo = document.getElementById("victoryInfo")
            Domain.victoryInfo.style.display = "flex"
            // const victoryAlert = document.getElementById("victoryAlert")
            Domain.victoryAlert.textContent = `${player.name} won the game!`

            // Play again button
            Domain.playAgain.addEventListener("click", _rematch)
        }

        // Checks array to see if all the same, i.e a winning combination
        const _checkWin = (array, player) => {
            let check = array.every((item) => {
                if (item == array[0] && array[0] != null) {
                    return true;
                } else {
                    return false;
                }
            })
            if (check) {
                console.log(`${player.name} won the game!`)
                return true;
            }
        }
        // Analyse gameboard for victory
        // Check rows for victory
        for (let i = 0; i < Gameboard.gameboard.length; i++) {
            let row = Gameboard.gameboard[i];
            if (_checkWin(row, player)) {
                _endGame(player, "row", i)
                return true
            }
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colArray = [];
            for (let row = 0; row < Gameboard.gameboard.length; row++) {
                colArray.push(Gameboard.gameboard[row][col])
            }
            if (_checkWin(colArray, player)) {
                _endGame(player, "column", col);
                return true
            }
        }
        // Check diagonals for victory
        let diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][index]);
        }
        if (_checkWin(diagArray, player)) {
            _endGame(player, "diagonal")
            return true
        }
        diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][2 - index])
        }
        if (_checkWin(diagArray, player)) {
            _endGame(player, "reverseDiagonal")
            return true
        };
        // Check if draw
        for (let row = 0; row < Gameboard.gameboard.length; row++) {
            for (let col = 0; col < Gameboard.gameboard.length; col++) {
                if (Gameboard.gameboard[row][col] == null) {
                    return
                }
            }
        }
        return _drawGame();
    }

    const inputMove = (event) => {
        let tile = event.target;
        let row = tile.dataset.row
        let col = tile.dataset.col
        let player = Game.getActivePlayer();
        Gameboard.gameboard[row][col] = (player == Players.playerOne) ? true : false;
        Gameboard.render();
        checkVictory(player);
        toggleActivePlayer();
        _highlightActivePlayer();
        tile.removeEventListener("click", Game.inputMove)
        player = Game.getActivePlayer();
        makeMove(player)
    }

    const makeMachineMove = (player) => {
        let gameboard = Gameboard.gameboard
        let token;
        if (player == Players.playerOne) {
            token = true;
        } else {
            token = false;
        }
        ////// MINIMAX ALGORITHM //////

        const evaluateBoard = (board) => {
            // Analyse gameboard for victory
            // Check rows for victory
            for (let i = 0; i < gameboard.length; i++) {
                let row = gameboard[i];
                if (row[i][0] != null && row[i][0] == row[i][1] && row[i][1] == row[i][2]) {
                    if (row[i][0] == true) {
                        return 10
                    } else {
                        return -10
                    }
                }
            }
            // Check cols for victory
            for (let col = 0; col < 3; col++) {
                let colArray = [];
                for (let row = 0; row < Gameboard.gameboard.length; row++) {
                    colArray.push(Gameboard.gameboard[row][col])
                }
                if (colArray[0] != null && colArray[0] == colArray[1] && colArray[1] == colArray[2]) {
                    if (row[i][0] == true) {
                        return 10
                    } else {
                        return -10
                    }
                }
            }

            // Check diagonals for victory
            let diagArray = [];
            for (let index = 0; index < gameboard.length; index++) {
                diagArray.push(gameboard[index][index]);
            }
            if (diagArray[0] != null && diagArray[0] == diagArray[1] && diagArray[1] == diagArray[2]) {
                if (row[i][0] == true) {
                    return 10
                } else {
                    return -10
                }
            }
            diagArray = [];
            for (let index = 0; index < gameboard.length; index++) {
                diagArray.push(gameboard[index][2 - index])
            }
            if (diagArray[0] != null && diagArray[0] == diagArray[1] && diagArray[1] == diagArray[2]) {
                if (row[i][0] == true) {
                    return 10
                } else {
                    return -10
                }
            }
            return 0;
        }

        const findBestMove = (board) => {
            let bestMove = null
            // get possible moves
            let possibleMoves = []
            for (let i = 0; i < gameboard.length; i++) {
                for (let j = 0; j < gameboard.length; j++) {
                    if (gameboard[i][j] == null) {
                        possibleMoves.push([i, j])
                    }
                }
            }
            // identify best move
            for (let k = 0; k < possibleMoves.length; k++) {
                let trialGameboard = gameboard;
                let i = possibleMoves[k][0]
                let j = possibleMoves[k][1]
                trialGameboard[i][j] = token
                if (evaluateBoard(trialGameboard) > bestMove) {
                    bestMove = [i, j]
                }
            }
            return bestMove
        }

        const isMovesLeft = (board) = () => {
            // Check if board is completed
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board.length; col++) {
                    if (board[row][col] == null) {
                        return true
                    }
                }
            }
            return false
        }

        const minimax = (board, depth, isMaximisingPlayer) => {


            if (evaluateBoard(board) == 10 || evaluateBoard(board) == -10) {
                return evaluateBoard(board)
            }

            // get possible moves
            let possibleMoves = []
            for (let i = 0; i < gameboard.length; i++) {
                for (let j = 0; j < gameboard.length; j++) {
                    if (gameboard[i][j] == null) {
                        possibleMoves.push([i, j])
                    }
                }
            }
            // find best move
            if (isMaximisingPlayer) {
                let bestVal = -1000
                for (let k = 0; k < possibleMoves.length; k++) {
                    let value = minimax(board, depth + 1, false)
                    bestVal = max(bestVal, value)
                }
                return bestVal
            }
            else {
                let bestVal = 1000
                for (let k = 0; k < possibleMoves.length; k++) {
                    let value = minimax(board, depth + 1, true)
                    bestVal = max(bestVal, value)
                }
                return bestVal
            }
        }



        ////// MINIMAX ALGORITHM //////
    }



    const makeMove = (player) => {
        console.log(`Player name: ${player.name}`)
        console.log(`Player type: ${player.playerType}`)
        if (player.playerType == "human") {
            console.log("Human: continue play")
            return "continuePlay"
        }
        else if (player.playerType == "machine") {
            return setTimeout(function () {
                makeMachineMove(player)
                Gameboard.render();
                if (checkVictory(player)) {
                    return "victory"
                } else {
                    toggleActivePlayer()
                    let player = getActivePlayer();
                    return makeMove(player)
                }
            }, 1000)

        }
    }

    const addListeners = () => {
        Gameboard.tiles.forEach((row) => {
            for (let col = 0; col < row.length; col++) {
                let tile = row[col]
                tile.addEventListener("click", inputMove);
            }
        })
    }
    addListeners();

    return { getActivePlayer, toggleActivePlayer, inputMove, addListeners, makeMove }
})()

Gameboard.render();

const Gameplay = (() => {

    // Start button to show gameboard, and hide other buttons
    Domain.startButton.addEventListener("click", () => {



        if (Players.playerOne.playerType == null || Players.playerTwo.playerType == null) {
            alert("Please select Human or AI for both players")
            return;
        }

        Header.clearHeader();


        // Commence game
        let player = Game.getActivePlayer();
        Game.makeMove(player)
    })
})()
