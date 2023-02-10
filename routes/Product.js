require('dotenv').config();
const express = require('express');

const router = express.Router();
const mongoose=require('mongoose');
const productSchema=require('../schemas/productSchema')
const Product=new mongoose.model("Product",productSchema);

router.get('/', (req, res) => {
    //Get all product
    console.log("Here Product Get All")
     Product.find({},(err,AllProduct)=>{
        if(err) res.status(500).json({error:"There was a error pulling all data"});
        else
        res.status(200).json(AllProduct);
    });
    

})
router.post('/', async(req, res) => {
    //Post a poduct
    console.log("Here Product Post")
    const newProduct= new Product(req.body);
    await newProduct.save((err)=>{
        if(err) {
            res.status(500).json({
                error:"there was a error in mongodb product!"
            });
        }else{
            res.status(201).json({
                message:"Product was inserted successfully"
            });
        }
    });
})


router.get('/:productId', (req, res) => {

    console.log("Here productId", req.params.productId)
    res.send(`Hi productId ${req.params.productId}`)

})

 module.exports = router;