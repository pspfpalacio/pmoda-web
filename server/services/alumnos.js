const Alumno = require('../models/Alumno');

/**
 * Interface Service
 */
class Service {
  static getAlumnoById(id) {
    return Alumno.find({_id: id})
      .exec()
      .then(data => data);
  }
}

/**
 * Export Service
 */
module.exports = Service;