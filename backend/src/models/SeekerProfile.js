const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: String, bio: String, location: String, phone: String,
  skills: [String],
  experience_level: { type: String, enum: ['fresher','junior','mid','senior','lead'], default: 'fresher' },
  expected_salary: String, current_salary: String, notice_period: String,
  open_to_work: { type: Boolean, default: true },
  resume_url: String,
  job_type_pref: [String],
  saved_jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  social_links: { linkedin: String, github: String, portfolio: String, twitter: String },
  experience: [{ company: String, title: String, start_date: Date, end_date: Date, current: Boolean, description: String }],
  education: [{ institution: String, degree: String, field: String, start_year: Number, end_year: Number }],
  profile_views: { type: Number, default: 0 },
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('profile_completion').get(function() {
  let s = 0;
  if (this.headline) s += 20; if (this.bio) s += 15;
  if (this.skills?.length) s += 20; if (this.experience?.length) s += 20;
  if (this.education?.length) s += 15; if (this.resume_url) s += 10;
  return s;
});

module.exports = mongoose.model('SeekerProfile', schema);
