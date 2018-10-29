const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, default: null },
  localidades: { type: Array, default: [] }
});

module.exports = mongoose.model('Location', LocationSchema);
