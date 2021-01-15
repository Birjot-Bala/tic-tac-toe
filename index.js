const GameBoard = (() => {
    const BOARD = new Int8Array(9);

    const isValidIndex = (index) => {
        return BOARD[index] == 0 && index < BOARD.length;
    };

    const play = (turn, index) => {
        if (isValidIndex(index)) {
            BOARD[index] = turn;
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

    return {
        play,
        checkWinner,
    }
})();

const Player = (number, symbol) => {

    const getNumber = () => number;
    const getSymbol = () => symbol;

    return {
        getNumber,
        getSymbol,
    }
};

const GameController = (() => {
    const PLAYER_1 = Player(1, 'close');
    const PLAYER_2 = Player(-1, 'panorama_fish_eye');

    let turn = PLAYER_1 // Starts with player 1
    let gameOver = false;

    const nextTurn = () => {
        if (!gameOver) {
            turn = (turn == PLAYER_1)? PLAYER_2: PLAYER_1;
        }
    };

    const currentPlayer = () => turn;

    const playTurn = (index) => {
        if (!gameOver) {
            GameBoard.play(turn, index);
            let hasWinner = GameBoard.checkWinner();
            if (hasWinner != 0) {
                gameOver = true;
            }
        }
    };

    return {
        nextTurn,
        playTurn,
        currentPlayer,
    }
})();

const DisplayController = ((doc) => {
    const initializeDisplay = (selector, cellClass) => {
        if (!!doc && 'querySelector' in doc) {
            const GRID = doc.querySelector(selector);
            for (let i = 0; i < 9; i++) {
                let cell = doc.createElement('button');
                let cellSymbol = doc.createElement('i');
  
                cell.id = i;
                cell.addEventListener('click', () => {
                    let currentPlayer = GameController.currentPlayer();
                    cellSymbol.textContent = currentPlayer.getSymbol();
                    GameController.nextTurn();
                });

                cellSymbol.classList.add('material-icons');
                cell.classList.add(cellClass);
                cell.appendChild(cellSymbol);
                GRID.appendChild(cell);
            }
        }
    };

    return {
        initializeDisplay,
    }
})(document);

DisplayController.initializeDisplay('#grid', 'cells');