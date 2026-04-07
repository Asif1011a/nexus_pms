const router = require('express').Router()
const Activity = require('../models/Activity')
const { protect } = require('../middleware/auth')

router.use(protect)

// GET /api/activities — recent team activity
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('userId', 'name initials color')
      .sort({ createdAt: -1 })
      .limit(20)
    res.json({ success: true, activities })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/activities — internal use (log an activity)
router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create({ ...req.body, userId: req.user._id })
    await activity.populate('userId', 'name initials color')
    res.status(201).json({ success: true, activity })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
