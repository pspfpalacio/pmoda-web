const mongoose = require('mongoose');

const InscriptionSchema = new mongoose.Schema({
  office: { type: Object, default: null },
  date: {type: String, default: null},
  id_alumno: { type: mongoose.Schema.Types.ObjectId, default: null },
  id_curso: { type: mongoose.Schema.Types.ObjectId, default: null },
  commissions: { type: Array, default: [] },  
  user_create: { type: String, default: null },
  user_modify: { type: String, default: null },
  date_create: { type: String, default: null },
  last_modify: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Inscription', InscriptionSchema);
