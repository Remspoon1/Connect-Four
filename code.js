let dataModel = {
    turnPlayer: 'RED', //RED or BLK
    totalMoves: 0,
    isGameOver: false,
    previousMove: [], //[row, col]
    grid: [
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
        [ null, null, null, null, null, null, null ],
    ]
}




////////////////SECTION 3/////////////////////
function renderColumn(col) {
    let column = Array.from(document.querySelectorAll('.column'))[col];
    let discs = Array.from(column.querySelectorAll('.disc'));
    for(let row = 0; row < dataModel.grid.length; row++) {
        if(dataModel.grid[row][col]) {
            let disc = discs[row];
            
            switch(dataModel.grid[row][col]) {
                case 'RED':
                    disc.classList.add('red');
                    break;
                case 'BLK':
                    disc.classList.add('blk');
                    break;
                default:
                    break;
            }
            break;
        }
    }    
}

function renderResult(result) {
    let screen = document.createElement('div');
    screen.classList.add('screen');

    let crack = document.createElement('div');
    crack.classList.add('crack');

    let sign = document.createElement('div');
    sign.classList.add('sign');

    if(result === 1) {
        //Say who won
        sign.style.backgroundImage = 'url(/images/america.gif)';

        let playerName = document.createElement('img');
        playerName.classList.add('player_name_win');

        if(dataModel.turnPlayer === 'RED') {
            playerName.src = '/images/red.png';
        } else {
            playerName.src = '/images/black.png';
        }
        sign.append(playerName);

        let wins = document.createElement('img');
        wins.classList.add('wins');
        wins.src = '/images/wins.png';
        sign.append(wins);    
    } else {
        //Say it tied
        sign.style.backgroundImage = 'url(/images/shake.jpg)';

        let playerLeft = document.createElement('img');
        playerLeft.classList.add('player_left');
        playerLeft.src = '/images/red.png';

        let playerRight = document.createElement('img');
        playerRight.classList.add('player_right');
        playerRight.src = '/images/black.png';
        
        let tie = document.createElement('img');
        tie.classList.add('tie');
        tie.src = '/images/tie.png';
        sign.append(playerLeft, playerRight, tie);
    }
    crack.append(sign);
    screen.append(crack);
    document.body.append(screen);    
}

function validateMove(col) {
    for(let row = dataModel.grid.length-1; row >= 0; row--) {
        if(!dataModel.grid[row][col]) {
            return row;
        }
    }
    return -1;
}

function addDiscToDataModel(row, col) {
    dataModel.grid[row][col] = dataModel.turnPlayer;
    dataModel.previousMove = [row, col];
}

function renderCurrentPlayer() {
    document.querySelector('.disc_head.red').classList.toggle('selected');
    document.querySelector('.disc_head.blk').classList.toggle('selected');
    document.querySelector('.red_name').classList.toggle('current');
    document.querySelector('.blk_name').classList.toggle('current');    
}

function flipTurn() {
    if(dataModel.turnPlayer === 'RED') {
        dataModel.turnPlayer = 'BLK';
    } else {
        dataModel.turnPlayer = 'RED';
    }
    renderCurrentPlayer();
}

function updateDataModel(event) {
    if(dataModel.isGameOver) {
        return;
    }

    let grid = document.querySelector('.grid');
    let targetDiv = event.target;
    if(targetDiv.classList.contains('disc')) {
        targetDiv = targetDiv.parentNode;
    }
    let col = Array.prototype.indexOf.call(grid.children, targetDiv);
    

    //Validate the move
    let row = validateMove(col);
    if(row !== -1) {
        //Adds move to data model
        addDiscToDataModel(row, col);

        //Renders the changed column
        renderColumn(col);

        //Update number of moves made in data model
        dataModel.totalMoves++;

        //Checks if game is over
        let result = checkGameOver(dataModel);
        if(result !== -1) {
            dataModel.isGameOver = true;
            renderResult(result);
            return;
        }

        //Changes the current player
        flipTurn();
    }
}

function resetGame() {
    location.reload()
}

////////////////SECTION 4/////////////////////
function checkGameOver(dataModel) {
    if(checkColumn(dataModel.previousMove)) {
        return 1;
    } else if(checkRow(dataModel.previousMove)) {
        return 1;
    } else if(checkForwardDiagonal(dataModel.previousMove)) {
        return 1;
    } else if(checkBackwardDiagonal(dataModel.previousMove)) {
        return 1;
    } else if(dataModel.totalMoves === 42) {
        //Tied game
        return 0;
    } else {
        //Game still going
        return -1;
    }
}

function checkColumn(position) {
    let count = 0;
    let row = position[0];
    let col = position[1];
    while((row < dataModel.grid.length) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        row++;
        count++;
    }

    if(count === 4) {
        return true;
    } else {
        return false;
    }   
}

function checkRow(position) {
    let count = 0;
    let row = position[0];
    let col = position[1];
    while((col >= 0) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        col--;
        count++;
    }

    col = position[1];
    count--;
    while((col < dataModel.grid[0].length) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        col++;
        count++;
    }

    if(count >= 4) {
        return true;
    } else {
        return false;
    }
}

function checkForwardDiagonal(position) {
    let count = 0;
    let row = position[0];
    let col = position[1];
    while((row >= 0) && (col < dataModel.grid[0].length) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        row--;
        col++;
        count++;
    }

    row = position[0];
    col = position[1];
    count--;
    while((row < dataModel.grid.length) && (col >= 0) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        row++;
        col--;
        count++;
    }

    if(count >= 4) {
        return true;
    } else {
        return false;
    }
}

function checkBackwardDiagonal(position) {
    let count = 0;
    let row = position[0];
    let col = position[1];
    while((row >= 0) && (col >= 0) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        row--;
        col--;
        count++;
    }

    row = position[0];
    col = position[1];
    count--;
    while((row < dataModel.grid.length) && (col < dataModel.grid[0].length) && (dataModel.grid[row][col] === dataModel.turnPlayer)) {
        row++;
        col++;
        count++;
    }

    if(count >= 4){
        return true;
    } else {
        return false;
    }
}