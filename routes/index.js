const express = require('express');
const app = express();

// User routes
const userRoutes = require('./users');
app.use('/users', userRoutes)

// contact routes
const contactRoutes = require('./contacts');
app.use('/contacts', contactRoutes)


// authentication routes
const authRoutes = require('./auth');
app.use('/auths', authRoutes);


module.exports = app;