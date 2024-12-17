exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log('A user connected:', socket.id);

        // Unisciti o crea una stanza
        socket.on('create or join', function (room, userId) {
            console.log(`Received "create or join". Room: ${room}, User: ${userId}`); // Debug
            socket.join(room);
            console.log(`${userId} joined room: ${room}`);
            io.to(room).emit('joined', room, userId);
        });

        // Invia un messaggio a tutti nella stanza
        socket.on('chat', function (room, userId, chatText) {
            console.log(`Message in room ${room} from ${userId}: ${chatText}`);
            io.to(room).emit('chat', room, userId, chatText);
        });

        socket.on('disconnect', function() {
            console.log('A user disconnected:', socket.id);
        });
    });
};