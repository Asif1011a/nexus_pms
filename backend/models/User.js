const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const COLORS = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500']

function buildInitials(name) {
  const parts = (name || '').trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].substring(0, 2).toUpperCase()
  return (name || '??').substring(0, 2).toUpperCase()
}

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6 },
  role:       { type: String, enum: ['admin', 'user'], default: 'user' },
  initials:   { type: String },
  color:      { type: String },
  jobTitle:   { type: String, default: 'Team Member' },
  department: { type: String, default: 'General' },
  phone:      { type: String, default: '' },
  joined:     { type: String },
  active:     { type: Boolean, default: true },
  lastLogin:  { type: Date, default: null },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.initials) {
    this.initials = buildInitials(this.name)
  }
  if (!this.color) {
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
  }
  if (!this.joined) {
    this.joined = new Date().toISOString().split('T')[0]
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
