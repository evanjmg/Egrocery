var express = require('express'), 
router = express.Router();

var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');


authenticatedUser = function (req,res,next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/users/login');
}
// INDEX - SHOW ALL THE USER'S PRODUCTS
router.get('/', authenticatedUser, function (req, res) {
  res.render('./products/index', { products:  current_user.products , } )
});
// EDIT - PRODUCT
router.get('/:id/edit',authenticatedUser, function(req, res){
  Product.findById(req.params.id, function (err, product) {
    res.render('./products/edit', { product: product})
  });
});
//  NEW - PRODUCT
router.get('/new', authenticatedUser, function (req, res){
  res.render('./products/new', { products: products});
})
//  CREATE - PRODUCT
router.post('/', authenticatedUser, function (req, res) {
  Product.create(req.body, function (err, product){
    if (err) console.log(err);
    res.redirect('/products/' + product.id);
  });
});
//  ADD PRODUCT TO CART - AJAX
router.post('/addtocart', authenticatedUser, function (req, res) {
  Product.create(req.body, function (err, product){
    if (err) console.log(err);
    req.session.sessionFlash = "Added "+ req.body.name + " to cart."
    
    current_user.products.push(product);
    current_user.save(function (err) {});
    var backURL = req.header('Referer') || '/';
    res.redirect(backURL);
  });
});
// SHOW PRODUCT
router.get('/:id', function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) console.log(err);
    res.render('./products/show', { product: product })
  })
});
//  UPDATE PRODUCT
router.post('/:id',authenticatedUser, function (req,res) {
  Product.findByIdAndUpdate(req.params.id, req.body, function (err, product) {
    res.redirect('/products/'+ product.id);
  })
});
// DELETE ALL FROM CART -AJAX
router.delete('/deleteallfromcart', authenticatedUser, function (req, res) {
  User.findById(current_user.id, function (err, user) {
    user.products.splice(0,user.products.length);
    user.save(function (err){ 
      if(err) console.log(err)})   
  })
})
//  REMOVE FROM CART - AJAX
router.delete('/removefromcart', authenticatedUser, function (req, res) {
  User.findById(current_user.id, function (err, user) {
    var i = 0;
    for (i;i < user.products.length; i++) {
      if (user.products[i].name == req.body.name) {
        user.products.splice(i, 1);
        user.save(function (err){ if(err) console.log(err)})
        break;
      }
    }
  })
})
//  DELETE PRODUCT
router.delete('/:id', authenticatedUser, function (req, res) {
  Product.findById(req.params.id, function (err, product) {
   if (err) console.log(err);
   if (product) {
    product.remove(function (err){});
  }
  res.redirect('/products');

});
});

module.exports = router;