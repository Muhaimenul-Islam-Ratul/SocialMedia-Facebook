const required = (value, fallback = '') => value || fallback;

function parseOrigins(value) {
  return required(value, 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.API_PORT || process.env.PORT || 4000),
  mongoUri: required(process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/socialfeed'),
  jwtAccessSecret: required(process.env.JWT_ACCESS_SECRET, 'dev-access-secret'),
  jwtRefreshSecret: required(process.env.JWT_REFRESH_SECRET, 'dev-refresh-secret'),
  accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTokenTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS || 7),
  clientOrigin: parseOrigins(process.env.CLIENT_ORIGIN)[0],
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};
