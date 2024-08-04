const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const ACTION = require('./Actions'); // Adjust this path as necessary

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  const userSocketMap = {};

  function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    });
  }

  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on(ACTION.JOIN, ({ roomId, userName }) => {
      userSocketMap[socket.id] = userName;
      socket.join(roomId);
      const clients = getAllConnectedClients(roomId);

      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTION.JOINED, {
          clients,
          username:userName,
          socketId: socket.id,
        });
      });
    });

  socket.on(ACTION.CODE_CHANGE, ({ roomId, code }) => {
    console.log(code)
      socket.in(roomId).emit(ACTION.CODE_CHANGE, { code });
  });

  socket.on(ACTION.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(ACTION.CODE_CHANGE, { code });
  });

    socket.on('disconnecting', () => {
      const rooms = [...socket.rooms];  // there will be one room only by chance there might be multiple rooms for particular socket 
      rooms.forEach((roomId) => {
          socket.in(roomId).emit(ACTION.DISCONNECTED, {
              socketId: socket.id,
              username: userSocketMap[socket.id],
          });
      });
      delete userSocketMap[socket.id];
      socket.leave();
  });

  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on http://localhost:${PORT}`);
  });
});
