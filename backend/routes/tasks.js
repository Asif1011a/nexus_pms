const router = require('express').Router()
const Task = require('../models/Task')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)

// GET /api/tasks — optionally filter by ?projectId=
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.projectId) filter.projectId = req.query.projectId
    // Regular users only see their assigned tasks
    if (req.user.role !== 'admin') filter.assignee = req.user._id

    const tasks = await Task.find(filter)
      .populate('assignee', 'name initials color')
      .populate('projectId', 'name color')
      .sort({ createdAt: -1 })
    res.json({ success: true, tasks })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name initials color')
      .populate('projectId', 'name color')
    if (!task) return res.status(404).json({ success: false, error: 'Task not found.' })
    res.json({ success: true, task })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/tasks — admin only
router.post('/', adminOnly, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id })
    await task.populate('assignee', 'name initials color')
    res.status(201).json({ success: true, task })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/tasks/:id — admin can update all fields; user can only move status
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ success: false, error: 'Task not found.' })

    if (req.user.role !== 'admin') {
      // Users can only update status of their own tasks
      if (task.assignee?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Forbidden.' })
      }
      if (req.body.status) task.status = req.body.status
    } else {
      Object.assign(task, req.body)
    }

    await task.save()
    await task.populate('assignee', 'name initials color')
    res.json({ success: true, task })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/tasks/:id — admin only
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ success: false, error: 'Task not found.' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
