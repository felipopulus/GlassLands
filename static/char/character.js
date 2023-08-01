// Get Constants
import { ContextMenu } from './contextMenu.js';

const GAME_BOARD = document.getElementById('game-board');
const GAME_MARGIN = parseFloat(window.getComputedStyle(GAME_BOARD).getPropertyValue('margin'));
const PLAYERS_DIV = document.getElementById('players');

export class Character {
    constructor(characterData) {
        // Required attributes
        if (!("name" in characterData)) {
            console.error("characterData does not contain a name attribute");
            return;
        }
        
        // if there is not color attribute, generate a random color
        if (!("color" in characterData)) {
            this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
            console.log("Creating new AI player with random color: ", this.color)
        }

        if (!("position" in characterData)) {
            this.position = {x: 0, y: 0};
        }

        if (!("action" in characterData)) {
            this.action = "idle";
        }

        // iterate characterData and add any additional attributes to the player
        for (let [key, value] of Object.entries(characterData)) {
            this[key] = value;
        }

        this.contextMenu = null;
        this.keysPressed = {
            'ArrowUp': false, 
            'ArrowDown': false,
            'ArrowLeft': false,
            'ArrowRight': false,
            'w': false,
            'a': false,
            's': false,
            'd': false};

        // Create the player element
        this.playerDiv = document.createElement('div');
        this.playerDiv.className = 'player';
        // strip spaces and special characters from the name
        this.playerDiv.id = 'player' + this.name.replace(/[^a-zA-Z0-9]/g, '');
        this.playerDiv.style.backgroundColor = this.color;
        // this.playerDiv.style = window.getComputedStyle(this.playerDiv);
        this.playerDiv.name = this.name;

        // Create the cross element
        // const cross = document.createElement('div');
        // cross.id = 'cross';
        // this.playerDiv.appendChild(cross);

        // Create the position display element
        this.positionDisplay = document.createElement('div');
        this.positionDisplay.id = 'position-display';
        this.playerDiv.appendChild(this.positionDisplay);

        // Add the player to the game board
        PLAYERS_DIV.appendChild(this.playerDiv);

        // Update the player's pixel attributes
        this.updatePlayerPixelAttributes();
        this.move(this.position.x, this.position.y);
        // this.updatePosition();

        // Bind the functions to the correct context
        this.updatePlayerPixelAttributes = this.updatePlayerPixelAttributes.bind(this);
        window.addEventListener('resize', this.updatePlayerPixelAttributes);

        this.showContextMenu = this.showContextMenu.bind(this);
        this.playerDiv.addEventListener('click', this.showContextMenu);
    }

    updateColor(newColor) {
        this.color = newColor;
        this.playerDiv.style.backgroundColor = this.color;
    }

    updatePlayerPixelAttributes() {
        // console.log("updatePlayerPixelAttributes called");
        const PLAYER_PIXEL_WIDTH = parseFloat(window.getComputedStyle(this.playerDiv).getPropertyValue('width'));
        const PLAYER_PIXEL_HEIGHT = parseFloat(window.getComputedStyle(this.playerDiv).getPropertyValue('height'));
        this.playerDivSize = {x: PLAYER_PIXEL_WIDTH / GAME_BOARD.clientWidth, y: PLAYER_PIXEL_HEIGHT / GAME_BOARD.clientHeight};
        this.stepSize = {x: this.playerDivSize.x / 2 , y: this.playerDivSize.y / 2};
        this.boardMargin = {x: GAME_MARGIN / GAME_BOARD.clientWidth, y: GAME_MARGIN / GAME_BOARD.clientHeight};
        this.tileGap = {x: 1 / GAME_BOARD.clientWidth, y: 1 / GAME_BOARD.clientHeight};
        this.updatePosition();
    }

    isAnyKeyPressed() {
        // Function to check if any key is currently pressed
        return Object.values(this.keysPressed).some(value => value === true);
    }

    move(dx, dy) {
        let moveX = Math.max(0, this.position.x + (dx * this.stepSize.x));
        let moveY = Math.max(0, this.position.y + (dy * this.stepSize.y));
        // this.position.x = Math.min(moveX, 1 - this.boardMargin.x - this.tileGap.x);
        // this.position.y = Math.min(moveY, 1 - this.boardMargin.y - this.tileGap.y);
        this.position.x = Math.min(moveX, 1 - this.playerDivSize.x + this.tileGap.x);
        this.position.y = Math.min(moveY, 1 - this.playerDivSize.y + this.tileGap.y);

        // this.positionDisplay.innerHTML = `${this.name}<br>${this.position.x.toFixed(4)}, ${this.position.y.toFixed(4)}`;
        this.positionDisplay.innerHTML = `${this.name}<br>Action: ${this.action}`;

    }

    moveContinuously(keysPressed) {
        // check to see if this has an attribute called keysPressed
        // console.log("this.keysPressed: ", keysPressed);
        // Calculate the combined horizontal and vertical movements based on the pressed keys
        const dx = (keysPressed['ArrowRight'] ? 1 : 0) + (keysPressed['ArrowLeft'] ? -1 : 0);
        const dy = (keysPressed['ArrowDown'] ? 1 : 0) + (keysPressed['ArrowUp'] ? -1 : 0);
    
        // Call movePlayer with the combined horizontal and vertical movements
        this.move(dx, dy);
    
        // If there is at least one key pressed, call the function again in the next animation frame
        // if (this.isAnyKeyPressed()) {
        //     requestAnimationFrame(this.moveContinuously(keysPressed));
        // }
    }

    updatePosition() {
        this.playerDiv.style.left = `${this.position.x * GAME_BOARD.clientWidth}px`;
        this.playerDiv.style.top = `${this.position.y * GAME_BOARD.clientHeight}px`;
    }

    removePlayer() {
        // console.log("removePlayer called: ", this.playerDiv.name);
        this.playerDiv.remove();
    }
    showContextMenu(event) {
        if (!this.contextMenu) {
            this.contextMenu = new ContextMenu(this)
        }
        this.contextMenu.show(event);
        // setInfoPanel(this);
    }
}