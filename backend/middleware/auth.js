const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Not authenticated.' })
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ success: false, error: 'User not found.' })
    if (!req.user.active) return res.status(403).json({ success: false, error: 'Account deactivated.' })
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token.' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required.' })
  }
  next()
}

module.exports = { protect, adminOnly }
