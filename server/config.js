const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://192.168.0.12:27017/depnes', // TODO
  port: process.env.PORT || 8000,
};

export default config;
