const express = require('express');
const app = express();
const connectDB = require('./config/db')
const routes = require('./routes');

// Connect to Database
connectDB();


// Init Middleware
app.use(express.json({extended:false}));

//Routing
app.use('/api',routes);


// 404 routes
app.all('*', (req, res) => {
    res.send({
        msg:'404 not  found'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on ${PORT}`));