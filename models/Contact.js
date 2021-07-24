const { Schema, model } = require('mongoose');

const ContactSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        defaut: Date.now(),
    },
    phone: {
        type: String,
    },
    type:{
        type:String,
        default:'personal'
    },
    email:{
        type:String,
        required:true,
    }
});


module.exports = model('contact', ContactSchema);