const express = require('express')
const userModel = require('../models/userModel')
const router = express()
const bcrypt = require('bcrypt')

// Register user
router.post('/register', async (req, res) => {

    try {
        const password = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
        username: req.body.username,
        password: password
        })

        const findUser = await userModel.findOne ({ username: req.body.username })
    
        if (!findUser) {
            await user.save()
            res.send(user)
        } else {
            res.status(400).json('Username already exists')
        }

    } catch (err) {
        res.status(500).send(err)
    }
})

// Login user
router.post("/login", async (req, res) => {
    const user = await userModel.findOne({ username: req.body.username })

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
       
        return res.status(401).json('Wrong username or password')
    }

    req.session.username = user.username
    
    res.status(200).json('You are logged in')
})

// Get all users
router.get('/', async (req, res) => {

    try {
        const users = await userModel.find()
        res.send(users)

    } catch (err) {
        res.status(500).send(err)
    }
})

// Logout user
router.delete('/logout', async (req, res) => {

    try {

    req.session = null
    res.send('You are now logged out!')

    } catch (err) {
        res.status(500).send(err)
    }
})



module.exports = router