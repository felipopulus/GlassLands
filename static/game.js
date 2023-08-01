// game.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Define the player's username
    let playerUserName = 'Player';

    // Define the game board size and player position
    const BOARD_WIDTH = 6;
    const BOARD_HEIGHT = 4;

    // Initialize the lists for the x and y positions of the tile walls
    let tileWallsX = [];
    let tileWallsY = [];
    
    // Get the username form and the landing screen
    const usernameForm = document.getElementById('username-form');
    const landingScreen = document.getElementById('landing-screen');

    // Get the game board element
    const gameBoard = document.getElementById('game-board');

    // Calculate the gap size based on the computed style of the game board
    const gameBoardStyle = window.getComputedStyle(gameBoard);
    const margin = parseFloat(gameBoardStyle.getPropertyValue('margin'));
    let relativeXMargin = margin / gameBoard.clientWidth;
    let relativeYMargin = margin / gameBoard.clientHeight;

    // Create the player element
    const player = document.getElementById('player');
    player.id = 'player';
    const playerStyle = window.getComputedStyle(player);
    const PLAYER_WIDTH = parseFloat(playerStyle.getPropertyValue('width'));
    const PLAYER_HEIGHT = parseFloat(playerStyle.getPropertyValue('height'));

    let playerPosition = {x: 0, y: 0};
    let currentTile = {x: 0, y: 0};

    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;
            gameBoard.appendChild(tile);
        }
    }

    // Create the position display element
    const positionDisplay = document.createElement('div');
    positionDisplay.id = 'position-display';
    player.appendChild(positionDisplay);
        
    // // Create the cross element
    const cross = document.createElement('div');
    cross.id = 'cross';
    player.appendChild(cross);

    function updatePixelScreen() {
        // console.log("updatePixelScreen called");
        relativeXMargin = margin / gameBoard.clientWidth;
        relativeYMargin = margin / gameBoard.clientHeight;

        tileWallsX = [];
        tileWallsY = [];

        // Calculate the relative size of a tile
        const relativeTileWidth = (1 - relativeXMargin * 2) / BOARD_WIDTH;
        const relativeTileHeight = (1 - relativeYMargin * 2) / BOARD_HEIGHT;

        // // Iterate over the width and height of the board to populate the lists
        for (let i = 1; i < BOARD_WIDTH; i++) {
            tileWallsX.push((margin/gameBoard.clientWidth) + (i * relativeTileWidth));
        }
        for (let i = 1; i < BOARD_HEIGHT; i++) {
            tileWallsY.push((margin/gameBoard.clientHeight) + (i * relativeTileHeight));
        }
        updatePlayerPixelPosition();
    }
    
    // Function to update the player's pixel position based on its relative position
    function updatePlayerPixelPosition() {
        // Calculate the player's pixel position
        player.style.left = `${playerPosition.x * gameBoard.clientWidth}px`;
        player.style.top = `${playerPosition.y * gameBoard.clientHeight}px`;
    }
    
    // Function to move the player
    function movePlayer(playerDx, playerDy) {
        // log this, I want to see how manu times this function is called
        // console.log("movePlayer called");

        // Define the player size, position, and step size in percentages of the game board size
        const playerSizeX = PLAYER_WIDTH / gameBoard.clientWidth;
        const playerSizeY = PLAYER_HEIGHT / gameBoard.clientHeight;
        const stepSizeX = playerSizeX / 32 ;  // The player moves half its size at each step
        const stepSizeY = playerSizeY / 32 ;  // The player moves half its size at each step

        const minX = Math.max(playerPosition.x + playerDx * stepSizeX, relativeXMargin);
        const minY = Math.max(playerPosition.y + playerDy * stepSizeY, relativeYMargin);
        const maxX = 1 + (2 / gameBoard.clientWidth) + relativeXMargin - playerSizeX
        const maxY = 1 + (2 / gameBoard.clientHeight) + relativeYMargin - playerSizeY

        // Update the player's relative position
        playerPosition.x = Math.min(minX, maxX);
        playerPosition.y = Math.min(minY, maxY);

        // Remove the selected class from all tiles
        const tiles = document.querySelectorAll('.tile.selected');
        tiles.forEach(tile => tile.classList.remove('selected'));

        // console.log("tileWallsX: ", tileWallsX);
        // console.log("tileWallsY: ", tileWallsY);

        // Calculate the player's current tile coordinates
        const newTileX = Math.floor(playerPosition.x * BOARD_WIDTH);
        const newTileY = Math.floor(playerPosition.y * BOARD_HEIGHT);

        // Update the current tile
        currentTile.x = newTileX;
        currentTile.y = newTileY;
        
        positionDisplay.innerHTML = `${playerUserName}<br>${playerPosition.x.toFixed(4)}, ${playerPosition.y.toFixed(4)}`;

        // Update the player's pixel position
        updatePlayerPixelPosition();
        
        // Get the player's current tile and add the selected class
        const currentTileElement = document.querySelector(`.tile[data-x='${newTileX}'][data-y='${newTileY}']`);
        currentTileElement.classList.add('selected');

    }

    // Data structure to keep track of pressed keys
    const keysPressed = {};

    // Function to check if any key is currently pressed
    function isAnyKeyPressed() {
        return Object.values(keysPressed).some(value => value === true);
    }

    // Function to move the player continuously while a key is pressed
    function movePlayerContinuously() {
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
            movePlayerContinuously();
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

    // Add an event listener for the form submission
    usernameForm.addEventListener('submit', (event) => {
        // Prevent the form from being submitted normally
        event.preventDefault();

        // Get the username from the form
        const username = event.target.username.value;

        // Hide the landing screen
        landingScreen.style.display = 'none';

        // Set the username as the player's tag
        playerUserName = username;

        // Start the game
        movePlayer(0, 0);
    });

    // Update the player's pixel position when the window size changes
    window.addEventListener('resize', updatePixelScreen);

    updatePixelScreen();
    movePlayer(0, 0);
});
