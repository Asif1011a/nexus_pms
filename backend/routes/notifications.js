const router = require('express').Router()
const Notification = require('../models/Notification')
const { protect } = require('../middleware/auth')

router.use(protect)

// POST /api/notifications/send-to-admins — user sends a message to all admins
router.post('/send-to-admins', async (req, res) => {
  try {
    const { message, type = 'mention' } = req.body
    if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message is required.' })
    const User = require('../models/User')
    const admins = await User.find({ role: 'admin', active: true }).select('_id')
    if (!admins.length) return res.status(404).json({ success: false, error: 'No admins found.' })
    const notifications = await Notification.insertMany(
      admins.map(admin => ({ userId: admin._id, type, message: `${req.user.name}: ${message}`, read: false }))
    )
    res.status(201).json({ success: true, notifications })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/notifications — current user's notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, notifications })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    )
    if (!n) return res.status(404).json({ success: false, error: 'Notification not found.' })
    res.json({ success: true, notification: n })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
