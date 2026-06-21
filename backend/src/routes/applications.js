const r = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const Company = require('../models/Company');
const SeekerProfile = require('../models/SeekerProfile');
const { protect, seeker, company } = require('../middleware/auth');

r.post('/', protect, seeker, async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;
    const job = await Job.findById(job_id);
    if (!job || job.status !== 'active') return res.status(404).json({ message: 'Job not available' });
    if (await Application.findOne({ job_id, applicant_id: req.user._id }))
      return res.status(409).json({ message: 'Already applied to this job' });
    const app = await Application.create({ job_id, applicant_id: req.user._id, company_id: job.company_id, cover_letter, status_history: [{ status: 'applied' }] });
    await Job.findByIdAndUpdate(job_id, { $inc: { total_applications: 1 } });
    res.status(201).json({ data: app });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.get('/my', protect, seeker, async (req, res) => {
  try {
    const data = await Application.find({ applicant_id: req.user._id })
      .populate('job_id', 'title job_type location salary_min salary_max experience_level')
      .populate('company_id', 'company_name company_logo_url is_verified')
      .sort({ createdAt: -1 });
    res.json({ data });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.get('/job/:jobId', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const data = await Application.find({ job_id: req.params.jobId, company_id: co._id })
      .populate('applicant_id', 'full_name email').populate('job_id', 'title').sort({ createdAt: -1 });
    res.json({ data });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.patch('/:id/status', protect, company, async (req, res) => {
  try {
    const co = await Company.findOne({ owner_id: req.user._id });
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, company_id: co._id },
      { status: req.body.status, $push: { status_history: { status: req.body.status } } },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Not found' });
    res.json({ data: app });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.post('/save/:jobId', protect, seeker, async (req, res) => {
  try {
    const profile = await SeekerProfile.findOne({ user_id: req.user._id });
    const id = req.params.jobId;
    const isSaved = profile.saved_jobs.includes(id);
    isSaved ? profile.saved_jobs.pull(id) : profile.saved_jobs.push(id);
    await profile.save();
    res.json({ saved: !isSaved });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = r;
