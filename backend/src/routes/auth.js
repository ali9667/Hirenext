const r = require('express').Router();
const User = require('../models/User');
const Company = require('../models/Company');
const SeekerProfile = require('../models/SeekerProfile');
const { sign } = require('../utils/jwt');
const { protect } = require('../middleware/auth');

r.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, userType } = req.body;
    if (!email || !password || !full_name || !userType)
      return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ email, password, full_name, userType });
    let profile = userType === 'seeker'
      ? await SeekerProfile.create({ user_id: user._id })
      : await Company.create({ owner_id: user._id, company_name: full_name + "'s Company" });
    res.status(201).json({ token: sign(user._id), user: user.safe(), profile });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const profile = user.userType === 'seeker'
      ? await SeekerProfile.findOne({ user_id: user._id })
      : await Company.findOne({ owner_id: user._id });
    res.json({ token: sign(user._id), user: user.safe(), profile });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

r.get('/me', protect, async (req, res) => {
  try {
    const profile = req.user.userType === 'seeker'
      ? await SeekerProfile.findOne({ user_id: req.user._id })
      : await Company.findOne({ owner_id: req.user._id });
    res.json({ user: req.user, profile });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = r;
