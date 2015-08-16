mongoose = require('mongoose');

var Order = mongoose.model('Order');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  orders: [Order.schema],
  created_at: Date,
  updated_at: Date
});
var User = mongoose.model('User', userSchema);
module.exports = User;