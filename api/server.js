import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDatabase } from './src/config/db.js';
import { env } from './src/config/env.js';
import { registerRoutes } from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/error-handler.js';
import { setSocketServer } from './src/lib/socket.js';

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: env.clientOrigin,
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

setSocketServer(io);

io.on('connection', (socket) => {
  socket.on('feed:join', () => {
    socket.join('feed');
  });

  socket.on('post:join', (postId) => {
    if (postId) {
      socket.join(`post:${postId}`);
    }
  });

  socket.on('post:leave', (postId) => {
    if (postId) {
      socket.leave(`post:${postId}`);
    }
  });
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

registerRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectDatabase();
  httpServer.listen(env.port, () => {
    console.log(`API server listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API server', error);
  process.exit(1);
});
