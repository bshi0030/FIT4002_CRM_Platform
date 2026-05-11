const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const path = require('path')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err))

// Routes
app.use('/api/customers', require('./routes/customerRoutes'));

app.get('/', (req, res) => {
  res.send('NexGen CRM backend is running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))