const express = require('express')
const {
    signup,
    login,
    me,
    googleLogin,
} = require('../controllers/authController')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/google', googleLogin)
router.get('/me', requireAuth, me)
router.get('/config', (req, res) => {
    res.json({
        googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    })
})

module.exports = router
