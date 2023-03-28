const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);

function leaveAllRooms(socket) {
  for (const room of socket.rooms) {
    console.log(`leaving room ${room}`);
    socket.leave(room);
  }
}


io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  socket.on('user_join', (name) => {
    console.log('A user joined their name is ' + name);
    leaveAllRooms(socket);
    socket.join("General");
    socket.to("General").emit('user_join', name);
  });

  socket.on('message', ({name, message}) => {
    console.log(name, message, socket.id);
    console.log(socket.rooms);
    const room = socket.rooms.keys().next().value;
    console.log(room);
    console.log(`received message on room: ${room}`);
    io.to(room).emit('message', {name, message});
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });

  socket.on('join_room', ({name, room}) => {
    leaveAllRooms(socket);
    console.log(`joining room "${room}"`);
    socket.join(room);
    socket.to(room).emit('user_join', name)
  })

});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
