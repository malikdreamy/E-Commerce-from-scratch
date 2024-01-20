const {Schema, model} = require('mongoose');

const productSchema = new Schema({
productName:{ type: String, unique: true}, 
price: { type: String, require: true },
category: {type: String, require: true},
subCategory: {type: String, require: true},
createdAt: { type: Date, default: Date.now},
mainImage: { type: String, required: true },
images: [{type: String, required: true }],
 description: { type: String },
 options: [{type: String}]
});

const Product = model('Product', productSchema);

module.exports = Product;