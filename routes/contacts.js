const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const Contact = require('../models/Contact');

//@route GET /api/contacts
//@desc get all contacts for the user
//@access private

router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        return res.send({
            contacts
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({
            msg: 'internal server error'
        })
    }
})



//@route POST /api/contacts
//@desc craeate contacts for the user
//@access private

const validator = [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Email is required').isEmail().not().isEmpty(),
    body('phone', 'Phone number must be 10 digit long ').isLength({ min: 10, max: 10 }).not().isEmpty(),
]

router.post('/', [auth, validator], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        })
    }
    const { email, name, phone, type } = req.body;
    try {

        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        })

        const contact = await newContact.save();

        res.send(contact);


    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: 'internal server error'
        })
    }

    res.send({
        msg: 'create contacts'
    })
})



//@route PUT /api/contacts
//@desc edit contacts by id for the user
//@access private

router.put('/:id', auth, async (req, res) => {
    const { email, name, phone, type } = req.body;

    const contactFields = {};

    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type

    try {
        let contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).send({
                msg: ' contact witht he given id is not found'
            })
        }
        console.log(contact);
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).send('unauthorized request');
        }
        contact = await Contact.findByIdAndUpdate(req.params.id,
            { $set: contactFields },
            { new: true });
        res.send(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: 'internal server error'
        })
    }

    res.send({
        msg: 'edit contacts'
    })
})



//@route DELETE /api/contacts
//@desc delete contacts for the given user
//@access private

router.delete('/:id', auth, async (req, res) => {

    try {
        let contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).send({
                msg: ' contact witht he given id is not found'
            })
        }
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).send('unauthorized request');
        }
        contact = await Contact.findOneAndRemove(req.params.id);
        res.send({
            msg: 'contacts removed'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            msg: 'internal server error'
        })
    }
})



module.exports = router