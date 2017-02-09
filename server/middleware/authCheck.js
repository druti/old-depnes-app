import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config';

const User = mongoose.model('User');

export default (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from authorization header string: "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).end();
    }

    const userId = decoded.sub;

    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};
