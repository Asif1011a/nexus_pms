const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')
const { generateOTP, storeOTP, verifyOTP, clearOTP } = require('../utils/otp')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required.' })

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password.' })
    if (!user.active) return res.status(403).json({ success: false, error: 'Account deactivated. Contact your admin.' })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ success: false, error: 'Invalid email or password.' })

    // Fire-and-forget the update to return response immediately
    User.findByIdAndUpdate(user._id, { lastLogin: new Date() }).catch(err => console.error('Login update failed:', err))

    res.json({ success: true, token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, jobTitle, department } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: 'Name, email and password are required.' })

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(409).json({ success: false, error: 'An account with this email already exists.' })

    const user = await User.create({ name, email, password, jobTitle, department, role: 'user' })
    res.status(201).json({ success: true, token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email?.toLowerCase() })
    if (!user) return res.status(404).json({ success: false, error: 'No account found with this email.' })

    const otp = generateOTP()
    storeOTP(email, otp)

    // In production: send otp via email. For demo we return it.
    res.json({ success: true, otp })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body
  const result = verifyOTP(email, otp)
  if (!result.success) return res.status(400).json(result)
  res.json({ success: true })
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const check = verifyOTP(email, otp)
    if (!check.success) return res.status(400).json(check)

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })

    user.password = newPassword
    await user.save()
    clearOTP(email)

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/auth/me  — returns current user from token
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() })
})

module.exports = router
