const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String], responsibilities: [String], skills_required: [String],
  experience_level: { type: String, enum: ['fresher','junior','mid','senior','lead'], required: true },
  experience_years: String,
  job_type: { type: String, enum: ['full-time','part-time','remote','hybrid','contract','internship'], required: true },
  location: String, department: String,
  salary_min: Number, salary_max: Number, salary_visible: { type: Boolean, default: true },
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ['active','paused','closed'], default: 'active' },
  is_featured: { type: Boolean, default: false },
  is_urgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  total_applications: { type: Number, default: 0 },
}, { timestamps: true });

schema.index({ title: 'text', description: 'text', skills_required: 'text' });

module.exports = mongoose.model('Job', schema);
