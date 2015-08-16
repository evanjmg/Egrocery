mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  price: String,
  description: String,
  image:  String,
  brand: String,
  created_at: Date,
  updated_at: Date
});

var Product = mongoose.model('Product', productSchema);
module.exports = Product;