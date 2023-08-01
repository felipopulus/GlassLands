import { setInfoPanel } from '../gameBoard.js';

export class ContextMenu {
    constructor(character) {
        this.character = character;
        this.playerDiv = character.playerDiv;

        this.menu = document.createElement('div');
        this.menu.id = 'context-menu';
        this.menu.className = 'context-menu';

        this.chatOption = document.createElement('div');
        this.chatOption.id = 'chat-option';
        this.chatOption.className = 'context-menu-option';
        this.chatOption.textContent = 'Quick Chat';
        this.menu.appendChild(this.chatOption);

        this.infoPanelOption = document.createElement('div');
        this.infoPanelOption.id = 'info-panel-option';
        this.infoPanelOption.className = 'context-menu-option';
        this.infoPanelOption.textContent = 'Info Panel';
        this.menu.appendChild(this.infoPanelOption);

        this.moveTowardsOption = document.createElement('div');
        this.moveTowardsOption.id = 'move-towards-option';
        this.moveTowardsOption.className = 'context-menu-option';
        this.moveTowardsOption.textContent = 'Move Towards';
        this.menu.appendChild(this.moveTowardsOption);

        this.playerDiv.appendChild(this.menu);

        const PLAYER_PIXEL_WIDTH = parseFloat(window.getComputedStyle(this.playerDiv).getPropertyValue('width'));
        const PLAYER_PIXEL_HEIGHT = parseFloat(window.getComputedStyle(this.playerDiv).getPropertyValue('height'));

        this.menu.style.top = `${PLAYER_PIXEL_WIDTH}px`;
        this.menu.style.left = `${PLAYER_PIXEL_HEIGHT}px`;

        this.handleContextMenuAction = this.handleContextMenuAction.bind(this);
        this.menu.addEventListener('click', this.handleContextMenuAction);

        // Bind the handleContextMenuAway away function so that it hides the context
        // menu when the user clicks elsewhere on the screen
        document.addEventListener('click', this.handleContextMenuAway.bind(this));
    }
    show() {
        this.menu.classList.add('show');
    }
    hide() {
        this.menu.classList.remove('show');
    }

    handleContextMenuAway(event) {
        // if the click is outside of the player div, hide the context menu
        if (this.playerDiv !== event.target) {
            this.hide();
        }
    }
    handleContextMenuAction(event) {
        if (event.target.id === "chat-option") {
            console.log("Chat option clicked");
        }
        else if (event.target.id === "info-panel-option") {
            setInfoPanel(this.character);
            // automatically hidden by handleContextMenuAway
        }
        else if (event.target.id === "move-towards-option") {
            console.log("Move towards option clicked");
            // automatically hidden by handleContextMenuAway
        }
    }
}