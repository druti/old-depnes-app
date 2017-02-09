const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/depnes',
  port: process.env.PORT || 8000,
  jwtSecret: 'ZPAFgmIVTR8sDvXSTrT8qjUAsidlctE',
};

export default config;
