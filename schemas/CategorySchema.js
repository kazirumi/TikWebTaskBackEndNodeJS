const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    id: String,
    categoryName: String
});

module.exports = categorySchema;