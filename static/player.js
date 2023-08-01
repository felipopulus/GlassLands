// player.js

// Get Constants
const GAME_BOARD = document.getElementById('game-board');
const MARGIN_PIX = parseFloat(window.getComputedStyle(GAME_BOARD).getPropertyValue('margin'));
const PLAYER_STYLE = window.getComputedStyle(document.getElementById('player'));
const PLAYER_PIXEL_WIDTH = parseFloat(PLAYER_STYLE.getPropertyValue('width'));
const PLAYER_PIXEL_HEIGHT = parseFloat(PLAYER_STYLE.getPropertyValue('height'));

// Board variables
let xBoardMargin = 0;  // updated every time the window is resized
let yBoardMargin = 0;  // updated every time the window is resized
let xTileGap = 0;  // updated every time the window is resized
let yTileGap = 0;  // updated every time the window is resized

// Player variables
const keysPressed = {};
let player = null;  // updated on initializePlayer
let playerSizeX = 1;  // updated every time the window is resized
let playerSizeY = 1;  // updated every time the window is resized
let stepSizeX = 1;  // updated every time the window is resized
let stepSizeY = 1;  // updated every time the window is resized
let playerPosition = {x: 0, y: 0};  // updated every time the player moves

// ------------------------------------------------------------
// ------------------- MAIN PLAYER FUNCTIONS ------------------
// ------------------------------------------------------------
export function initializePlayer(newPlayerName) {
    // Create the player element
    player = document.createElement('div');
    player.id = 'player';
    player.playerName = newPlayerName;
    // console.log("initializePlayer called, name: ", player.playerName);

    // Get the player's style
    // player.style = window.getComputedStyle(player);
    // console.log("player.style: ", player.style);

    // Create the cross element
    const cross = document.createElement('div');
    cross.id = 'cross';
    player.appendChild(cross);

    // Create the position display element
    const positionDisplay = document.createElement('div');
    positionDisplay.id = 'position-display';
    player.appendChild(positionDisplay);
    player.positionDisplay = positionDisplay;

    // Create the cross element
    GAME_BOARD.appendChild(player);

    return player;
}

function isAnyKeyPressed() {
    // console.log("isAnyKeyPressed called");
    // Function to check if any key is currently pressed
    return Object.values(keysPressed).some(value => value === true);
}

export function updatePlayerPixelAttributes() {
    // console.log("updatePlayerPixelAttributes called");
    playerSizeX = PLAYER_PIXEL_WIDTH / GAME_BOARD.clientWidth;
    playerSizeY = PLAYER_PIXEL_HEIGHT / GAME_BOARD.clientHeight;
    stepSizeX = playerSizeX / 32 ;  // The player moves half its size at each step
    stepSizeY = playerSizeY / 32 ;  // The player moves half its size at each step
    xBoardMargin = MARGIN_PIX / GAME_BOARD.clientWidth;
    yBoardMargin = MARGIN_PIX / GAME_BOARD.clientHeight;
    xTileGap = 2 / GAME_BOARD.clientWidth
    yTileGap = 2 / GAME_BOARD.clientHeight
}

// ------------------------------------------------------------
// --------------------- PLAYER MOVEMENT ----------------------
// ------------------------------------------------------------
// Function to move the player
export function movePlayer(playerDx, playerDy) {
    // log this, I want to see how manu times this function is called
    // console.log("movePlayer called");

    // Define the player size, position, and step size in percentages of the game board size
    const minX = Math.max(playerPosition.x + playerDx * stepSizeX, xBoardMargin);
    const minY = Math.max(playerPosition.y + playerDy * stepSizeY, yBoardMargin);
    const maxX = 1 + xTileGap + xBoardMargin - playerSizeX
    const maxY = 1 + yTileGap + yBoardMargin - playerSizeY

    // Update the player's relative position
    playerPosition.x = Math.min(minX, maxX);
    playerPosition.y = Math.min(minY, maxY);

    player.positionDisplay.innerHTML = `${player.playerName}<br>${playerPosition.x.toFixed(4)}, ${playerPosition.y.toFixed(4)}`;

    // Update the player's pixel position
    // updatePlayerPosition();
    
    // Get the player's current tile and add the selected class
    // const currentTileElement = document.querySelector(`.tile[data-x='${newTileX}'][data-y='${newTileY}']`);
    // currentTileElement.classList.add('selected');
}

// Function to update the player's pixel position based on its relative position
export function updatePlayerPosition() {
    // Calculate the player's pixel position
    player.style.left = `${playerPosition.x * GAME_BOARD.clientWidth}px`;
    player.style.top = `${playerPosition.y * GAME_BOARD.clientHeight}px`;
}

// Function to move the player continuously while a key is pressed
export function movePlayerContinuously() {
    // Calculate the combined horizontal and vertical movements based on the pressed keys
    const dx = (keysPressed['ArrowRight'] ? 1 : 0) + (keysPressed['ArrowLeft'] ? -1 : 0);
    const dy = (keysPressed['ArrowDown'] ? 1 : 0) + (keysPressed['ArrowUp'] ? -1 : 0);

    // Call movePlayer with the combined horizontal and vertical movements
    movePlayer(dx, dy);

    // If there is at least one key pressed, call the function again in the next animation frame
    if (isAnyKeyPressed()) {
        requestAnimationFrame(movePlayerContinuously);
    }
}




// ------------------------------------------------------------
// ------------------------ PLAYER EVENTS ---------------------
// ------------------------------------------------------------

// Update the player's pixel position when the window size changes
window.addEventListener('resize', updatePlayerPixelAttributes);

// Handle key presses
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            keysPressed['ArrowUp'] = true;
            break;
        case 'ArrowDown':
            keysPressed['ArrowDown'] = true;
            break;
        case 'ArrowLeft':
            keysPressed['ArrowLeft'] = true;
            break;
        case 'ArrowRight':
            keysPressed['ArrowRight'] = true;
            break;
    }

    // Start moving the player continuously if it's not already moving
    if (isAnyKeyPressed()) {
        // const dx = (keysPressed['ArrowRight'] ? 1 : 0) + (keysPressed['ArrowLeft'] ? -1 : 0);
        // const dy = (keysPressed['ArrowDown'] ? 1 : 0) + (keysPressed['ArrowUp'] ? -1 : 0);
        movePlayerContinuously();
        // movePlayer(dx, dy)
    }
});

// Handle key releases
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            keysPressed['ArrowUp'] = false;
            break;
        case 'ArrowDown':
            keysPressed['ArrowDown'] = false;
            break;
        case 'ArrowLeft':
            keysPressed['ArrowLeft'] = false;
            break;
        case 'ArrowRight':
            keysPressed['ArrowRight'] = false;
            break;
    }
});