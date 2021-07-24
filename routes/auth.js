const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

//Authentication middleware
const auth = require('../middleware/auth');

// User Models
const User = require('../models/User');



//@route POST /api/auth
//@desc get loggedin user
//@access private

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findById(req.user.id).select('-password');
        res.send({
            users
        })
    } catch (err) {
        console.err(err.message);
        res.status(500).send({
            msg: 'server error',
        })
    }

})



//@route POST /api/auth
//@desc authenticate user and get token
//@access private
const validator = [
    body('email', 'Email is required').isEmail().not().isEmpty(),
    body('password', 'Password is required and should be atleast  6 ccharacters ').isLength({ min: 6 }).not().isEmpty()
];

router.post('/', validator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        })
    }

    const { email, password } = req.body;


    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                msg: 'User not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({
                msg: 'Invalid credentials'
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
                token
            })
        })


    } catch (err) {
        res.status(500).send({
            err: err.message
        })
    }


})



module.exports = router;