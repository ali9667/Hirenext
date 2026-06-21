const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  cover_letter: String,
  status: { type: String, enum: ['applied','reviewing','shortlisted','interview','offer','rejected','withdrawn'], default: 'applied' },
  status_history: [{ status: String, changed_at: { type: Date, default: Date.now }, note: String }],
}, { timestamps: true });

module.exports = mongoose.model('Application', schema);
