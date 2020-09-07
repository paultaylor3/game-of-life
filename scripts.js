const WINDOW_DIM = Math.floor(window.innerHeight * .97);
const CYCLE_INTERVAL = 100;
const GRID_DIV = document.getElementsByClassName('gridContainer')[0];
const RIGHT_DIV = document.getElementsByClassName('rightContainer')[0];
const BUTTON_OUTER_DIV = document.getElementsByClassName('buttonContainer')[0];
const PLAY_DIV = document.getElementsByClassName('playGame')[0];
const SETTINGS_DIV = document.getElementsByClassName('settings')[0];
const TITLE_ELEM = document.getElementById('title');
const EMPTY_BACKGROUND = 'white';
const FULL_BACKGROUND = 'black';
let amountCycles = 0;
let gameLoop;
let running = false;

function changeBackground(node) {
  if (node.style.backgroundColor === EMPTY_BACKGROUND) {
    node.style.backgroundColor = FULL_BACKGROUND;
  } else {
    node.style.backgroundColor = EMPTY_BACKGROUND;
  }
}

function changeBackgroundWrapper() {
  // workaround for event handlers not accepting arguments
  changeBackground(event.target);
}

function createGrid(rowNum=20) {
  /*
  Make rowNum x rowNum grid that is adapted to the size of the browser window
  Also give each cell an id saying its row and column numbers
  */
  const SQUARE_DIM = Math.floor(WINDOW_DIM / rowNum);
  const table = document.createElement('table');
  table.style.backgroundColor = FULL_BACKGROUND;

  for (let i = 0; i < rowNum; i++) {
    let row = document.createElement('tr');
    row.id = i;

    for (let j = 0; j < rowNum; j++) {
      let datum = document.createElement('td');
      datum.style.backgroundColor = EMPTY_BACKGROUND;
      datum.id = `${i},${j}`;
      datum.onclick = changeBackgroundWrapper;
      row.appendChild(datum);
    }
    table.appendChild(row);
  }
  table.style.height = WINDOW_DIM + 'px';
  table.style.width = WINDOW_DIM + 'px';

  GRID_DIV.appendChild(table);
}

function clearGrid() {
  const tableElem = document.getElementsByTagName('table')[0];
  for (let row of tableElem.childNodes) {
    for (let cell of row.childNodes) {
      if (cell.style.backgroundColor === FULL_BACKGROUND) {
        cell.style.backgroundColor = EMPTY_BACKGROUND;
      }
    }
  }
}

function fixButtonPadding() {
  PLAY_DIV.style.padding = '0px';  // reset padding to calculate how much to pad again
  const toPad = RIGHT_DIV.offsetHeight - TITLE_ELEM.offsetHeight - PLAY_DIV.offsetHeight - SETTINGS_DIV.offsetHeight - 3 * 29;
  PLAY_DIV.style.paddingTop = Math.floor(toPad / 2) + 'px';
  PLAY_DIV.style.paddingBottom = Math.floor(toPad / 2) + 'px';
}

function changeButtons() {
  const instructions = PLAY_DIV.childNodes[0];
  const stopButton = document.getElementById('startGame');

  if (! running) {
    instructions.innerHTML = 'Press "Stop game" to end the simulation';
    stopButton.innerHTML = 'Stop game';
    stopButton.onclick = stopGame;
    running = true;
  } else {
    instructions.innerHTML = 'Click on any boxes in the grid to make a starting pattern, then click "Start game!"';
    stopButton.innerHTML = 'Start game!';
    stopButton.onclick = startGame;
    running = false;
  }
  fixButtonPadding();
}

function getNeighborNodes(node) {
  const nodeId = node.id.split(',');
  const nodeRow = parseInt(nodeId[0]);
  const nodeCol = parseInt(nodeId[1]);
  let liveNeighbors = 0;

  for (let row = nodeRow - 1; row <= nodeRow + 1; row++) {
    for (let col = nodeCol - 1; col <= nodeCol + 1; col++) {
      if (`${row},${col}` !== node.id) {
        let neighbor = document.getElementById(`${row},${col}`);
        if (neighbor) {
          if (neighbor.style.backgroundColor === FULL_BACKGROUND) {
            liveNeighbors += 1;
          }
        }
      }
    }
  }

  return liveNeighbors;
}

function runGame(table) {
  const nodesToChange = [];

  for (let row of table.childNodes) {
    for (let cell of row.childNodes) {
      let aliveAround = getNeighborNodes(cell);
      if (cell.style.backgroundColor === FULL_BACKGROUND && (! [2, 3].includes(aliveAround))) {
        nodesToChange.push(cell);
      } else if (cell.style.backgroundColor === EMPTY_BACKGROUND && aliveAround === 3) {
        nodesToChange.push(cell);
      }
    }
  }

  for (let oldNode of nodesToChange) {
    changeBackground(oldNode);
  }

  if (nodesToChange.length === 0) {
    stopGame();
  }

  amountCycles += 1;
}

function stopGame() {
  clearInterval(gameLoop);
  changeButtons();
  if (amountCycles !== 1) {
    alert(`Your pattern made it through ${amountCycles} cycles!`);
  } else {
    alert(`Your pattern made it through ${amountCycles} cycle!`);
  }
}

function startGame() {
  amountCycles = 0;
  changeButtons();
  const tableElem = document.getElementsByTagName('table')[0];
  gameLoop = setInterval(runGame, CYCLE_INTERVAL, tableElem);
}

function gameSetup() {
  createGrid();
  BUTTON_OUTER_DIV.style.width = TITLE_ELEM.offsetWidth + 'px';
  const instructionsElem = document.createElement('h3');
  instructionsElem.innerHTML = 'Click on any boxes in the grid to make a starting pattern, then click "Start game!"';
  PLAY_DIV.insertBefore(instructionsElem, PLAY_DIV.firstChild);
  fixButtonPadding();
  // const toPad = RIGHT_DIV.offsetHeight - TITLE_ELEM.offsetHeight - PLAY_DIV.offsetHeight - settingsDiv.offsetHeight - 3 * 29;
  // PLAY_DIV.style.paddingTop = Math.floor(toPad / 2) + 'px';
  // PLAY_DIV.style.paddingBottom = Math.floor(toPad / 2) + 'px';
  // const rows = parseInt(document.getElementsByTagName('input')[0].value);
  // clearChildren(GRID_DIV);
  // createGrid(rows);
  // createButtons();
}

window.onload = gameSetup();
