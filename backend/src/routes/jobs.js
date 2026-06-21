const r = require('express').Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const { protect, company } = require('../middleware/auth');

r.get('/', async (req, res) => {
  try {
    const { q, location, job_type, experience_level, page = 1, limit = 15 } = req.query;
    const f = { status: 'active' };
    if (q) f.$text = { $search: q };
    if (location) f.location = { $regex: location, $options: 'i' };
    if (job_type) f.job_type = job_type;
    if (experience_level) f.experience_level = experience_level;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Job.find(f).populate('company_id', 'company_name company_logo_url is_verified industry_type location team_size').sort({ is_featured: -1, is_urgent: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(f)
    ]);
    res.json({ data, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.get('/my', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const data = await Job.find({ company_id: co?._id }).sort({ createdAt: -1 });
    res.json({ data });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate('company_id', 'company_name company_logo_url is_verified industry_type team_size company_website about_company location social_links');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ data: job });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.post('/', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    if (!co) return res.status(404).json({ message: 'Setup your company profile first' });
    const job = await Job.create({ ...req.body, company_id: co._id, posted_by: req.user._id });
    await Company.findByIdAndUpdate(co._id, { $inc: { total_jobs: 1 } });
    res.status(201).json({ data: job });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.put('/:id', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const job = await Job.findOneAndUpdate({ _id: req.params.id, company_id: co._id }, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json({ data: job });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.delete('/:id', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const job = await Job.findOneAndDelete({ _id: req.params.id, company_id: co._id });
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = r;
