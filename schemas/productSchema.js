const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    productName:{
        type:String,
    },
    collectionName:String,
    category:{
        id:String,
        categoryName:String
    },
    imagePath:[{path:String}],
    description:String,
    videoURL:String,
    varient:{
        id:String,
        varientName:String,
        varientSubName:[{Name:String}],
    },
    
    status:{
        type:String,
        enum:["active","inactive"]
    },
    price:Number,
    stock:Number
});

module.exports=productSchema;