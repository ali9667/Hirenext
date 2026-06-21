const r = require('express').Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, company } = require('../middleware/auth');
r.use(protect, company);
r.get('/profile', async (req, res) => { try { res.json({ data: await Company.findOne({ owner_id: req.user._id }) }); } catch (e) { res.status(500).json({ message: e.message }); } });
r.put('/profile', async (req, res) => { try { const c = await Company.findOneAndUpdate({ owner_id: req.user._id }, { $set: req.body }, { new: true, upsert: true }); res.json({ data: c }); } catch (e) { res.status(500).json({ message: e.message }); } });
r.get('/stats', async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    if (!co) return res.json({ data: {} });
    const [activeJobs, totalJobs, totalApps, newApps] = await Promise.all([
      Job.countDocuments({ company_id: co._id, status: 'active' }),
      Job.countDocuments({ company_id: co._id }),
      Application.countDocuments({ company_id: co._id }),
      Application.countDocuments({ company_id: co._id, createdAt: { $gte: new Date(Date.now() - 7*864e5) } })
    ]);
    res.json({ data: { activeJobs, totalJobs, totalApps, newApps } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
r.get('/progress', async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const steps = [
      { key: 'basic', name: 'Company info', done: !!(co?.company_name && co?.about_company) },
      { key: 'industry', name: 'Industry & size', done: !!(co?.industry_type && co?.team_size) },
      { key: 'location', name: 'Location & website', done: !!(co?.location && co?.company_website) },
      { key: 'contact', name: 'Contact details', done: !!co?.headquarter_mail_id },
    ];
    res.json({ data: { progress: Math.round(steps.filter(s => s.done).length / steps.length * 100), steps } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = r;
