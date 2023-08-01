import { SpectatorCharacter } from './spectatorChar.js';
import { AICharacter } from './aiChar.js';

let socket = io();  // Connect to the server

let otherHumanPlayers = {};
let aiCharacters = {};
let thisPlayer = null;


export function getOtherHumanPlayers() {
    // return list of only the player objects
    return Object.values(otherHumanPlayers);
}

export function getAICharacters() {
    // return list of only the character objects
    return Object.values(aiCharacters);
}

export function registerClientPlayer(character) {
    thisPlayer = character;
    socket.emit('new player', {
        name: character.name, 
        color: character.color, 
        type: "human"
    });
}

export function registerPlayerPosition(data) {
    socket.emit('player position', data); // Emit a 'player position' event
}

export function loadOtherPlayers() {
    socket.emit('load all players');
}

socket.on('new player', function(data) {
    if (thisPlayer && thisPlayer.name === data.name) {
        return;
    }
    // console.log("new player received: ", data);
    // Add the new player to the game board
    if (data.type === "human") {
        const characterData = {
            "name": data.name,
            "position": {x: 0, y: 0},
            "color": data.color,
            "type": "human"};
        otherHumanPlayers[data.name] = new SpectatorCharacter(characterData);
    }
});

socket.on('player position', function(data) {
    if (thisPlayer && thisPlayer.name === data.name) {
        return;
    }
    if (data.name in otherHumanPlayers) {
        otherHumanPlayers[data.name].position = data.position
        otherHumanPlayers[data.name].updateColor(data.color);
        otherHumanPlayers[data.name].updatePosition();
    }
    else {
        const characterData = {
            "name": data.name,
            "position": data.position,
            "color": data.color,
            "type": "human"};
        otherHumanPlayers[data.name] = new SpectatorCharacter(characterData);
    }
});

socket.on('all player data', function(data) {
    console.log("all player data received: ", data);
    // iterate over the dictionary of players
    for (let [characterName, playerData] of Object.entries(data)) {
        // console.log(`Key: ${characterName}, Value: ${playerData}`);
        if (thisPlayer && thisPlayer.name === characterName) {
            continue;
        }
        if (playerData["type"] === "human") {
            const characterData = {
                "name": characterName,
                "position": playerData["position"],
                "color": playerData["color"],
                "type": "human"};
            otherHumanPlayers[characterName] = new SpectatorCharacter(characterData);
            // otherHumanPlayers[characterName].updateColor(playerData["color"]);
            otherHumanPlayers[characterName].updatePosition();
        }
        else if (playerData["type"] === "ai") {
            // if characterName is already in aiCharacters, skip
            if (characterName in aiCharacters) {
                continue;
            }
            aiCharacters[characterName] = new AICharacter(playerData);
            aiCharacters[characterName].updatePosition();
        }
    }
});

socket.on('player disconnect', function(data) {
    if (thisPlayer && thisPlayer.name === data.name) {
        return;
    }
    otherHumanPlayers[data.name].removePlayer();
    delete otherHumanPlayers[data.name];
});