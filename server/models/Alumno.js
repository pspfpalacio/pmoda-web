const mongoose = require('mongoose');

const AlumnoSchema = new mongoose.Schema({
  dni: { type: Number, unique: true, default: 0 },
  name: { type: String, default: null },
  lastname: { type: String, default: null },
  birthdate: { type: String, default: null },
  home_phone: { type: String, default: null },
  cell_phone: { type: String, default: null },
  email: { type: String, default: null },
  address_street: { type: String, default: null },
  address_number: { type: String, default: null },
  address_floor: { type: String, default: null },
  address_department: { type: String, default: null },
  address_postcode: { type: String, default: null },
  location: { type: String, default: null },
  location_id: { type: Number, default: 0 },
  user_alta: { type: String, default: null },
  user_mod: { type: String, default: null },
  fecha_alta: { type: String, default: null },
  fecha_mod: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Alumno', AlumnoSchema);
