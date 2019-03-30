const Curso = require('../models/Curso');

/**
 * Interface Service
 */
class Service {
  static getCursoById(id) {
    return Curso.find({_id: id})
      .exec()
      .then(data => data);
  }
}

/**
 * Export Service
 */
module.exports = Service;