const { verify } = require('../utils/jwt');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const { id } = verify(token);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};

exports.company = (req, res, next) => {
  if (req.user?.userType !== 'company') return res.status(403).json({ message: 'Company only' });
  next();
};

exports.seeker = (req, res, next) => {
  if (req.user?.userType !== 'seeker') return res.status(403).json({ message: 'Seeker only' });
  next();
};
