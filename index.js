const Gameboard = (() => {
    // What does a gameboard do? Store information, and update appearance for users
    let gameboard = [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1],
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
    return { makeMove }
}

const Game = (() => {
    // What does a game do? Keep track of whose turn it is. Check for a winner after each move.
    activeTurn = () => {

    }
})()





// const playerOne = playerFactory("Player One")
// const playerTwo = playerFactory("Player Two")

// playerOne.makeMove();
// playerTwo.makeMove();