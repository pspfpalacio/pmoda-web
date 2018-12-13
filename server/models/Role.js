const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, default: null },
  description: { type: String, default: null },
  permission: { type: Object, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Role', RoleSchema);
