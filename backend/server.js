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

// Connect DB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () =>
      console.log(`Nexus backend running on http://localhost:${process.env.PORT}`)
    )
  })
  .catch(err => { console.error('DB connection failed:', err.message); process.exit(1) })
