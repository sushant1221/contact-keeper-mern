const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = (req,res,next)=>{

    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).send({
            msg:'noToken. Authentication failed'
        })
    }

    try{

        const decoded = jwt.verify(token,config.get('jwtSecret'));
        console.log(decoded);
        req.user = decoded.user;
        next();


    }catch(err){
        console.log(err);
        res.status(401).send({
            err:'invalid token'
        })
    }


    
}
