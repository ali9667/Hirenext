const r = require('express').Router();
const SeekerProfile = require('../models/SeekerProfile');
const { protect, seeker } = require('../middleware/auth');
r.use(protect, seeker);
r.get('/profile', async (req, res) => { try { res.json({ data: await SeekerProfile.findOne({ user_id: req.user._id }) }); } catch (e) { res.status(500).json({ message: e.message }); } });
r.put('/profile', async (req, res) => { try { const p = await SeekerProfile.findOneAndUpdate({ user_id: req.user._id }, { $set: req.body }, { new: true }); res.json({ data: p }); } catch (e) { res.status(500).json({ message: e.message }); } });
r.get('/saved', async (req, res) => { try { const p = await SeekerProfile.findOne({ user_id: req.user._id }).populate({ path: 'saved_jobs', populate: { path: 'company_id', select: 'company_name is_verified' } }); res.json({ data: p?.saved_jobs || [] }); } catch (e) { res.status(500).json({ message: e.message }); } });
module.exports = r;
