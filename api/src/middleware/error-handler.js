export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const payload = {
    message: error.message || 'Internal server error',
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack;
  }

  res.status(status).json(payload);
}
