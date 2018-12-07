const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  office: { type: String, default: null },
  name: { type: String, default: null },
  lastname: { type: String, default: null },
  user: { type: String, default: null },
  pass: { type: String, default: null },
  email: { type: String, default: null },  
  id_rol: { type: Number, default: 0 },
  id_alumno: { type: Number, default: 0 },
  id_profesor: { type: Number, default: 0 },
  user_alta: { type: String, default: null },
  user_mod: { type: String, default: null },
  user_baja: { type: String, default: null },
  fecha_alta: { type: Date, default: null },
  fecha_mod: { type: Date, default: null },
  fecha_baja: { type: Date, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
