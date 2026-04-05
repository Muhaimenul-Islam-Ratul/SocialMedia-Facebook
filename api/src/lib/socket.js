let socketServer = null;

export function setSocketServer(io) {
  socketServer = io;
}

export function emitToFeed(eventName, payload) {
  socketServer?.to('feed').emit(eventName, payload);
}

export function emitToPost(postId, eventName, payload) {
  socketServer?.to(`post:${postId}`).emit(eventName, payload);
}
