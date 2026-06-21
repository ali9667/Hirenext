const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  company_name: { type: String, default: '' },
  tagline: String, about_company: String,
  company_logo_url: String, company_banner_url: String,
  industry_type: String, organizations_type: String, team_size: String,
  location: String, company_website: String, careers_link: String,
  is_verified: { type: Boolean, default: false },
  is_hiring: { type: Boolean, default: true },
  total_jobs: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  profile_views: { type: Number, default: 0 },
  social_links: { linkedin: String, twitter: String, facebook: String },
  headquarter_phone_no: String, headquarter_mail_id: String,
}, { timestamps: true, toJSON: { virtuals: true } });

schema.virtual('setup_progress').get(function() {
  const f = ['company_name','about_company','industry_type','team_size','location','company_website'];
  return Math.round(f.filter(x => this[x]).length / f.length * 100);
});

module.exports = mongoose.model('Company', schema);
