require('dotenv').config();
const express = require('express');

const router = express.Router();
const mongoose=require('mongoose');
const variantSchema=require('../schemas/VariantsSchema')
const Variant=new mongoose.model("Variant",variantSchema);

router.get('/', (req, res) => {
    //Get all product
    console.log("Here Variant Get All")
    Variant.find({},(err,AllVariant)=>{
        if(err) res.status(500).json({error:"There was a error pulling all data"});
        else
        res.status(200).json(AllVariant);
    });
})

 module.exports = router;