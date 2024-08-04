// app/socket/initSocket.js

import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
  }
  return socket;
};
