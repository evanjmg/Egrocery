mongoose = require('mongoose');

var Product = mongoose.model('Product');

var orderSchema = new mongoose.Schema({
  products: [Product.schema],
  total: String,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});



var Order = mongoose.model('Order', orderSchema);

module.exports = Order;