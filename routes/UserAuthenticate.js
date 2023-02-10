require('dotenv').config()
const express = require('express')
const router = express.Router();

const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    console.log("Here User")
    res.send("Hi User")

})

const  refreshTokenList=[];

router.post('/login', (req, res) => {
    //authenticate user
    console.log("Here Login", req.body)
    const username = req.body.username;
    const user = { name: username };

    const accesstoken = generateAccessToken(user);
    const refreshtoken= jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokenList.push(refreshtoken);
    res.json({ accesstoken: accesstoken, refreshtoken:refreshtoken });

})
router.post('/SignUp', (req, res) => {
    console.log("Here SignUp", req.body)
    res.json(req.body)

})

router.post('/generateAccessTokenFromRefreshToken', (req, res) => {
    const refreshToken=req.body.refreshToken;
    if(refreshToken==null) return res.sendStatus(401)
    if(!refreshTokenList.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken=generateAccessToken({name:user.name})

        res.json({accessToken:accessToken})
    })
    

})

router.get('/:userId', (req, res) => {

    console.log("Here UserID", req.params.userId)
    res.send(`Hi UserID ${req.params.userId}`)

})


function generateAccessToken(user){
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'30s'});
    return accesstoken;
}

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization']
//     const token= authHeader && authHeader.split(' ')[1]

//     if(token==null) return res.sendStatus(401)

//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
//         if(err) return res.sendStatus(403)
//         req.user=user
//         next()
//     })
// }


module.exports = router;