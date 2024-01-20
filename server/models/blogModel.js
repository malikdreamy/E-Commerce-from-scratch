const {Schema, model} = require('mongoose');

const blogSchema = new Schema({
title:{ type: String, unique: false, require: true}, 
mainContent: { type: String, require: true },
secondContent: { type: String, require: false },
videos:[{type: String}],
createdAt: { type: Date, default: Date.now},
mainImage: { type: String},
images: [{type: String}],
links:[
  [{type: String}, // link title at index 0
    {type:String}] //link at index 1
]

});

const Product = model('Blog', blogSchema);

module.exports = Product;