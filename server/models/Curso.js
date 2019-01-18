const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  office: { type: Object, default: null },
  nombre: { type: String, default: null },
  diasCursado: { type: String, default: null },
  cantHoras: { type: Number, default: 0 },
  duracionMeses: { type: Number, default: 0 },
  costoCurso: { type: Number, default: 0 },
  costoMatricula: { type: Number, default: 0 },
  costoTotal: { type: Number, default: 0 },
  user_create: { type: String, default: null },
  user_modify: { type: String, default: null },
  date_create: { type: String, default: null },
  last_modify: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Curso', CursoSchema);
