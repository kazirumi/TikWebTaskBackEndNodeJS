require('dotenv').config()
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const mongoose=require('mongoose');
const bcrypt= require('bcrypt');
const userSchema=require('../schemas/UserSchema')
const userModel=new mongoose.model("User",userSchema);

router.get('/', (req, res) => {
    console.log("Here User")
    res.send("Hi User")

})

//This Variable holds the refresh token
// we can also save refresh token in db or caching
const  refreshTokenList=[];

router.post('/login', async(req, res) => {
    userModel.find({},(err,AllUser)=>{
        if(err) res.status(500).json({error:"There was a error pulling all User Data"});
        else{
            let user=AllUser.find(x=>x.username==req.body.username);
            if(user==null){
                res.status(400).json("can not find user");
            }else{
                try{
                    (async () => {
                        // Load hash from your password DB.
                        let passwordCheck=await bcrypt.compare(req.body.password,user.password);
                        if(passwordCheck){
                            // //authenticate user
                            console.log("Here Login after user and password check", req.body)
                            const username = req.body.username;
                            const user = { name: username };
                        
                            //generating access an refresh token
                            const accesstoken = generateAccessToken(user);
                            const refreshtoken= jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                            refreshTokenList.push(refreshtoken);
                            res.json({ accesstoken: accesstoken, refreshtoken:refreshtoken });
                          } else{
                            res.status(400).json("Password did not matched");
                          }
                    })();                    
                }
                catch{
                    res.status(500).send("Something went wrong during password match");
                }  
                
            }
        } 
    });
})

router.post('/signup', async(req, res) => {
    req.body.password= await bcrypt.hash(req.body.password,10);
    const newUser= new userModel(req.body);
    await newUser.save((err)=>{
        if(err) {
            res.status(500).json({
                error:"there was a error in mongodb User!"
            });
        }else{
            res.status(201).json({
                message:"User was inserted successfully"
            });
        }
    });

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

// JWT Token generated here with 5 miniute
//It can be modified for checking the Refresh Token
function generateAccessToken(user){
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5m'});
    return accesstoken;
}




module.exports = router;
