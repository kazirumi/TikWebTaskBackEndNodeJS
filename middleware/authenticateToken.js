require('dotenv').config()
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]
    const refreshtoken = req.headers['refreshtoken']
    if(token==null  && refreshtoken==null)
    {
        return res.sendStatus(401)
    }else{
        //Checking JWT Access Token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err)
            {   
                //Check Refresh token
                return res.sendStatus(401)
            } 
            req.user=user
            next()
        })
    }  
}


module.exports=authenticateToken;