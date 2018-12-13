const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  office: { type: String, default: null },
  name: { type: String, default: null },
  lastname: { type: String, default: null },
  user: { type: String, default: null },
  pass: { type: String, default: null },
  email: { type: String, default: null },  
  role: { type: Object, default: 0 },
  id_alumno: { type: Number, default: 0 },
  id_profesor: { type: Number, default: 0 },
  user_create: { type: String, default: null },
  user_modify: { type: String, default: null },
  date_create: { type: String, default: null },
  last_modify: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
