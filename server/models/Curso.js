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
  user_alta: { type: String, default: null },
  user_mod: { type: String, default: null },
  user_baja: { type: String, default: null },
  fecha_alta: { type: String, default: null },
  fecha_mod: { type: String, default: null },
  fecha_baja: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Curso', CursoSchema);
