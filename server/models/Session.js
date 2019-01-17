const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: { type: Object, default: null },
  sessionId: { type: String, default: null },
  fechaHora: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', SessionSchema);
