let name = null;
let roomNo = null;
let socket = io();

/**
 * Inizializza l'interfaccia e imposta i listener di Socket.IO.
 * @param {string} roomName - Nome della stanza passato dal server.
 */
function init(roomName) {
    roomNo = roomName; // Pre-popolazione del nome della stanza
    document.getElementById('roomNo').value = roomNo;

    // Visualizzazione interfaccia di login
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    // Listener per eventi Socket.IO
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            hideLoginInterface(room, userId);
        } else {
            writeOnHistory(`<b>${userId}</b> joined room ${room}`);
        }
    });

    socket.on('chat', function (room, userId, chatText) {
        let who = userId === name ? 'Me' : userId;
        writeOnHistory(`<b>${who}:</b> ${chatText}`);
    });
}

/**
 * Connette l'utente a una stanza.
 */
function connectToRoom() {
    name = document.getElementById('name').value || `Anonymous-${Math.random().toFixed(2)}`;
    roomNo = document.getElementById('roomNo').value;

    console.log(`Attempting to connect. Name: ${name}, Room: ${roomNo}`); // Debug

    if (!roomNo) {
        alert('Room ID is required.');
        return;
    }

    socket.emit('create or join', roomNo, name);
    console.log('Event "create or join" emitted.');
}

/**
 * Invia un messaggio nella stanza corrente.
 */
function sendChatText() {
    const chatText = document.getElementById('chat_input').value.trim();
    if (chatText) {
        socket.emit('chat', roomNo, name, chatText);
        document.getElementById('chat_input').value = ''; // Reset input
    }
}

/**
 * Scrive un messaggio nella cronologia.
 * @param {string} text - Testo da aggiungere alla cronologia.
 */
function writeOnHistory(text) {
    const history = document.getElementById('history');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    history.scrollTop = history.scrollHeight; // Scorri in basso automaticamente
}

/**
 * Nasconde l'interfaccia di login e mostra la chat.
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerText = userId;
    document.getElementById('in_room').innerText = room;
}