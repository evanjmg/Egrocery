mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Order = mongoose.model('Order');
var Product = mongoose.model('Product');

var userSchema = new mongoose.Schema({ 
  local: {
    name: String,
    email: String,
    password: String
  },
  google: {
    id:String,
    photo: String,
    gender: String,
    displayName: String,
    accesstoken: String
  },
  address: String,
  orders: [Order.schema],
  products: [Product.schema],
  created_at: Date,
  updated_at: Date
});
userSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
}
userSchema.methods.validPassword =
function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model('User', userSchema);
module.exports = User;
