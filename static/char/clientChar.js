import { Character } from './character.js';

export class ClientCharacter extends Character {
    constructor(characterData) {
        super(characterData);  // Call the constructor of the base class
        this.keysPressed = {'ArrowUp': false, 'ArrowDown': false, 'ArrowLeft': false, 'ArrowRight': false, 'w': false, 'a': false, 's': false, 'd': false};
        this.handleKeyDown = this.handleKeyDown.bind(this);  // Ensure correct context for 'this'
        this.handleKeyUp = this.handleKeyUp.bind(this);  // Ensure correct context for 'this'
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        // Check if the event.key is one of the arrow keys or WASD keys
        if (["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "w", "a", "s", "d"].includes(event.key)) {
            // console.log("handleKeyDown called, event.key: ", event.key);
            this.keysPressed[event.key] = true;
    
            // Add checks for WASD keys
            const dx = (this.keysPressed['ArrowRight'] || this.keysPressed['d'] ? 1 : 0) + 
                       (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] ? -1 : 0);
    
            const dy = (this.keysPressed['ArrowDown'] || this.keysPressed['s'] ? 1 : 0) + 
                       (this.keysPressed['ArrowUp'] || this.keysPressed['w'] ? -1 : 0);
    
            this.move(dx, dy);
        }
    }

    handleKeyUp(event) {
        if (["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "w", "a", "s", "d"].includes(event.key)) {
            this.keysPressed[event.key] = false;
        }
    }
        
}