const required = (value, fallback = '') => value || fallback;

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.API_PORT || 4000),
  mongoUri: required(process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017/socialfeed'),
  jwtAccessSecret: required(process.env.JWT_ACCESS_SECRET, 'dev-access-secret'),
  jwtRefreshSecret: required(process.env.JWT_REFRESH_SECRET, 'dev-refresh-secret'),
  accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTokenTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS || 7),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};
