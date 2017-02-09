import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: 'String',
    index: { unique: true },
    required: true,
  },
  password: { type: 'String', required: true },
  name: { type: 'String', required: true },
});

userSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if new user or password has been updated
  if (!user.isModified('password')) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) return next(saltError);

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) return next(hashError);

      // replace the password string with hash
      user.password = hash;

      return next();
    });
  });
});

if (process.env.NODE_ENV === 'development') {
  userSchema.set('minimize', false);
}

export default mongoose.model('User', userSchema);
