const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  office: { type: Object, default: null },
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
  provincia: { type: Object, default: null },
  location: { type: Object, default: null },
  user_create: { type: String, default: null },
  user_modify: { type: String, default: null },
  date_create: { type: String, default: null },
  last_modify: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Instructor', InstructorSchema);
