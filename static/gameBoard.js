// gameBoard.js

// Define the game board size and character position
const GAME_BOARD = document.getElementById('game-board');
const GAME_BOARD_STYLE = window.getComputedStyle(GAME_BOARD);
const GAME_MARGIN = parseFloat(GAME_BOARD_STYLE.getPropertyValue('margin'));
const TILES = document.getElementById('tiles');
const TILES_STYLE = window.getComputedStyle(TILES);
const NUM_COLUMNS = TILES_STYLE.getPropertyValue('grid-template-columns').split(' ').length;  // Get the value of the grid-template-columns property
const NUM_ROWS = TILES_STYLE.getPropertyValue('grid-template-rows').split(' ').length;  // Get the value of the grid-template-rows property

// Initialize the lists for the x and y positions of the tile walls
let margin = {x: 0, y: 0};
let tileDimensions = {x: 0, y: 0};
let tileWallsX = [];
let tileWallsY = [];
let charInPanel = null;


export function initializeGameBoard() {
    // Code to initialize the game board goes here
    for (let y = 0; y < NUM_ROWS; y++) {
        for (let x = 0; x < NUM_COLUMNS; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;

            // Create a new element for the title
            const title = document.createElement('p');
            title.classList.add('tile-title');
            
            // Set the title text
            title.textContent = "Your Title Here";  // Replace with the actual title
            
            // Generate a light gray color
            const color = '#F0F0F0';

            // Set the title's background color to the random color
            title.style.backgroundColor = color;

            // Append the title to the tile
            tile.appendChild(title);

            TILES.appendChild(tile);
        }
    }
    updateBoardPixelAttributes()
}

export function updateBoardPixelAttributes() {
    // console.log("updateBoardPixelAttributes called");
    margin = {x: GAME_MARGIN / GAME_BOARD.clientWidth, y: GAME_MARGIN / GAME_BOARD.clientHeight};
    tileDimensions = {x: (1 - margin.x * 2) / NUM_ROWS, y: (1 - margin.y * 2) / NUM_COLUMNS};

    // // Iterate over the width and height of the board to populate the lists
    tileWallsX = [];
    tileWallsY = [];
    for (let i = 1; i < NUM_ROWS; i++) {
        tileWallsX.push((GAME_MARGIN/GAME_BOARD.clientWidth) + (i * tileDimensions.x));
    }
    for (let i = 1; i < NUM_COLUMNS; i++) {
        tileWallsY.push((GAME_MARGIN/GAME_BOARD.clientHeight) + (i * tileDimensions.y));
    }
}

export function updateGameBoard(clientPlayer) {
    // Remove the selected class from all tiles
    const tiles = document.querySelectorAll('.tile.selected');
    tiles.forEach(tile => tile.classList.remove('selected'));
    const currentTileElement = getPlayerTile(clientPlayer)
    currentTileElement.classList.add('selected'); // hilight the tile the playerDiv is on
}

export function getPlayerTile(character) {
    // Calculate the character's current tile coordinates
    const newTileX = Math.floor(character.position.x * NUM_COLUMNS);
    const newTileY = Math.floor(character.position.y * NUM_ROWS);
    
    // Get the character's current tile and add the selected class
    return document.querySelector(`.tile[data-x='${newTileX}'][data-y='${newTileY}']`);
}

export function setInfoPanel(character) {
    charInPanel = character;
    _setInfoPanel()
}

function _setInfoPanel() {
    if (!charInPanel) {
        return;
    }
    const infoPanel = document.getElementById('info-panel');
    infoPanel.style.padding = '20px';  // Add padding

    const playerNameElement = document.getElementById('player-name');
    const playerInfoElement = document.getElementById('player-info');

    playerNameElement.textContent = charInPanel.name;  // Replace with the player's name

    // iterate over the character's attributes and add them to the info panel
    playerInfoElement.innerHTML = '';
    for (let [key, value] of Object.entries(charInPanel)) {
        // skip any attributes that are functions
        if (typeof value === 'function') {
            continue;
        }
        // skip attributes that are html elements
        if (value instanceof HTMLElement) {
            continue;
        }
        // skip the name attribute
        if (["name", "playerDiv", "contextMenu", "keysPressed", "playerDivSize", "stepSize", "boardMargin", "tileGap"].includes(key)) {
            continue;
        }
        // if its a dictionary, iterate over the dictionary and add the key-value pairs
        let dictString = `<span style="display: block;"><strong>${key}</strong>:`;

        // only if it is an iterable dictionary
        if (typeof value === 'object' && value.constructor === Object) {
            for (let [dictKey, dictValue] of Object.entries(value)) {
                // if dictValue is float, round to 3 decimal places
                if (typeof dictValue === 'number') {
                    dictValue = dictValue.toFixed(4);
                }
                dictString += `<span style="display: block; padding-left: 20px;"><strong>${dictKey}</strong>: ${dictValue}</span>`;
            }
            dictString += '</span>';
        } else {
            dictString += ` ${value}</span>`;
        }
        playerInfoElement.innerHTML += dictString;
    }
    setTimeout(() => _setInfoPanel(), 500);
}

document.getElementById('close-info-panel').addEventListener('click', function() {
    // Clear the contents of the info panel
    charInPanel = null;
    document.getElementById('info-panel').style.padding = "0px";
    document.getElementById('player-name').textContent = '';
    document.getElementById('player-info').textContent = '';
    
});

window.addEventListener('resize', updateBoardPixelAttributes);