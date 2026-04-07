const router = require('express').Router()
const Project = require('../models/Project')
const Task = require('../models/Task')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('members', '-password')
      .populate('createdBy', 'name initials color')
      .sort({ createdAt: -1 })
    res.json({ success: true, projects })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', '-password')
      .populate('createdBy', 'name initials color')
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' })
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/projects — admin only
router.post('/', adminOnly, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id })
    await project.populate('members', '-password')
    res.status(201).json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/projects/:id — admin only
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('members', '-password')
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' })
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/projects/:id — admin only (also deletes tasks)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' })
    await Task.deleteMany({ projectId: req.params.id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
