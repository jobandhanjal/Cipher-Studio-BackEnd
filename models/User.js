const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Fix the password hashing logic to avoid rehashing an already hashed password
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  // Ensure the passwordHash is only hashed if it is not already hashed
  const isAlreadyHashed = this.passwordHash.startsWith('$2b$');
  if (!isAlreadyHashed) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});


module.exports = mongoose.model('User', userSchema);