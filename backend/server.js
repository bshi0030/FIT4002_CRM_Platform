const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

const authRoutes = require('./routes/auth')

const app = express()
app.use(cors())
app.use(express.json())

if (process.env.MONGO_URI) {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected successfully'))
        .catch((err) => console.log('MongoDB connection error:', err))
} else {
    console.warn('MONGO_URI not set; database features are disabled')
}

app.get('/', (req, res) => {
  res.send('NexGen CRM backend is running')
})

app.use('/api/auth', authRoutes)

app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({message: 'Internal server error'})
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
