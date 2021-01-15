const GameBoard = (() => {
    const BOARD = new Int8Array(9);

    const isValidIndex = (index) => {
        return BOARD[index] == 0 && index < BOARD.length;
    };

    const play = (playerTurn, index) => {
        if (isValidIndex(index)) {
            BOARD[index] = playerTurn.getNumber();
            return checkWinner();
        }
    };

    const checkWinner = () => {
        // Check rows for winner
        for (let i = 0; i < 9; i += 3) {
            if (BOARD[i] != 0
                && BOARD[i] == BOARD[i + 1]
                && BOARD[i] == BOARD[i + 2]) {
                return BOARD[i];
            }
        }
        
        // Check columns for winner
        for (let i = 0; i < 3; i++) {
            if (BOARD[i] != 0
                && BOARD[i] == BOARD[i + 3]
                && BOARD[i] == BOARD[i + 6]) {
                return BOARD[i];
            }
        }

        // Check l-r diagonal
        if (BOARD[0] != 0
            && BOARD[0] == BOARD[4]
            && BOARD[0] == BOARD[8]) {
            return BOARD[0];
        }
        
        // Check r-l diagonal
        if (BOARD[2] != 0
            && BOARD[2] == BOARD[4]
            && BOARD[2] == BOARD[6]) {
            return BOARD[2]
        }

        // Else return 0
        return 0;
    };

    const resetGameBoard = () => {
        for (let i = 0; i < 9; i++) {
            BOARD[i] = 0;
        }
    }

    return {
        play,
        resetGameBoard,
    }
})();

const Player = (number, symbol, name) => {

    const getNumber = () => number;
    const getSymbol = () => symbol;
    const getName = () => name;

    return {
        getNumber,
        getSymbol,
        getName,
    }
};

const GameController = ((doc) => {
    const PLAYER_1 = Player(1, 
                        'close', 
                        doc.querySelector('#player-one-name').value);
    const PLAYER_2 = Player(-1, 
                        'panorama_fish_eye', 
                        doc.querySelector('#player-two-name').value);

    let playerTurn = PLAYER_1 // Starts with player 1
    let turnNumber = 1;
    let gameOver = false;

    const nextTurn = () => {
        if (!gameOver) {
            playerTurn = (playerTurn == PLAYER_1)? PLAYER_2: PLAYER_1;
            turnNumber++;
        }
    };

    const currentPlayer = () => playerTurn;

    const isGameOver = () => gameOver;

    const playTurn = (index) => {
        if (!gameOver) {
            if (turnNumber == 9) {
                gameOver = true;
                alert('Tie!')
            }
            let result = GameBoard.play(playerTurn, index);
            if (result == 0) {
                nextTurn();
            } else {
                gameOver = true;
                alert(`${playerTurn.getName()} wins!`)
            }
        }
    }

    const newGame = () => {
        playerTurn = PLAYER_1 // Starts with player 1
        turnNumber = 1;
        gameOver = false;

        GameBoard.resetGameBoard();
    }

    return {
        playTurn,
        currentPlayer,
        isGameOver,
        newGame,
    }
})(document);

const DisplayController = ((doc) => {
    const initializeDisplay = (selector, cellClass, buttonSelector) => {
        if (!!doc && 'querySelector' in doc) {
            setupClearButton(buttonSelector, selector);
            const GRID = doc.querySelector(selector);
            for (let i = 0; i < 9; i++) {
                let cell = doc.createElement('button');
                let cellSymbol = doc.createElement('i');
  
                cell.id = i;
                cell.addEventListener('click', () => {
                    if (cellSymbol.textContent == "" && !GameController.isGameOver()) {
                        cellSymbol.textContent = GameController.currentPlayer().getSymbol();
                        GameController.playTurn(i);
                    }
                });

                cellSymbol.classList.add('material-icons');
                cell.classList.add(cellClass);
                cell.appendChild(cellSymbol);
                GRID.appendChild(cell);
            }
        }
    };

    const resetDisplay = (selector) => {
        if (!!doc && 'querySelector' in doc) {
            const GRID = doc.querySelector(selector);
            for (let i = 0; i < GRID.children.length; i++) {
                GRID.children[i].firstChild.textContent = "";
            }
        }
    };

    const setupClearButton = (selector, gridSelector) => {
        if (!!doc && 'querySelector' in doc) {
            const clearButton = doc.querySelector(selector);
            clearButton.addEventListener('click', () => {
                GameController.newGame();
                resetDisplay(gridSelector);
            });
        }
    };

    return {
        initializeDisplay,
        resetDisplay,
    }
})(document);

DisplayController.initializeDisplay('#grid', 'cells', '#clear-button');