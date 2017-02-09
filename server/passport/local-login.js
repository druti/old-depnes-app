import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import PassportLocalStrategy from 'passport-local'
import config from '../config';

const User = mongoose.model('User');

export default new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim(),
  };

  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) return done(err);

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if hashed user's password is equal to value saved in database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) return done(err);

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id,
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: user.name,
      };

      return done(null, token, data);
    });
  });
});
