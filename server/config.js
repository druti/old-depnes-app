const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/depnes',
  port: process.env.PORT || 8000,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 3030,
  jwtSecret: 'ZPAFgmIVTR8sDvXSTrT8qjUAsidlctE',
};

export default config;
