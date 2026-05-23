const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')

dotenv.config()

const authRoutes = require('./routes/auth')

const app = express()

app.set('trust proxy', 1)

app.use(helmet())

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
            return cb(new Error('Origin not allowed by CORS'))
        },
        credentials: true,
    })
)

app.use(express.json({limit: '100kb'}))

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

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


const stageRoutes = require('./routes/stageRoutes')
app.use('/api/stages', stageRoutes)

const dealRoutes = require('./routes/dealRoutes')
app.use('/api/deals', dealRoutes)

const taskRoutes = require('./routes/taskRoutes')
app.use('/api/tasks', taskRoutes)