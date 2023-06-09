const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      'https://p3-passport.byteimg.com/img/user-avatar/ce0d388154616b47e913082f936c65fa~100x100.awebp',
  },
  introduc: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  jue_power: {
    type: Number,
    default: 0,
  },
  good_num: {
    type: Number,
    default: 0,
  },
  read_num: {
    type: Number,
    default: 0,
  },
})
const Model = mongoose.model('users', usersSchema)

module.exports = Model
