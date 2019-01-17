const mongoose = require('mongoose');

const OfficeSchema = new mongoose.Schema({
  name: { type: String, default: null },
  description: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Office', OfficeSchema);
