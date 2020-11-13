const gameBoardDiv = document.getElementById("gameBoard");

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
            let tile = gameBoardDiv.querySelector(`#tile-${row}-${col}`)
            tile.setAttribute("data-row", row);
            tile.setAttribute("data-col", col);
            rowHolder.push(tile)
        }
        tiles.push(rowHolder)
    }

    // Render the DOM elements - Public
    render = () => {
        for (let row = 0; row < gameboard.length; row++) {
            for (let col = 0; col < gameboard.length; col++) {
                if (gameboard[row][col] == true) {
                    tiles[row][col].textContent = "X"
                } else if (gameboard[row][col] == false) {
                    tiles[row][col].textContent = "O"
                } else {
                    Gameboard.tiles[row][col].textContent = "."
                }
            }
        }
        console.log("Gameboard has been rendered")
    }
    return { gameboard, render, tiles }
})()


const Game = (() => {

    const playerFactory = (name) => {
        let playerTurn;
        return { playerTurn, name }
    }

    const playerOne = playerFactory("Player One")
    const playerTwo = playerFactory("Player Two")

    getActivePlayer = () => {
        if (!playerOne.playerTurn && !playerTwo.playerTurn) {
            playerOne.playerTurn = true;
            playerTwo.playerTurn = false;
            return playerOne
        } else if (playerOne.playerTurn) {
            return playerOne
        } else {
            return playerTwo
        }
    }

    toggleActivePlayer = () => {
        playerOne.playerTurn = !playerOne.playerTurn;
        playerTwo.playerTurn = !playerTwo.playerTurn;
    }

    checkVictory = (player) => {
        // Checks array to see if all the same, i.e a winning combination
        _checkWin = (array, player) => {
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
                endGame(player, "row", i)
                return
            }
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colArray = [];
            for (let row = 0; row < Gameboard.gameboard.length; row++) {
                colArray.push(Gameboard.gameboard[row][col])
            }
            if (_checkWin(colArray, player)) {
                endGame(player, "column", col);
                return
            }
        }
        // Check diagonals for victory
        let diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][index]);
        }
        if (_checkWin(diagArray, player)) {
            endGame(player, "diagonal")
            return
        }
        diagArray = [];
        for (let index = 0; index < Gameboard.gameboard.length; index++) {
            diagArray.push(Gameboard.gameboard[index][2 - index])
        }
        if (_checkWin(diagArray, player)) {
            endGame(player, "reverseDiagonal")
            return
        };
        // Check if draw
        for (let row = 0; row < Gameboard.gameboard.length; row++) {
            for (let col = 0; col < Gameboard.gameboard.length; col++) {
                if (Gameboard.gameboard[row][col] == null) {
                    return
                }
            }
        }
        drawGame();
    }

    endGame = (player, victoryType, index) => {

        _highlightTiles = (tiles) => {
            for (let tile = 0; tile < tiles.length; tile++) {
                tiles[tile].classList.add("victoryTile")
            }
        }

        console.log("endgame function here");
        // Row victory
        if (victoryType == "row") {
            let victoryTiles = Gameboard.tiles[index];
            _highlightTiles(victoryTiles)
        }
        // Column victory
        if (victoryType == "column") {
            let victoryTiles = [];
            for (let row = 0; row < Gameboard.gameboard.length; row++) {
                victoryTiles.push(Gameboard.tiles[row][index])
            }
            _highlightTiles(victoryTiles)
        }
        // Diagonal victory (top left - bottom right)
        if (victoryType == "diagonal") {
            let victoryTiles = [];
            for (let index = 0; index < Gameboard.gameboard.length; index++) {
                victoryTiles.push(Gameboard.tiles[index][index])
            }
            _highlightTiles(victoryTiles)
        }
        // Diagonal victory (top right - bottom left)
        if (victoryType == "reverseDiagonal") {
            let victoryTiles = [];
            for (let index = 0; index < Gameboard.gameboard.length; index++) {
                victoryTiles.push(Gameboard.tiles[index][2 - index])
            }
            _highlightTiles(victoryTiles)
        }
    }

    drawGame = () => {
        console.log("this game is a draw")
    }

    makeMove = (event) => {
        let tile = event.target;
        let row = tile.dataset.row
        let col = tile.dataset.col
        let player = Game.getActivePlayer();
        Gameboard.gameboard[row][col] = (player == Game.playerOne) ? true : false;
        render();
        checkVictory(player);
        toggleActivePlayer();
        tile.removeEventListener("click", Game.makeMove)
    }

    Gameboard.tiles.forEach((row) => {
        for (let col = 0; col < row.length; col++) {
            let tile = row[col]
            tile.addEventListener("click", makeMove);
        }
    })

    return { getActivePlayer, toggleActivePlayer, playerOne, playerTwo, makeMove }
})()


Gameboard.render();