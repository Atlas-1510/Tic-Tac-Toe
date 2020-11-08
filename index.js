const gameBoardDiv = document.getElementById("gameBoard");

const Gameboard = (() => {
    // What does a gameboard do? Store information, and update appearance for users
    let gameboard = [
        [null, false, null],
        [true, null, true],
        [null, false, null],
    ]
    // Link up the DOM to the javascript elements, and add event listeners - Private
    const tiles = [];
    for (let i = 0; i < gameboard.length; i++) {
        let row = [];
        for (let j = 0; j < gameboard.length; j++) {
            let tile = gameBoardDiv.querySelector(`#tile-${i}-${j}`)
            row.push(tile)
            tile.addEventListener("click", (event) => {
                console.log(event.target)
                updateTile(event.target)
            })
        }
        tiles.push(row)
    }
    console.log("DOM elements have been linked and listeners added")

    updateTile = (tile) => {
        let player = Game.getActivePlayer();

    }



    // Render/Update the DOM elements - Public
    render = () => {
        for (let row = 0; row < tiles.length; row++) {
            for (let col = 0; col < tiles.length; col++) {
                if (gameboard[row][col] == true) {
                    tiles[row][col].textContent = "X"
                } else if (gameboard[row][col] == false) {
                    tiles[row][col].textContent = "O"
                } else {
                    tiles[row][col].textContent = ""
                }
            }
        }
        console.log("Gameboard has been rendered")
    }
    return { gameboard, render, updateTile }
})()

const playerFactory = (name) => {
    // What does a player do? Issue changes to the gameboard. Everytime a player makes a move, a command to refresh the gameboard is issued
    const makeMove = () => {
        console.log(`${name} made a move`);
        Gameboard.render();
    }
    // variable to determine whether it is the players move or not
    let playerTurn;
    return { makeMove, playerTurn, name }
}

const Game = (() => {
    const playerOne = playerFactory("Player One")
    const playerTwo = playerFactory("Player Two")

    getActivePlayer = () => {
        if (!playerOne.playerTurn && !playerTwo.playerTurn) {
            playerOne.playerTurn = true;
            playerTwo.playerTurn = false;
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

    playRound = () => {
        playerOne.makeMove();
        _checkVictory(playerOne);
        playerTwo.makeMove();
        _checkVictory(playerTwo);
    }

    _checkVictory = (player) => {
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
                _endGame(player);
            }
        }

        // Analyse gameboard for victory
        let victoryMatrix = [...Gameboard.gameboard]
        // Check rows for victory
        for (let i = 0; i < victoryMatrix.length; i++) {
            let row = victoryMatrix[i];
            _checkWin(row, player);
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colArray = [];
            for (let row = 0; row < victoryMatrix.length; row++) {
                colArray.push(victoryMatrix[row][col])
            }
            _checkWin(colArray, player)
        }
        // Check diagonals for victory
        let diagArray = [];
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagArray.push(victoryMatrix[index][index]);
        }
        _checkWin(diagArray);
        diagArray = [];
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagArray.push(victoryMatrix[index][2 - index])
        }
        _checkWin(diagArray, player);
    }

    _endGame = (player) => {
        console.log(`${player.name} won the game!`)
    }

    return { playRound, getActivePlayer, toggleActivePlayer }
})()

Game.playRound();

