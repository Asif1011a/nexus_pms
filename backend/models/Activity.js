const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:  { type: String, required: true },
  subject: { type: String, default: '' },
  project: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Activity', activitySchema)
