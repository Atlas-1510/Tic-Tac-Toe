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
        let victoryMatrix = [...Gameboard.gameboard]
        // Check rows for victory
        for (let i = 0; i < victoryMatrix.length; i++) {
            let row = victoryMatrix[i];
            if (_checkWin(row, player)) {
                endGame(player)
            }
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colArray = [];
            for (let row = 0; row < victoryMatrix.length; row++) {
                colArray.push(victoryMatrix[row][col])
            }
            if (_checkWin(colArray, player)) {
                endGame(player);
            }
        }
        // Check diagonals for victory
        let diagArray = [];
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagArray.push(victoryMatrix[index][index]);
        }
        if (_checkWin(diagArray, player)) {
            endGame(player)
        }
        diagArray = [];
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagArray.push(victoryMatrix[index][2 - index])
        }
        if (_checkWin(diagArray, player)) {
            endGame(player)
        };
    }

    endGame = (player) => {
        console.log("endgame function here");
    }

    return { getActivePlayer, toggleActivePlayer, playerOne, playerTwo }
})()

const addListeners = (() => {
    _makeMove = (e) => {
        console.log("active")
        let tile = e.target;
        let row = tile.dataset.row
        let col = tile.dataset.col
        let player = Game.getActivePlayer();
        console.log(player);
        Gameboard.gameboard[row][col] = (player == Game.playerOne) ? true : false;
        render();
        checkVictory(player);
        toggleActivePlayer();
    }

    Gameboard.tiles.forEach((row) => {
        for (let col = 0; col < row.length; col++) {
            let tile = row[col]
            // console.log(tile);
            tile.addEventListener("click", _makeMove);
        }
    })
})()

Gameboard.render();




























Gameboard.render();




// tile.addEventListener("click", Game.makeMove(tile))


// makeMove = (tile) => {
//     _updateTile = (tile, player) => {
//         console.log(`player = ${player.name}`)
//         let row = tile.dataset.row
//         let col = tile.dataset.col
//         Gameboard.gameboard[row][col] = (player == Game.playerOne) ? true : false;
//     }

//     let player = Game.getActivePlayer();
//     _updateTile(tile, player)
//     Gameboard.render()
//     Game.checkVictory(player)
//     Game.toggleActivePlayer()


// }