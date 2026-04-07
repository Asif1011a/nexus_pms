const router = require('express').Router()
const User = require('../models/User')
const { protect, adminOnly } = require('../middleware/auth')

// All routes require auth
router.use(protect)

// GET /api/users — admin: all users, user: just themselves
router.get('/', async (req, res) => {
  try {
    const users = req.user.role === 'admin'
      ? await User.find().select('-password').sort({ createdAt: 1 })
      : [req.user.toSafeObject()]
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/users — admin creates a user
router.post('/', adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, jobTitle, department } = req.body
    const exists = await User.findOne({ email: email?.toLowerCase() })
    if (exists) return res.status(409).json({ success: false, error: 'Email already exists.' })

    const user = await User.create({
      name, email, password: password || 'Nexus@123',
      role: role || 'user', jobTitle, department,
    })
    res.status(201).json({ success: true, user: user.toSafeObject() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/users/:id — update user (admin can update anyone, user can update self)
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Forbidden.' })
    }
    const { password, role, ...updates } = req.body

    // Only admin can change role
    if (role && req.user.role === 'admin') updates.role = role

    // Handle password change separately
    if (password) {
      const user = await User.findById(req.params.id)
      if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
      // If currentPassword provided, verify it (self-service password change)
      if (req.body.currentPassword) {
        const match = await user.comparePassword(req.body.currentPassword)
        if (!match) return res.status(400).json({ success: false, error: 'Current password is incorrect.' })
      }
      user.password = password
      Object.assign(user, updates)
      await user.save()
      return res.json({ success: true, user: user.toSafeObject() })
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password')
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/users/:id — admin only
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account.' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
