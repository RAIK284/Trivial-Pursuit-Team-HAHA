const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Include other user fields if necessary
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 10;
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  } else {
    return next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
