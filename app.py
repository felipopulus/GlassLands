from flask import Flask, Response, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
import llm
import character


# Start Flask Server
app = Flask(__name__)
CORS(app)  # Enable CORS on all routes
socketio = SocketIO(app) # Enable SocketIO

# Load Large Language Model
shared = llm.start()

allPlayerData = character.CHARACTERS

@app.route('/')
def home():
    return render_template('game.html')

# ################## Player SocketIO Events ##################
@socketio.on('new player')
def handle_new_player(data):
    print('New player joined:', data['name'])
    allPlayerData[request.sid] = {
        "name": data["name"],
        "color": data["color"],
        "type": data["type"]
    }
    # Broadcast the new player's position to all clients
    emit("new player", data, broadcast=True)

@socketio.on("player position")
def handle_player_position(data):
    print("{} position: {} type: {} color: {}".format(data["name"], data["position"], data["type"], data["color"]))
    allPlayerData[request.sid]["color"] = data["color"]
    allPlayerData[request.sid]["type"] = data["type"]
    allPlayerData[request.sid]["position"] = data["position"]
    # Broadcast the player's position to all clients
    emit("player position", data, broadcast=True)

@socketio.on("load all players")
def handle_get_all_player_data():
    # Broadcast the player's position to all clients
    playerData = {}
    for value in allPlayerData.values():
        playerData[value["name"]] = value
        # {
        #     "position": value["position"], 
        #     "type": value["type"], 
        #     "color": value["color"]
        # }
    print("sending player data: {}".format(playerData))
    emit("all player data", playerData, broadcast=True)

@socketio.on("disconnect")
def handle_player_disconnect():
    print("Player disconnected:", request.sid)
    if request.sid in allPlayerData:
        print("\t{} disconnected".format(allPlayerData[request.sid]["name"]))
        # Broadcast the player's position to all clients
        data = {"name": allPlayerData[request.sid]["name"] }
        emit("player disconnect", data, broadcast=True)
        del allPlayerData[request.sid]


# ################## Game CORS Events ##################
@app.route('/game', methods=['POST'])
def handle_game():
    # Update game state based on player action
    player_action = request.json
    character = llm.character(player_action["cell"])
    tokens = character.talk(player_action["text"])
    def generate():
        for token in tokens:
            yield token
    return Response(generate(), mimetype='text/event-stream')

@app.route('/game', methods=['GET'])
def handle_get():
    return "This is a placeholder GET response."
    
@app.route('/character_names', methods=['GET'])
def get_character_names():
    return jsonify(character.Character.charNameOptions)

if __name__ == "__main__":
    socketio.run(app)
#     app.run(host='0.0.0.0', port=5000)