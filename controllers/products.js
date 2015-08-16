var express = require('express'), 
router = express.Router();

var Order = require('../models/order');
var Product = require('../models/product');
var User = require('../models/user');
  
router.get('/', function (req, res) {
  Product.find(function(err, products) {
    if (err) console.log(err);
    res.render('./products/index', { products: products, } )
  })
 
});
router.get('/:id/edit', function(req, res){
  Product.findById(req.params.id, function (err, product) {
    Product.find(function (err, products) {  
    res.render('./products/edit', { product: product, products: products})
  });
  });
})
router.get('/new', function (req, res){
  Product.find(function (err, products) {   
  res.render('./products/new', { products: products});
  });
})
router.post('/', function (req, res) {
  Product.create(req.body, function (err, product){
    if (err) console.log(err);
    res.redirect('/products/' + product.id);
  });
});

router.post('/addtocart', function (req, res) {
  Product.create(req.body, function (err, product){
    if (err) console.log(err);
    req.session.sessionFlash = "Added "+ req.body.name + " to cart."
    var backURL = req.header('Referer') || '/';
    res.redirect(backURL);
  });
});
router.get('/:id', function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) console.log(err);
    Product.find(function (err, products) {  
    res.render('./products/show', { product: product, products: products })
  });
  })
});
router.post('/:id', function (req,res) {
  Product.findByIdAndUpdate(req.params.id, req.body, function (err, product) {
    res.redirect('/products/'+ product.id);
  })
})
router.delete('/:id', function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) console.log(err);
    product.remove();
    res.redirect('/products');
  });
});

module.exports = router;