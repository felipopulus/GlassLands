// main.js
import { getPlayerTile, initializeGameBoard, updateGameBoard } from './gameBoard.js';
import { registerClientPlayer, registerPlayerPosition, loadOtherPlayers, getAICharacters} from './char/playerSync.js';
import { ClientCharacter } from './char/clientChar.js';
import { AICharacter } from './char/aiChar.js';

// Set the color input to a random color
window.onload = function() {
    document.getElementById('color').value = '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Get the username form and the landing screen
const usernameForm = document.getElementById('username-form');
const landingScreen = document.getElementById('landing-screen');
let clientPlayer = null;

// Initialize the game board and the character
initializeGameBoard();
loadOtherPlayers();

// Add an event listener for the form submission
usernameForm.addEventListener('submit', (event) => {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the username from the form
    const characterData = {
        "name": event.target.username.value,
        "position": {x: 0.4, y: 0.95},
        "color: ": document.getElementById('color').value,
        "type": "human"};

    clientPlayer = new ClientCharacter(characterData);
    registerClientPlayer(clientPlayer);

    // hide the landing screen
    landingScreen.style.display = 'none';
});


// Function to update the game
function updateGame() {
    // Update the game board and the character's position

    // if clientPlayer is not null, update the position
    if (clientPlayer) {
        if (clientPlayer.isAnyKeyPressed()) {
            registerPlayerPosition({
                "name": clientPlayer.name,
                "position": clientPlayer.position,
                "color": clientPlayer.color,
                "type": "human"
            });
            clientPlayer.updatePosition();
        }
        // Update the game board
        updateGameBoard(clientPlayer);
    }

    // AI characters
    const tiles = document.querySelectorAll('.tile.selected');
    for (let aiPlayer of getAICharacters()) {
        // move random amount between -0.05 and 0.05
        for (let tile of tiles) {
            if (getPlayerTile(aiPlayer) == tile) {
                // Do something special only in the tile
            }
        }
        aiPlayer.move((Math.random() - 0.5) / 10, (Math.random() - 0.5) / 10);
        aiPlayer.updatePosition();
    }
}

// Start the game loop
setInterval(updateGame, 10); // Update the game every 10 milliseconds

