const Inscription = require('../models/Inscription');

/**
 * Interface Service
 */
class Service {
  static getInscriptions(params) {
    return Inscription.find(params)
      .exec()
      .then(data => data);
  }
}

/**
 * Export Service
 */
module.exports = Service;