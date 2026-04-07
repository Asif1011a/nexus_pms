const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['in-progress', 'planning', 'completed', 'on-hold'], default: 'planning' },
  priority:    { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  progress:    { type: Number, default: 0, min: 0, max: 100 },
  color:       { type: String, default: 'bg-violet-500' },
  dueDate:     { type: String, default: '' },
  startDate:   { type: String, default: '' },
  category:    { type: String, default: 'Web Development' },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
