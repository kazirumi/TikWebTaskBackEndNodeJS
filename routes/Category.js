require('dotenv').config();
const express = require('express');

const router = express.Router();
const mongoose=require('mongoose');
const categorySchema=require('../schemas/CategorySchema')
const Category=new mongoose.model("category",categorySchema);

router.get('/', (req, res) => {
    //Get all product
    console.log("Here Category Get All")
    Category.find({},(err,AllProduct)=>{
        if(err) res.status(500).json({error:"There was a error pulling all data"});
        else
        res.status(200).json(AllProduct);
    });
})

 module.exports = router;