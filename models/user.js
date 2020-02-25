const mongoose = require('mongoose');

  console.log('connecteddddd user');
  const userSchema = new mongoose.Schema({
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    beatz: [{
      authorName: String,
      trackName: String,
      sequence: [[{play: Boolean, ready: Boolean}]]
    }]
  })

let User = mongoose.model('User', userSchema)


module.exports = User = mongoose.model('user', userSchema)
