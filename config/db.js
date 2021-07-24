const db = require('mongoose');
const config = require('config');

const dbURI = config.get('mongoURI');

const connectDB = async ()=>{
    
    try {
        await db.connect(dbURI,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology: true
        });
        console.log('Database connection successfull')
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
} 


module.exports = connectDB;