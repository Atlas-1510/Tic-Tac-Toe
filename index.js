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
                    tiles[row][col].textContent = " "
                }
            }
        }
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

    _highlightActivePlayer = () => {
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

        _removeListeners = () => {
            for (let row = 0; row < Gameboard.tiles.length; row++) {
                for (let col = 0; col < Gameboard.tiles.length; col++) {
                    Gameboard.tiles[row][col].removeEventListener("click", Game.makeMove)
                }
            }
        }

        console.log("endgame function here");
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


        const playersDiv = document.getElementById("playersDiv")
        playersDiv.style.display = "none"
        const victoryInfo = document.getElementById("victoryInfo")
        victoryInfo.style.display = "flex"
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
        _highlightActivePlayer();
        tile.removeEventListener("click", Game.makeMove)
    }

    addListeners = () => {
        Gameboard.tiles.forEach((row) => {
            for (let col = 0; col < row.length; col++) {
                let tile = row[col]
                tile.addEventListener("click", makeMove);
            }
        })
    }
    addListeners();

    return { getActivePlayer, toggleActivePlayer, playerOne, playerTwo, makeMove, addListeners }
})()


const header = (() => {

    const buttonFunctionality = (() => {
        const startButton = document.getElementById("startButton")
        const gameBoardHolder = document.getElementById("gameBoardHolder")
        const playerButtons = document.querySelectorAll(".playerButtons")

        // Start button to show gameboard, and hide other buttons
        startButton.addEventListener("click", () => {
            gameBoardHolder.style.display = "flex";
            startButton.style.display = "none";
            playerButtons.forEach((div) => {
                div.style.display = "none";
            })
        })

        _toggleButton = (event) => {
            let target = event.path[0]
            let parent = event.path[1]
            let siblings = [];
            for (let child = 0; child < parent.children.length; child++) {
                if (parent.children[child] != target) {
                    siblings.push(parent.children[child])
                }
            }

            target.classList.add("activeButton")
            for (let child = 0; child < siblings.length; child++) {
                siblings[child].classList.remove("activeButton")
            }
        }

        // Select human or AI
        playerButtons.forEach((player) => {
            let buttons = player.querySelectorAll("button")
            buttons.forEach((button) => {
                button.addEventListener("click", _toggleButton)
            })
        })

        _rematch = () => {
            // Clear gameboard
            for (let i = 0; i < Gameboard.gameboard.length; i++) {
                Gameboard.gameboard[i].fill(null)
            }
            // Unhighlight victory cells
            for (let i = 0; i < Gameboard.gameboard.length; i++) {
                for (let j = 0; j < Gameboard.gameboard.length; j++) {
                    Gameboard.tiles[i][j].classList.remove("victoryTile")
                }
            }
            // Hide victoryInfo and reveal playerDiv
            const playersDiv = document.getElementById("playersDiv")
            playersDiv.style.display = "flex"
            const victoryInfo = document.getElementById("victoryInfo")
            victoryInfo.style.display = "none"
            Game.addListeners();

            // Update gameboard
            Gameboard.render();
        }


        // Play again button
        const playAgain = document.getElementById("playAgain")
        playAgain.addEventListener("click", _rematch)
    })()
})()

Gameboard.render();

