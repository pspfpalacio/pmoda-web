const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  office: { type: Object, default: null },
  name: { type: String, default: null },
  curso: { type: Object, default: null },
  instructor_primary: { type: Object, default: null },
  instructor_alternate: { type: Object, default: null },
  commissions: { type: Array, default: [] },
  user_create: { type: String, default: null },
  user_modify: { type: String, default: null },
  date_create: { type: String, default: null },
  last_modify: { type: String, default: null },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Subject', SubjectSchema);
