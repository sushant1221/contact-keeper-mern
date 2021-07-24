const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');


// User Models
const User = require('../models/User');

//@route POST /api/users
//@desc registers a user
//@access public
const validator = [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Email is required').isEmail().not().isEmpty(),
    body('password', 'Password is required and should be atleast  6 ccharacters ').isLength({ min: 6 }).not().isEmpty()
]

router.post('/register', validator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        })
    }

    const { email, password, name } = req.body;

    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).send({
                msg:'User is already registered with this email id.'
            })
        }

        user = new User({
            email,
            password,
            name
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn:360000
        },(err,token)=>{
            if (err) throw err;
            res.status(200).json({
                token
            })
        })

    } catch (err) {
        return res.status(500).send({
            msg:'internal server error'
        })
    }
   
})



module.exports = router;