const Gameboard = (() => {
    // What does a gameboard do? Store information, and update appearance for users
    let gameboard = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]
    // Link up the DOM to the javascript elements - Private
    console.log("DOM elements have been linked")
    // Render/Update the DOM elements - Public
    render = () => {
        console.log("Gameboard has been rendered")
    }
    return { gameboard, render }
})()

const playerFactory = (name) => {
    // What does a player do? Issue changes to the gameboard. Everytime a player makes a move, a command to refresh the gameboard is issued
    const makeMove = () => {
        console.log(`${name} made a move`);
        Gameboard.render();
    }
    // variable to determine whether it is the players move or not
    let playerTurn;
    return { makeMove, playerTurn }
}

const Game = (() => {
    const playerOne = playerFactory("Player One")
    const playerTwo = playerFactory("Player Two")

    playRound = () => {
        playerOne.makeMove();
        _checkVictory(playerOne);
        playerTwo.makeMove();
        _checkVictory(playerTwo);
    }

    _checkVictory = (player) => {
        // Analyse gameboard for victory
        let victoryMatrix = [...Gameboard.gameboard]
        // Check rows for victory
        for (let i = 0; i < victoryMatrix.length; i++) {
            let row = victoryMatrix[i];
            let rowSum = row.reduce((a, b) => { return a + b });
            if (rowSum == 3) {
                endGame(player);
            }
        }
        // Check columns for victory
        for (let col = 0; col < 3; col++) {
            let colSum = 0;
            for (row = 0; row < victoryMatrix.length; row++) {
                colSum += victoryMatrix[row][col]
            }
            if (colSum == 3) {
                endGame(player);
            }
        }
        // Check diagonals for victory
        let diagSum = 0;
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagSum += victoryMatrix[index][index]
        }
        if (diagSum == 3) {
            endGame(player);
        }
        diagSum = 0;
        for (let index = 0; index < victoryMatrix.length; index++) {
            diagSum += victoryMatrix[index][2 - index]
        }
        if (diagSum == 3) {
            endGame(player);
        }
    }

    endGame = (player) => {
        console.log(`${player} won the game!`)
    }
    playRound();
})()


