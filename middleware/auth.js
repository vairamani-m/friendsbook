const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const auth = async  (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({ message: "Invalid Authentication" })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded) return res.status(400).json({ message: "Invalid Authentication" })

        const user = await User.findOne({ _id: decoded.id })
        req.user = user
        next()

    } catch (error) {
        
    }
}

module.exports = auth