import { io } from 'socket.io-client';
import { getAccessToken } from './api';

let socket = null;
const PROD_SOCKET_URL = 'https://socialfeed-backend-service-production.up.railway.app';

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? PROD_SOCKET_URL : '/'), {
      autoConnect: false,
      withCredentials: true,
      auth: {
        token: getAccessToken(),
      },
    });
  }

  socket.auth = {
    token: getAccessToken(),
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
  }
}
