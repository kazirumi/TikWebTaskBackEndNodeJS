const mongoose = require('mongoose');

const variantSchema = mongoose.Schema({  
        id:String,
        varientName:String,
        varientSubName:[{Name:String}],
});

module.exports = variantSchema;