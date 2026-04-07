require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.CLIENT_URL
].filter(Boolean)

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

// Routes
app.use('/api/auth',          require('./routes/auth'))
app.use('/api/users',         require('./routes/users'))
app.use('/api/projects',      require('./routes/projects'))
app.use('/api/tasks',         require('./routes/tasks'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/activities',    require('./routes/activities'))

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// 404
app.use((_, res) => res.status(404).json({ success: false, error: 'Route not found.' }))

// Connect DB then start server (Direct listen only in local dev)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
    
    // Only listen if NOT running on Vercel (Production)
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 5000
      app.listen(port, () =>
        console.log(`Nexus backend running locally on http://localhost:${port}`)
      )
    }
  } catch (err) {
    console.error('DB connection failed:', err.message)
    // Don't exit in production/serverless, let it retry or fail gracefully
    if (process.env.NODE_ENV !== 'production') process.exit(1)
  }
}

connectDB()

// Required for Vercel Serverless Functions
module.exports = app
