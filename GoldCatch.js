let units = [];
let goldPieces = [];
let goldCollected = 0;
let timeLeft = 180;
let timerInterval;

function initializeGame() {
    units = [{x: -2, y: -2}, {x: -1, y: -2}, {x: 0, y: -2}];
    goldPieces = generateGoldPieces(5);
    goldCollected = 0;
    timeLeft = 180;
    updateBoard();
    updateControls();
    updateGameInfo();
    startTimer();
}

function generateGoldPieces(count) {
    let gold = [];
    while (gold.length < count) {
        let x = Math.floor(Math.random() * 11) - 5;
        let y = Math.floor(Math.random() * 11) - 5;
        if (!gold.some(g => g.x === x && g.y === y) && !units.some(u => u.x === x && u.y === y)) {
            gold.push({x, y});
        }
    }
    return gold;
}

function newGame() {
    clearInterval(timerInterval);
    initializeGame();
}

function initializeBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let y = 5; y >= -5; y--) {
        for (let x = -5; x <= 5; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (x === 0 && y === 0) {
                cell.classList.add('origin');
            }
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = `${x},${y}`;
            board.appendChild(cell);
        }
    }
    updateBoard();
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        cell.innerHTML = `${x},${y}`;
        units.forEach((unit, index) => {
            if (unit.x === x && unit.y === y) {
                const unitDiv = document.createElement('div');
                unitDiv.className = 'unit';
                unitDiv.textContent = index + 1;
                cell.appendChild(unitDiv);
            }
        });
        goldPieces.forEach(gold => {
            if (gold.x === x && gold.y === y) {
                const goldDiv = document.createElement('div');
                goldDiv.className = 'gold';
                cell.appendChild(goldDiv);
            }
        });
    });
}

function updateControls() {
    const controlsDiv = document.getElementById('unit-controls');
    controlsDiv.innerHTML = '';
    units.forEach((unit, index) => {
        const unitControls = document.createElement('div');
        unitControls.innerHTML = `
            <h4>Unit ${index + 1} (${unit.x}, ${unit.y})</h4>
            X: <input type="number" id="u${index}-x" min="-5" max="5" value="0">
            Y: <input type="number" id="u${index}-y" min="-5" max="5" value="0">
        `;
        controlsDiv.appendChild(unitControls);
    });
}

function updateGameInfo() {
    document.getElementById('time-left').textContent = timeLeft;
    document.getElementById('gold-collected').textContent = goldCollected;
    document.getElementById('total-gold').textContent = goldPieces.length + goldCollected;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateGameInfo();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function executeMoves() {
    units.forEach((unit, index) => {
        const xInput = document.getElementById(`u${index}-x`);
        const yInput = document.getElementById(`u${index}-y`);
        if (xInput.value !== '' && yInput.value !== '') {
            const newX = Math.max(-5, Math.min(5, unit.x + parseInt(xInput.value)));
            const newY = Math.max(-5, Math.min(5, unit.y + parseInt(yInput.value)));
            unit.x = newX;
            unit.y = newY;
        }
    });

    collectGold();
    updateBoard();
    updateControls();
    updateGameInfo();

    if (goldPieces.length === 0) {
        clearInterval(timerInterval);
        endGame();
    }
}

function collectGold() {
    goldPieces = goldPieces.filter(gold => {
        if (units.some(unit => unit.x === gold.x && unit.y === gold.y)) {
            goldCollected++;
            return false;
        }
        return true;
    });
}

function endGame() {
    if (goldPieces.length === 0) {
        alert(`Congratulations! You collected all the gold in ${180 - timeLeft} seconds!`);
    } else {
        alert(`Time's up! You collected ${goldCollected} gold pieces.`);
    }
    newGame();
}

function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
}

// Initialize the game
initializeBoard();
initializeGame();